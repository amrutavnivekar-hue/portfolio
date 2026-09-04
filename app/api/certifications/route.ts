import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM certifications ORDER BY display_order ASC') as any[];
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error loading certifications data:', error);
    return NextResponse.json({ error: 'Failed to load certifications data', details: String(error) }, { status: 500 });
  }
}
