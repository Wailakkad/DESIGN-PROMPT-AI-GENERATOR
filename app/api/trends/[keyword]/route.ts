import { NextResponse } from 'next/server';
import googleTrends from 'google-trends-api';

export async function GET(req: Request, { params }: { params: { keyword: string } }) {
  try {
    const results = await googleTrends.interestOverTime({
      keyword: params.keyword,
      startTime: new Date('2024-12-01'),
      endTime: new Date(),
    });
    
    return NextResponse.json(JSON.parse(results));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}