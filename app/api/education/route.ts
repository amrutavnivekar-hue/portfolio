import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { defaultEducation } from '@/lib/defaultData';

export async function GET() {
  try {
    const result = (await query('SELECT * FROM education ORDER BY display_order ASC')) as any[];
    return NextResponse.json(result?.length ? result : defaultEducation);
  } catch {
    return NextResponse.json(defaultEducation);
  }
}
