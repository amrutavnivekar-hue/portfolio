import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { defaultAchievements } from '@/lib/defaultData';

export async function GET() {
  try {
    const result = (await query('SELECT * FROM achievements ORDER BY display_order ASC')) as any[];
    return NextResponse.json(result?.length ? result : defaultAchievements);
  } catch {
    return NextResponse.json(defaultAchievements);
  }
}
