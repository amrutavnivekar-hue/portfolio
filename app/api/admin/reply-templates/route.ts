import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { supabaseAdmin } from '@/lib/supabase';

// GET all templates
export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ['editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;

  const { data, error } = await supabaseAdmin
    .from('reply_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST — create new template
export async function POST(request: NextRequest) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error) return auth.error;

  const { name, subject, body } = await request.json();
  if (!name || !subject || !body) {
    return NextResponse.json({ error: 'name, subject and body are required.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('reply_templates')
    .insert({ name, subject, body })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
