"use client";
import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Target, DollarSign, Users, Package, Lightbulb, BarChart3, Calendar, Activity, Brain, Zap, Globe } from 'lucide-react';

interface AnalysisResult {
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
    searchIntent?: string;
    difficulty?: string;
  }[];
  insights: {
    bestProductTypes: string[];
    targetAudience: string;
    suggestedPrice: string;
    marketingTips: string[];
  };
  relatedNiches?: {
    niche: string;
    description: string;
    profitability: string;
    examples: string[];
  }[];
  enhancedInsights?: {
    bestProductTypes: string[];
    targetAudience: string;
    suggestedPrice: string;
    marketingTips: string[];
    aiPowered?: boolean;
    aiProvider?: string;
    seasonalPatterns?: string[];
    targetDemographics?: string[];
    contentSuggestions?: string[];
    keywordDiversity?: number;
    commercialKeywords?: number;
    lowCompetitionKeywords?: number;
  };
}

export const PODMarketAnalyzer: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeKeyword = async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-keyword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim() })
      });

      const result = await response.json();

      if (result.success) {
        setAnalysis(result.data);
      } else {
        setError(result.message || 'Failed to analyze keyword');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const getOpportunityStyles = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCompetitionStyles = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-amber-700 bg-amber-100';
      case 'high': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProfitabilityColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-800 bg-green-50 border-green-200';
      case 'medium': return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'low': return 'text-red-800 bg-red-50 border-red-200';
      default: return 'text-gray-800 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">POD Market Analyzer</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant market intelligence for your print-on-demand business with AI-powered keyword analysis
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g., funny cat shirts, motivational quotes, vintage gaming..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeKeyword()}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 placeholder-gray-400"
                />
              </div>
              <button 
                onClick={analyzeKeyword}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-lg min-w-[160px]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Market'
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
                <div className="h-2 w-2 bg-red-500 rounded-full mr-3"></div>
                {error}
              </div>
            )}
          </div>
        </div>

        {analysis && (
          <div className="space-y-6">
            
            {/* Results Header */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Market Analysis Results
                    {analysis.enhancedInsights?.aiPowered && (
                      <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        <Brain className="h-3 w-3 mr-1" />
                        AI-Powered
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-600">Keyword: <span className="font-semibold text-gray-900">"{analysis.keyword}"</span></p>
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 font-semibold text-sm ${getOpportunityStyles(analysis.opportunity.profitability)} mt-4 md:mt-0`}>
                  <Activity className="h-4 w-4 mr-2" />
                  {analysis.opportunity.profitability.toUpperCase()} OPPORTUNITY
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-700 font-medium">Search Volume</span>
                    {getTrendIcon(analysis.searchVolume.trend)}
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-1">
                    {analysis.searchVolume.current}/100
                  </div>
                  <div className="text-sm text-blue-600 capitalize">
                    {analysis.searchVolume.trend} trend
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-700 font-medium">Competition</span>
                    <Target className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex items-center mb-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCompetitionStyles(analysis.competition.level)}`}>
                      {analysis.competition.level.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-purple-600">
                    Score: {analysis.competition.score}/100
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-medium">Difficulty</span>
                    <BarChart3 className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-900 mb-1 capitalize">
                    {analysis.opportunity.difficulty}
                  </div>
                  <div className="text-sm text-green-600">
                    Entry barrier
                  </div>
                </div>
              </div>

              {/* Enhanced Insights Stats */}
              {analysis.enhancedInsights && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                    <span className="text-cyan-700 font-medium">Keyword Diversity</span>
                    <span className="text-2xl font-bold text-cyan-900">{analysis.enhancedInsights.keywordDiversity}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <span className="text-green-700 font-medium">Commercial Keywords</span>
                    <span className="text-2xl font-bold text-green-900">{analysis.enhancedInsights.commercialKeywords}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                    <span className="text-orange-700 font-medium">Low Competition</span>
                    <span className="text-2xl font-bold text-orange-900">{analysis.enhancedInsights.lowCompetitionKeywords}</span>
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <div className="flex items-start">
                  <Lightbulb className="h-6 w-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Expert Recommendation</h3>
                    <p className="text-amber-800 leading-relaxed">{analysis.opportunity.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Market Intelligence */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Market Intelligence</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Market Status</span>
                    <span className="text-gray-900 font-semibold">{analysis.competition.marketSaturation}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Seasonality</span>
                    <span className="text-gray-900 font-semibold">{analysis.searchVolume.seasonality}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-600 font-medium">Peak Months</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.searchVolume.peakMonths.map((month, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                  {analysis.enhancedInsights?.seasonalPatterns && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-600 font-medium">Seasonal Patterns</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysis.enhancedInsights.seasonalPatterns.map((pattern, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Recommendations */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Best Product Types</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {analysis.insights.bestProductTypes.map((product, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 text-center">
                      <span className="text-green-800 font-medium">{product}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Target Audience</h3>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 mb-4">
                  <p className="text-purple-800 leading-relaxed">{analysis.insights.targetAudience}</p>
                </div>

                {analysis.enhancedInsights?.targetDemographics && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Target Demographics</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.enhancedInsights.targetDemographics.map((demo, index) => (
                        <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                          {demo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Strategy */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Pricing Strategy</h3>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <p className="text-amber-800 leading-relaxed font-medium">{analysis.insights.suggestedPrice}</p>
                </div>
              </div>
            </div>

            {/* Content Suggestions */}
            {analysis.enhancedInsights?.contentSuggestions && (
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Content Suggestions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.enhancedInsights.contentSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100 text-center">
                      <span className="text-teal-800 font-medium">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Niches */}
            {analysis.relatedNiches && analysis.relatedNiches.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Related Niches</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.relatedNiches.slice(0, 4).map((niche, index) => (
                    <div key={index} className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-rose-900 capitalize">{niche.niche || 'Unknown Niche'}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getProfitabilityColor(niche.profitability || 'medium')}`}>
                          {(niche.profitability || 'medium').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-rose-800 text-sm mb-3 leading-relaxed">{niche.description || 'No description available'}</p>
                      <div className="flex flex-wrap gap-1">
                        {(niche.examples || []).slice(0, 3).map((example, exIndex) => (
                          <span key={exIndex} className="px-2 py-1 bg-rose-200 text-rose-800 rounded text-xs">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Debug: Show if relatedNiches exists but is empty */}
            {analysis.relatedNiches && analysis.relatedNiches.length === 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Related Niches</h3>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl text-center">
                  <p className="text-gray-600">No related niches found for this keyword.</p>
                </div>
              </div>
            )}

            {/* Related Keywords */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Related Keywords</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.relatedKeywords.slice(0, 6).map((kw, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center flex-1">
                      <span className="text-gray-900 font-medium mr-3">{kw.keyword}</span>
                      {getTrendIcon(kw.trend)}
                      {kw.searchIntent && (
                        <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                          {kw.searchIntent}
                        </span>
                      )}
                      {kw.difficulty && (
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getCompetitionStyles(kw.difficulty)}`}>
                          {kw.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${kw.popularity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{kw.popularity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing Tips */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Marketing Strategy</h3>
              </div>
              
              <div className="grid gap-4">
                {analysis.insights.marketingTips.map((tip, index) => (
                  <div key={index} className="flex items-start p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-pink-800 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};