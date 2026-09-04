import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ['editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;

  const { data, error } = await supabaseAdmin
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// Mark as read
export async function PATCH(request: NextRequest) {
  const auth = await requireSession(request, ['editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;

  const { id } = await request.json();
  const { error } = await supabaseAdmin
    .from('contact_submissions')
    .update({ read: true })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
