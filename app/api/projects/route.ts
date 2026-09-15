import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { defaultProjects } from '@/lib/defaultData';

export async function GET() {
  try {
    const result = (await query('SELECT * FROM projects ORDER BY display_order ASC')) as any[];
    return NextResponse.json(result?.length ? result : defaultProjects);
  } catch {
    return NextResponse.json(defaultProjects);
  }
}
