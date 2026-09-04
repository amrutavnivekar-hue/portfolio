import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  // Only accept calls from our own middleware
  if (request.headers.get('x-internal') !== 'middleware') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { path, referrer, userAgent, ip } = await request.json();
    await supabaseAdmin.from('visitor_logs').insert({
      path: String(path || '/'),
      referrer: String(referrer || ''),
      user_agent: String(userAgent || ''),
      ip: String(ip || 'unknown'),
    });
  } catch {
    // Silently ignore — tracking should never break the app
  }

  return NextResponse.json({ ok: true });
}
