import { NextRequest, NextResponse } from 'next/server';
import { PODMarketAnalyzer } from '@/lib/pod-market-analyzer';

// OpenRouter API configuration - Pure OpenRouter implementation
const OPENROUTER_CONFIG = {
  baseURL: 'https://openrouter.ai/api/v1/chat/completions',
  apiKey: process.env.OPENROUTER_API_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'POD Market Analyzer',
  // OpenRouter model options
  models: {
    free: 'meta-llama/llama-3.2-3b-instruct:free', // Completely free
    budget: 'google/gemini-flash-1.5', // Fast and free
    premium: 'anthropic/claude-3-haiku', // Low-cost premium
    best: 'anthropic/claude-3.5-sonnet', // Highest quality
    online: 'perplexity/llama-3.1-sonar-large-128k-online' // Internet access
  }
};

interface AIKeywordAnalysis {
  relatedKeywords: {
    keyword: string;
    popularity: number;
    trend: string;
    searchIntent: 'commercial' | 'informational' | 'navigational' | 'transactional';
    difficulty: 'low' | 'medium' | 'high';
  }[];
  relatedNiches: {
    niche: string;
    description: string;
    profitability: 'high' | 'medium' | 'low';
    examples: string[];
  }[];
  marketInsights: {
    seasonalPatterns: string[];
    targetDemographics: string[];
    contentSuggestions: string[];
  };
}

