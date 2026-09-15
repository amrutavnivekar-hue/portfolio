import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = body.path || '/';
    const referrer = body.referrer || request.headers.get('referer') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    await supabaseAdmin.from('visitor_logs').insert({
      path: String(path).substring(0, 255),
      referrer: String(referrer).substring(0, 500),
      user_agent: String(userAgent).substring(0, 500),
      ip: String(ip).substring(0, 45),
    });
  } catch {
    // Silently ignore — tracking should never break the app
  }

  return NextResponse.json({ ok: true });
}
