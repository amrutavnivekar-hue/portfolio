import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/cms/auth';

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ success: true });
}
