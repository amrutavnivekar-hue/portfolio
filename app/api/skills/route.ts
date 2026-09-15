import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { defaultSkillCategories } from '@/lib/defaultData';

export async function GET() {
  try {
    const categories = (await query('SELECT * FROM skill_categories ORDER BY display_order ASC')) as any[];
    const skills = (await query('SELECT * FROM skills ORDER BY display_order ASC')) as any[];

    if (categories?.length) {
      // Group skills by category
      const result = categories.map((category) => ({
        $: { name: category.name },
        skill: (skills || [])
          .filter((s) => s.category_id === category.id)
          .map((skill) => ({
            $: { name: skill.name, level: skill.level },
          })),
      }));
      return NextResponse.json(result);
    }

    // Default formatted fallback
    const fallbackResult = defaultSkillCategories.map((c) => ({
      $: { name: c.name },
      skill: c.skills.map((sk) => ({
        $: { name: sk.name, level: sk.level },
      })),
    }));
  } catch {
    const fallbackResult = defaultSkillCategories.map((c) => ({
      $: { name: c.name },
      skill: c.skills.map((sk) => ({
        $: { name: sk.name, level: sk.level },
      })),
    }));
    return NextResponse.json(fallbackResult);
  }
}