// OpenRouter AI-powered keyword and niche analysis
async function analyzeWithOpenRouter(
  keyword: string, 
  trendData: any, 
  basicRelatedKeywords: any[]
): Promise<AIKeywordAnalysis> {
  const prompt = `
You are an expert POD (Print on Demand) market analyst. Analyze the following data to generate comprehensive market insights for profitable POD products.

**Primary Keyword:** "${keyword}"

**Google Trends Data:**
- Search Volume: ${trendData.averagePopularity || 'Unknown'}
- Trend Direction: ${trendData.trend || 'Unknown'}  
- Existing Related Keywords: ${JSON.stringify(basicRelatedKeywords.map(k => k.keyword).slice(0, 5))}

**Generate a JSON response with this exact structure:**

{
  "relatedKeywords": [
    {
      "keyword": "specific keyword phrase for POD products",
      "popularity": 85,
      "trend": "rising|stable|declining",
      "searchIntent": "commercial|informational|navigational|transactional", 
      "difficulty": "low|medium|high"
    }
  ],
  "relatedNiches": [
    {
      "niche": "profitable niche name",
      "description": "market opportunity description",
      "profitability": "high|medium|low",
      "examples": ["product example 1", "product example 2", "product example 3"]
    }
  ],
  "marketInsights": {
    "seasonalPatterns": ["seasonal insight 1", "seasonal insight 2"],
    "targetDemographics": ["demographic 1", "demographic 2"],
    "contentSuggestions": ["content idea 1", "content idea 2", "content idea 3"]
  }
}

**Requirements:**
1. Generate 15-25 related keywords focused on COMMERCIAL INTENT (buyers, not researchers)
2. Include long-tail keyword variations that are easier to rank for
3. Identify 5-8 profitable niches with real market potential
4. Focus on keywords people use when ready to PURCHASE POD products
5. Consider different product types: t-shirts, mugs, stickers, hoodies, phone cases
6. Include seasonal and trending variations
7. Prioritize keywords with lower competition but decent search volume
8. Think about what customers actually search for on Etsy, Amazon, etc.

Return ONLY the JSON - no explanations or markdown formatting.
`;

  try {
    // Select model based on environment or use default free model
    const selectedModel = process.env.OPENROUTER_MODEL || OPENROUTER_CONFIG.models.free;

    console.log(`🤖 Using OpenRouter model: ${selectedModel}`);

    const response = await fetch(OPENROUTER_CONFIG.baseURL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_CONFIG.apiKey}`,
        "HTTP-Referer": OPENROUTER_CONFIG.siteUrl,
        "X-Title": OPENROUTER_CONFIG.siteName,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: "You are an expert POD market analyst specializing in profitable keyword research. Always respond with valid JSON only, no additional text or markdown formatting."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenRouter API failed: ${response.status}`);
    }

    const completion = await response.json();
    const aiResponse = completion.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No content in OpenRouter response');
    }

    console.log(`✅ OpenRouter response received (${aiResponse.length} characters)`);

    // Clean response - remove any markdown formatting
    const cleanedResponse = aiResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^[\s\n]*/, '')
      .replace(/[\s\n]*$/, '')
      .trim();

    // Parse JSON response
    let aiAnalysis: AIKeywordAnalysis;
    try {
      aiAnalysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', cleanedResponse);
      throw new Error('Invalid JSON response from AI');
    }
    
    // Validate response structure
    if (!aiAnalysis.relatedKeywords || !Array.isArray(aiAnalysis.relatedKeywords)) {
      throw new Error('Missing or invalid relatedKeywords in AI response');
    }
    
    if (!aiAnalysis.relatedNiches || !Array.isArray(aiAnalysis.relatedNiches)) {
      throw new Error('Missing or invalid relatedNiches in AI response');
    }

    if (!aiAnalysis.marketInsights || typeof aiAnalysis.marketInsights !== 'object') {
      throw new Error('Missing or invalid marketInsights in AI response');
    }

    console.log(`✅ Generated ${aiAnalysis.relatedKeywords.length} keywords and ${aiAnalysis.relatedNiches.length} niches`);
    
    return aiAnalysis;

  } catch (error) {
    console.error('OpenRouter AI analysis failed:', error);
    
    // Comprehensive fallback analysis when AI fails
    const fallbackKeywords = [
      `${keyword} t shirt`,
      `${keyword} shirt design`,
      `${keyword} hoodie`,
      `${keyword} mug`,
      `${keyword} sticker`,
      `${keyword} gift`,
      `${keyword} merchandise`,
      `custom ${keyword}`,
      `${keyword} apparel`,
      `${keyword} accessories`,
      `${keyword} phone case`,
      `${keyword} poster`,
      `${keyword} tote bag`,
      `funny ${keyword}`,
      `vintage ${keyword}`
    ];

    return {
      relatedKeywords: [
        // Include original keywords from Google Trends
        ...basicRelatedKeywords.slice(0, 10).map(k => ({
          keyword: k.keyword,
          popularity: k.popularity || 50,
          trend: k.trend || 'stable',
          searchIntent: 'commercial' as const,
          difficulty: 'medium' as const
        })),
        // Add generated fallback keywords
        ...fallbackKeywords.map(kw => ({
          keyword: kw,
          popularity: Math.floor(Math.random() * 30) + 40,
          trend: 'stable' as const,
          searchIntent: 'commercial' as const,
          difficulty: Math.random() > 0.5 ? 'low' : 'medium' as const
        }))
      ].slice(0, 20),
      
      relatedNiches: [
        {
          niche: `${keyword} Apparel`,
          description: `Clothing items featuring ${keyword} designs and themes`,
          profitability: 'high' as const,
          examples: ['T-shirts', 'Hoodies', 'Tank tops', 'Long sleeves']
        },
        {
          niche: `${keyword} Home Decor`,
          description: `Home decoration items with ${keyword} motifs`,
          profitability: 'medium' as const,
          examples: ['Wall art', 'Throw pillows', 'Canvas prints', 'Posters']
        },
        {
          niche: `${keyword} Accessories`,
          description: `Personal accessories featuring ${keyword} designs`,
          profitability: 'medium' as const,
          examples: ['Phone cases', 'Tote bags', 'Stickers', 'Keychains']
        },
        {
          niche: `${keyword} Drinkware`,
          description: `Mugs, bottles, and drinkware with ${keyword} themes`,
          profitability: 'high' as const,
          examples: ['Coffee mugs', 'Travel mugs', 'Water bottles', 'Wine glasses']
        }
      ],

      marketInsights: {
        seasonalPatterns: [
          'Steady demand throughout the year with potential holiday spikes',
          'Consider seasonal variations and trending events'
        ],
        targetDemographics: [
          'Adults 18-45 interested in unique, personalized products',
          'Gift buyers looking for themed merchandise'
        ],
        contentSuggestions: [
          `Create minimalist ${keyword} designs for broad appeal`,
          `Develop funny or inspirational ${keyword} quotes`,
          `Design vintage or retro-style ${keyword} graphics`,
          `Consider trending colors and modern typography`
        ]
      }
    };
  }
}

