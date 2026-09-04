import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM experiences ORDER BY display_order ASC') as any[];
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error loading experience data:', error);
    return NextResponse.json({ error: 'Failed to load experience data', details: String(error) }, { status: 500 });
  }
}
