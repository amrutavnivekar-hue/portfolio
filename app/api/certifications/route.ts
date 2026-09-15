import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { defaultCertifications } from '@/lib/defaultData';

export async function GET() {
  try {
    const result = (await query('SELECT * FROM certifications ORDER BY display_order ASC')) as any[];
    return NextResponse.json(result?.length ? result : defaultCertifications);
  } catch {
    return NextResponse.json(defaultCertifications);
  }
}
