import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .insert({ name: String(name), email: String(email), message: String(message) });

    if (error) {
      console.error('contact_submissions insert error:', error.message);
      return NextResponse.json({ error: 'Failed to save message.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact submit error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
