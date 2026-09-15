import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { defaultProfile } from '@/lib/defaultData';

export async function GET() {
  try {
    const result = (await query('SELECT * FROM profile ORDER BY id DESC LIMIT 1')) as any[];
    return NextResponse.json(result?.[0] || defaultProfile);
  } catch {
    return NextResponse.json(defaultProfile);
  }
}
