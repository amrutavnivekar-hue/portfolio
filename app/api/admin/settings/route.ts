import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { supabaseAdmin } from '@/lib/supabase';

// GET all settings as { key: value } map
export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error) return auth.error;

  const { data, error } = await supabaseAdmin
    .from('admin_settings')
    .select('key, value');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const map: Record<string, string> = {};
  (data ?? []).forEach((row: any) => { map[row.key] = row.value; });
  return NextResponse.json(map);
}

// POST { key, value } — upsert a single setting
export async function POST(request: NextRequest) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error) return auth.error;

  const body = await request.json();
  const entries: { key: string; value: string }[] = Array.isArray(body)
    ? body
    : [body];

  for (const { key, value } of entries) {
    if (!key) continue;
    const { error } = await supabaseAdmin
      .from('admin_settings')
      .upsert({ key, value: String(value ?? ''), updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
