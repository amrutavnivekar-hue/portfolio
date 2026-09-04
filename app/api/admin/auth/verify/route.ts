import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, getSessionCookieName } from '@/lib/cms/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
