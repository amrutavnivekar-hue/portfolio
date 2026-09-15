import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { defaultTestimonials } from '@/lib/defaultData';

export async function GET() {
  try {
    const result = (await query('SELECT * FROM testimonials ORDER BY display_order ASC')) as any[];
    return NextResponse.json(result?.length ? result : defaultTestimonials);
  } catch {
    return NextResponse.json(defaultTestimonials);
  }
}
