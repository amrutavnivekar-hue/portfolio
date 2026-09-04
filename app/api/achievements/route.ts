import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM achievements ORDER BY display_order ASC') as any[];
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error loading achievements data:', error);
    return NextResponse.json({ error: 'Failed to load achievements data', details: String(error) }, { status: 500 });
  }
}
