import googleTrends from 'google-trends-api';

interface MarketData {
  keyword: string;
  searchVolume: {
    current: number;
    trend: 'rising' | 'stable' | 'declining';
    seasonality: string;
    peakMonths: string[];
  };
  competition: {
    level: 'low' | 'medium' | 'high';
    score: number;
    marketSaturation: string;
  };
  opportunity: {
    profitability: 'high' | 'medium' | 'low';
    difficulty: 'easy' | 'medium' | 'hard';
    recommendation: string;
  };
  relatedKeywords: {
    keyword: string;
    popularity: number;
    trend: string;
  }[];
  insights: {
    bestProductTypes: string[];
    targetAudience: string;
    suggestedPrice: string;
    marketingTips: string[];
  };
}

export class PODMarketAnalyzer {
  
  async analyzeKeyword(keyword: string): Promise<MarketData> {
    try {
      // Get trend data for the last 12 months
      const trendData = await this.getTrendData(keyword);
      const relatedQueries = await this.getRelatedQueries(keyword);
      const seasonalData = this.analyzeSeasonality(trendData);
      
      // Calculate competition and opportunity scores
      const competition = this.calculateCompetition(trendData, relatedQueries);
      const opportunity = this.calculateOpportunity(trendData, competition);
      
      // Generate insights and recommendations
      const insights = this.generateInsights(keyword, trendData, opportunity);

      return {
        keyword,
        searchVolume: {
          current: trendData.averagePopularity,
          trend: trendData.trend,
          seasonality: seasonalData.pattern,
          peakMonths: seasonalData.peakMonths
        },
        competition,
        opportunity,
        relatedKeywords: relatedQueries,
        insights
      };

    } catch (error) {
      throw new Error(`Failed to analyze keyword: ${error.message}`);
    }
  }

  private async getTrendData(keyword: string) {
    const results = await googleTrends.interestOverTime({
      keyword: keyword,
      startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 12 months ago
      endTime: new Date(),
    });

    const parsedData = JSON.parse(results);
    const timelineData = parsedData.default?.timelineData || [];

    if (timelineData.length === 0) {
      throw new Error('No trend data available for this keyword');
    }

    // Calculate average popularity
    const values = timelineData.map((item: any) => item.value?.[0] || 0);
    const averagePopularity = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;

    // Determine trend direction (last 3 months vs previous 3 months)
    const recent = values.slice(-12); // Last 3 months (weekly data)
    const previous = values.slice(-24, -12); // Previous 3 months
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
    
    let trend: 'rising' | 'stable' | 'declining' = 'stable';
    if (recentAvg > previousAvg * 1.15) trend = 'rising';
    else if (recentAvg < previousAvg * 0.85) trend = 'declining';

    return {
      timelineData,
      values,
      averagePopularity: Math.round(averagePopularity),
      trend,
      recentAvg,
      previousAvg
    };
  }

  private async getRelatedQueries(keyword: string) {
    try {
      const results = await googleTrends.relatedQueries({ keyword });
      const parsedData = JSON.parse(results);
      
      const topQueries = parsedData.default?.rankedList?.[0]?.rankedKeyword || [];
      const risingQueries = parsedData.default?.rankedList?.[1]?.rankedKeyword || [];

      return [
        ...topQueries.slice(0, 5).map((item: any) => ({
          keyword: item.query,
          popularity: item.value,
          trend: 'stable'
        })),
        ...risingQueries.slice(0, 3).map((item: any) => ({
          keyword: item.query,
          popularity: item.value === 'Breakout' ? 100 : parseInt(item.value) || 50,
          trend: 'rising'
        }))
      ];
    } catch (error) {
      return [];
    }
  }

  private analyzeSeasonality(trendData: any) {
    const monthlyData = this.groupByMonth(trendData.timelineData);
    
    // Find peak months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const peakMonths = Object.entries(monthlyData)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([month]) => monthNames[parseInt(month)]);

    // Determine seasonality pattern
    const values = Object.values(monthlyData) as number[];
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const variance = maxVal - minVal;
    
    let pattern = 'steady';
    if (variance > 30) pattern = 'highly seasonal';
    else if (variance > 15) pattern = 'seasonal';
    
    return { pattern, peakMonths };
  }

