import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { defaultExperiences } from '@/lib/defaultData';

export async function GET() {
  try {
    const result = (await query('SELECT * FROM experiences ORDER BY display_order ASC')) as any[];
    return NextResponse.json(result?.length ? result : defaultExperiences);
  } catch (error) {
    console.error('Error loading experience data:', error);
    return NextResponse.json(defaultExperiences);
  }
}
