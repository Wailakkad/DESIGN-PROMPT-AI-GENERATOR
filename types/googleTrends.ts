export interface InterestOverTimeItem {
  date: string;
  popularity: number;
}

export interface InterestByRegionItem {
  region: string;
  score: number;
}

export interface GoogleTrendsAnalytics {
  keyword: string;
  interestOverTime: InterestOverTimeItem[];
  interestByRegion: InterestByRegionItem[];
  relatedQueries: string[];
  relatedTopics: string[];
  dailyTrends: string[];
  realTimeTrends: string[];
}