  private groupByMonth(timelineData: any[]) {
    const monthlyData: { [key: number]: number } = {};
    
    timelineData.forEach((item: any) => {
      const date = new Date(item.time * 1000);
      const month = date.getMonth();
      const value = item.value?.[0] || 0;
      
      if (!monthlyData[month]) monthlyData[month] = 0;
      monthlyData[month] += value;
    });
    
    // Average the values
    Object.keys(monthlyData).forEach(month => {
      monthlyData[parseInt(month)] = monthlyData[parseInt(month)] / 4; // Rough average over quarters
    });
    
    return monthlyData;
  }

  private calculateCompetition(trendData: any, relatedQueries: any[]) {
    // Simple competition scoring based on search volume and related keywords
    const avgPopularity = trendData.averagePopularity;
    const relatedCount = relatedQueries.length;
    
    let score = 0;
    let level: 'low' | 'medium' | 'high' = 'low';
    let marketSaturation = '';

    // Higher search volume usually means more competition
    if (avgPopularity > 70) {
      score += 40;
    } else if (avgPopularity > 40) {
      score += 25;
    } else {
      score += 10;
    }

    // More related keywords = more competition
    if (relatedCount > 6) {
      score += 30;
    } else if (relatedCount > 3) {
      score += 20;
    } else {
      score += 10;
    }

    // Trend factor
    if (trendData.trend === 'rising') {
      score += 20; // Rising trends attract more competitors
    }

    if (score > 70) {
      level = 'high';
      marketSaturation = 'Saturated market - many sellers competing';
    } else if (score > 40) {
      level = 'medium';
      marketSaturation = 'Moderate competition - good balance of demand and supply';
    } else {
      level = 'low';
      marketSaturation = 'Low competition - great opportunity for new sellers';
    }

    return { level, score, marketSaturation };
  }

  private calculateOpportunity(trendData: any, competition: any) {
    const { averagePopularity, trend } = trendData;
    const { level: compLevel, score: compScore } = competition;
    
    let profitability: 'high' | 'medium' | 'low' = 'low';
    let difficulty: 'easy' | 'medium' | 'hard' = 'hard';
    let recommendation = '';

    // High search volume + low competition = high opportunity
    if (averagePopularity > 30 && compLevel === 'low') {
      profitability = 'high';
      difficulty = 'easy';
      recommendation = '🔥 Excellent opportunity! High demand with low competition.';
    } else if (averagePopularity > 50 && compLevel === 'medium') {
      profitability = 'high';
      difficulty = 'medium';
      recommendation = '✅ Good opportunity! Solid demand, manageable competition.';
    } else if (averagePopularity > 20 && compLevel === 'low') {
      profitability = 'medium';
      difficulty = 'easy';
      recommendation = '👍 Decent opportunity! Lower risk, steady demand.';
    } else if (averagePopularity > 60 && compLevel === 'high') {
      profitability = 'medium';
      difficulty = 'hard';
      recommendation = '⚠️ Competitive market! High demand but many sellers.';
    } else if (averagePopularity < 20) {
      profitability = 'low';
      difficulty = 'medium';
      recommendation = '⛔ Low opportunity! Limited search demand.';
    } else {
      profitability = 'low';
      difficulty = 'hard';
      recommendation = '❌ Avoid! High competition with limited upside.';
    }

    // Boost for rising trends
    if (trend === 'rising') {
      if (profitability === 'medium') profitability = 'high';
      if (profitability === 'low') profitability = 'medium';
      recommendation += ' 📈 Rising trend detected - act fast!';
    }

    return { profitability, difficulty, recommendation };
  }

