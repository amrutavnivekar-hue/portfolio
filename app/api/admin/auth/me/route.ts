import { NextRequest, NextResponse } from 'next/server';
import { sessionFromRequest } from '@/lib/cms/auth';

export async function GET(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ session });
}
