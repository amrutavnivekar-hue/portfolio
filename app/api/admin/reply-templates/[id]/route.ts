import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { supabaseAdmin } from '@/lib/supabase';

// PATCH — update template
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error) return auth.error;

  const { name, subject, body } = await request.json();
  const { error } = await supabaseAdmin
    .from('reply_templates')
    .update({ name, subject, body, updated_at: new Date().toISOString() })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — remove template
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error) return auth.error;

  const { error } = await supabaseAdmin
    .from('reply_templates')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
