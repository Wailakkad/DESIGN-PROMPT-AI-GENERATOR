declare module 'google-trends-api' {
  interface InterestOverTimeOptions {
    keyword: string | string[];
    startTime?: Date;
    endTime?: Date;
    geo?: string;
  }

  interface InterestByRegionOptions {
    keyword: string | string[];
    geo?: string;
    resolution?: string;
  }

  interface RelatedQueriesOptions {
    keyword: string | string[];
  }

  interface RelatedTopicsOptions {
    keyword: string | string[];
  }

  interface DailyTrendsOptions {
    geo: string;
  }

  interface RealTimeTrendsOptions {
    geo: string;
    category: string;
  }

  const googleTrends: {
    interestOverTime(options: InterestOverTimeOptions): Promise<string>;
    interestByRegion(options: InterestByRegionOptions): Promise<string>;
    relatedQueries(options: RelatedQueriesOptions): Promise<string>;
    relatedTopics(options: RelatedTopicsOptions): Promise<string>;
    dailyTrends(options: DailyTrendsOptions): Promise<string>;
    realTimeTrends(options: RealTimeTrendsOptions): Promise<string>;
  };

  export default googleTrends;
}