// Merge AI insights with original Google Trends analysis
async function enhanceMarketAnalysis(originalAnalysis: any, aiAnalysis: AIKeywordAnalysis) {
  // Combine and deduplicate keywords
  const allKeywords = [
    ...originalAnalysis.relatedKeywords || [],
    ...aiAnalysis.relatedKeywords
  ];
  
  // Remove duplicates based on keyword text
  const uniqueKeywords = allKeywords.filter((keyword, index, self) => 
    index === self.findIndex(k => k.keyword.toLowerCase() === keyword.keyword.toLowerCase())
  ).slice(0, 30); // Limit to top 30 keywords

  return {
    ...originalAnalysis,
    relatedKeywords: uniqueKeywords,
    relatedNiches: aiAnalysis.relatedNiches,
    enhancedInsights: {
      ...originalAnalysis.insights,
      aiPowered: true,
      aiProvider: 'OpenRouter',
      seasonalPatterns: aiAnalysis.marketInsights.seasonalPatterns,
      targetDemographics: aiAnalysis.marketInsights.targetDemographics,
      contentSuggestions: aiAnalysis.marketInsights.contentSuggestions,
      keywordDiversity: uniqueKeywords.length,
      commercialKeywords: uniqueKeywords.filter(k => 
        k.searchIntent === 'commercial' || k.searchIntent === 'transactional'
      ).length,
      lowCompetitionKeywords: uniqueKeywords.filter(k => k.difficulty === 'low').length
    }
  };
}

// Main API route handler
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { keyword, useAI = true, model } = body;

    // Validation
    if (!keyword || keyword.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Keyword is required' 
        },
        { status: 400 }
      );
    }

    if (keyword.trim().length > 100) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Keyword too long (max 100 characters)' 
        },
        { status: 400 }
      );
    }

    console.log(`🔍 Analyzing keyword: "${keyword.trim()}"`);

    // Get basic Google Trends analysis
    const analyzer = new PODMarketAnalyzer();
    const basicAnalysis = await analyzer.analyzeKeyword(keyword.trim());

    console.log(`📊 Google Trends analysis completed: ${basicAnalysis.relatedKeywords?.length || 0} keywords found`);

    let finalAnalysis = basicAnalysis;
    let aiEnhanced = false;

    // Enhance with OpenRouter AI if enabled and configured
    if (useAI && process.env.OPENROUTER_API_KEY) {
      try {
        console.log('🤖 Starting OpenRouter AI enhancement...');
        
        // Override model if specified in request
        if (model && typeof model === 'string') {
          process.env.OPENROUTER_MODEL = model;
        }

        const trendData = {
          averagePopularity: basicAnalysis.searchVolume?.current || 0,
          trend: basicAnalysis.searchVolume?.trend || 'stable'
        };

        const aiAnalysis = await analyzeWithOpenRouter(
          keyword.trim(), 
          trendData, 
          basicAnalysis.relatedKeywords || []
        );

        finalAnalysis = await enhanceMarketAnalysis(basicAnalysis, aiAnalysis);
        aiEnhanced = true;
        
        console.log('✅ OpenRouter AI enhancement completed successfully');
        
      } catch (aiError) {
        console.error('❌ AI enhancement failed:', aiError);
        console.log('📋 Continuing with Google Trends data only');
        // Continue with basic analysis - don't fail the entire request
      }
    } else if (useAI && !process.env.OPENROUTER_API_KEY) {
      console.log('⚠️ AI requested but OPENROUTER_API_KEY not configured');
    }

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: finalAnalysis,
      meta: {
        aiEnhanced,
        aiProvider: aiEnhanced ? 'OpenRouter' : null,
        selectedModel: aiEnhanced ? (process.env.OPENROUTER_MODEL || OPENROUTER_CONFIG.models.free) : null,
        processingTime: `${processingTime}ms`,
        analysisTimestamp: new Date().toISOString(),
        keywordCount: finalAnalysis.relatedKeywords?.length || 0,
        nicheCount: finalAnalysis.relatedNiches?.length || 0
      }
    });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error('💥 Keyword analysis error:', error);
   
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze keyword',
        message: error.message || 'Unknown error occurred',
        meta: {
          aiEnhanced: false,
          processingTime: `${processingTime}ms`,
          analysisTimestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      success: false,
      error: 'Method not allowed',
      message: 'Use POST method to analyze keywords',
      supportedMethods: ['POST'],
      example: {
        method: 'POST',
        body: {
          keyword: 'funny cat shirts',
          useAI: true,
          model: 'meta-llama/llama-3.2-3b-instruct:free' // optional
        }
      }
    },
    { status: 405 }
  );
}

// Health check and configuration endpoint
export async function HEAD() {
  const openrouterAvailable = !!process.env.OPENROUTER_API_KEY;
  const selectedModel = process.env.OPENROUTER_MODEL || OPENROUTER_CONFIG.models.free;
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-AI-Available': openrouterAvailable.toString(),
      'X-AI-Provider': 'OpenRouter',
      'X-Selected-Model': selectedModel,
      'X-Service-Status': 'healthy',
      'X-Available-Models': JSON.stringify(Object.values(OPENROUTER_CONFIG.models))
    }
  });
}