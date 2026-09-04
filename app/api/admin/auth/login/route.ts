import { NextRequest, NextResponse } from 'next/server';
import { loginWithPassword, signSessionToken, setSessionCookie } from '@/lib/cms/auth';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }

  const session = loginWithPassword(username, password);

  if (!session) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = await signSessionToken(session);
  setSessionCookie(token);

  return NextResponse.json({ success: true, user: { username: session.username, role: session.role } });
}
