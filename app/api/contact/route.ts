import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM contact ORDER BY id DESC LIMIT 1') as any[];
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error loading contact data:', error);
    return NextResponse.json({ error: 'Failed to load contact data', details: String(error) }, { status: 500 });
  }
}
