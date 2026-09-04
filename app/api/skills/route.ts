import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const categories = await query('SELECT * FROM skill_categories ORDER BY display_order ASC') as any[];
    const skills = await query('SELECT * FROM skills ORDER BY display_order ASC') as any[];
    
    // Group skills by category
    const result = categories.map(category => ({
      $: { name: category.name },
      skill: skills.filter(s => s.category_id === category.id).map(skill => ({
        $: { name: skill.name, level: skill.level }
      }))
    }));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error loading skills data:', error);
    return NextResponse.json({ error: 'Failed to load skills data', details: String(error) }, { status: 500 });
  }
}
