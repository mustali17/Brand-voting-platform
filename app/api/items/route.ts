// app/api/items/route.ts
import { NextResponse } from 'next/server';

const items = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  const hasMore = start + limit < items.length;

  return NextResponse.json({ data, hasMore });
}
