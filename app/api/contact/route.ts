import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { defaultContact } from '@/lib/defaultData';

export async function GET() {
  try {
    const result = (await query('SELECT * FROM contact ORDER BY id DESC LIMIT 1')) as any[];
    return NextResponse.json(result?.[0] || defaultContact);
  } catch {
    return NextResponse.json(defaultContact);
  }
}