  private generateInsights(keyword: string, trendData: any, opportunity: any) {
    const { averagePopularity, trend } = trendData;
    
    // Suggest best product types based on keyword analysis
    const bestProductTypes = this.suggestProductTypes(keyword);
    
    // Target audience analysis
    const targetAudience = this.analyzeTargetAudience(keyword);
    
    // Price suggestions
    const suggestedPrice = this.suggestPricing(opportunity.profitability, opportunity.difficulty);
    
    // Marketing tips
    const marketingTips = this.generateMarketingTips(keyword, trend, opportunity);

    return {
      bestProductTypes,
      targetAudience,
      suggestedPrice,
      marketingTips
    };
  }

  private suggestProductTypes(keyword: string): string[] {
    const kw = keyword.toLowerCase();
    
    if (kw.includes('motivational') || kw.includes('quote') || kw.includes('inspiration')) {
      return ['T-shirts', 'Posters', 'Mugs', 'Phone Cases', 'Notebooks'];
    } else if (kw.includes('cute') || kw.includes('kawaii') || kw.includes('funny')) {
      return ['Stickers', 'T-shirts', 'Tote Bags', 'Pins', 'Keychains'];
    } else if (kw.includes('vintage') || kw.includes('retro')) {
      return ['T-shirts', 'Hoodies', 'Posters', 'Canvas Prints', 'Coasters'];
    } else if (kw.includes('gaming') || kw.includes('gamer')) {
      return ['T-shirts', 'Hoodies', 'Mouse Pads', 'Stickers', 'Phone Cases'];
    } else if (kw.includes('fitness') || kw.includes('gym')) {
      return ['Tank Tops', 'Water Bottles', 'Gym Bags', 'T-shirts', 'Towels'];
    }
    
    return ['T-shirts', 'Mugs', 'Stickers', 'Phone Cases', 'Tote Bags'];
  }

  private analyzeTargetAudience(keyword: string): string {
    const kw = keyword.toLowerCase();
    
    if (kw.includes('mom') || kw.includes('mother')) {
      return 'Mothers, ages 25-45, interested in family and lifestyle products';
    } else if (kw.includes('gaming') || kw.includes('gamer')) {
      return 'Gaming enthusiasts, ages 16-35, primarily male, tech-savvy';
    } else if (kw.includes('fitness') || kw.includes('gym')) {
      return 'Fitness enthusiasts, ages 20-40, health-conscious individuals';
    } else if (kw.includes('cute') || kw.includes('kawaii')) {
      return 'Young adults, ages 16-30, interested in cute/aesthetic products';
    } else if (kw.includes('vintage') || kw.includes('retro')) {
      return 'Adults 25-50, nostalgic consumers, vintage style enthusiasts';
    }
    
    return 'General audience, ages 18-45, interested in trendy products';
  }

  private suggestPricing(profitability: string, difficulty: string): string {
    if (profitability === 'high' && difficulty === 'easy') {
      return '$15-25 (Premium pricing possible due to low competition)';
    } else if (profitability === 'high' && difficulty === 'medium') {
      return '$12-20 (Competitive but profitable range)';
    } else if (profitability === 'medium') {
      return '$10-18 (Balanced pricing for steady sales)';
    } else {
      return '$8-15 (Lower pricing to compete effectively)';
    }
  }

  private generateMarketingTips(keyword: string, trend: string, opportunity: any): string[] {
    const tips = [
      `Use "${keyword}" in your product titles and tags for better SEO`,
      'Create multiple design variations to test what sells best',
      'Research top-selling products in this niche for inspiration'
    ];

    if (trend === 'rising') {
      tips.push('🚀 Act quickly - this trend is rising! Create designs ASAP');
      tips.push('Use social media to capitalize on the trending topic');
    }

    if (opportunity.difficulty === 'easy') {
      tips.push('💎 Low competition detected - you can price higher initially');
      tips.push('Focus on quality designs since there\'s less competition');
    } else {
      tips.push('⚔️ High competition - focus on unique angles and superior design');
      tips.push('Consider targeting long-tail keywords for easier ranking');
    }

    return tips;
  }
}