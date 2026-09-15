/**
 * lib/db.ts — Supabase adapter
 *
 * Keeps the same query() / queryOne() function signatures as the old mysql2
 * version so every existing call site works without changes.
 *
 * mysql2 used positional ? placeholders in raw SQL.
 * This adapter translates those calls into Supabase table queries using the
 * queryTable() helper, or falls back to supabase.rpc() for complex SQL.
 */

import { supabase, supabaseAdmin, queryTable } from './supabase';

// Re-export supabase clients for direct use
export { supabase, supabaseAdmin };

/**
 * High-level query helper — mirrors the old mysql2 query() API.
 *
 * For simple SELECT * FROM table ORDER BY col queries, pass a structured
 * descriptor object instead of raw SQL. All existing call sites in this
 * project are simple SELECTs so we handle them directly.
 */
import {
  getProfile as getXmlProfile,
  getExperience as getXmlExperience,
  getEducation as getXmlEducation,
  getSkills as getXmlSkills,
  getCertifications as getXmlCertifications,
  getProjects as getXmlProjects,
  getAchievements as getXmlAchievements,
  getTestimonials as getXmlTestimonials,
  getContact as getXmlContact,
} from './xmlParser';

import {
  defaultProfile,
  defaultContact,
  defaultEducation,
  defaultCertifications,
  defaultTestimonials,
  defaultExperiences,
  defaultSkillCategories,
  defaultProjects,
  defaultAchievements,
} from './defaultData';

function getMemoryFallback(table: string): any[] {
  switch (table.toLowerCase()) {
    case 'profile':
      return [defaultProfile];
    case 'experiences':
      return defaultExperiences;
    case 'skill_categories':
      return defaultSkillCategories.map((c, i) => ({ id: i + 1, name: c.name, display_order: i + 1 }));
    case 'skills':
      return defaultSkillCategories.flatMap((c, i) =>
        c.skills.map((sk, j) => ({
          id: (i + 1) * 100 + j,
          category_id: i + 1,
          name: sk.name,
          level: sk.level,
          display_order: j + 1,
        }))
      );
    case 'education':
      return defaultEducation;
    case 'certifications':
      return defaultCertifications;
    case 'projects':
      return defaultProjects;
    case 'achievements':
      return defaultAchievements;
    case 'testimonials':
      return defaultTestimonials;
    case 'contact':
      return [defaultContact];
    default:
      return [];
  }
}

async function getXmlFallback(table: string): Promise<any[]> {
  try {
    switch (table.toLowerCase()) {
      case 'profile': {
        const p: any = await getXmlProfile();
        return p?.profile ? [p.profile] : (p ? [p] : []);
      }
      case 'experiences': {
        const ex: any = await getXmlExperience();
        return Array.isArray(ex) ? ex : [ex];
      }
      case 'skill_categories': {
        const cats: any = await getXmlSkills();
        return (Array.isArray(cats) ? cats : [cats]).filter(Boolean).map((c: any, i: number) => ({
          id: i + 1,
          name: c.name || '',
          display_order: i + 1,
        }));
      }
      case 'skills': {
        const cats: any = await getXmlSkills();
        const arr = Array.isArray(cats) ? cats : [cats];
        const flatSkills: any[] = [];
        arr.filter(Boolean).forEach((c: any, i: number) => {
          const sks = Array.isArray(c.skill) ? c.skill : (c.skill ? [c.skill] : []);
          sks.forEach((sk: any, j: number) => {
            flatSkills.push({
              id: (i + 1) * 100 + j,
              category_id: i + 1,
              name: sk.name || '',
              level: Number(sk.level || 0),
              display_order: j + 1,
            });
          });
        });
        return flatSkills;
      }
      case 'education': {
        const ed: any = await getXmlEducation();
        const list = Array.isArray(ed) ? ed : [ed];
        return list.filter(Boolean).map((d: any, i: number) => ({
          id: i + 1,
          degree_name: d.name || '',
          institution: d.institution || '',
          duration: d.year || '',
          score: d.score || '',
          display_order: i + 1,
        }));
      }
      case 'certifications': {
        const certs: any = await getXmlCertifications();
        return (Array.isArray(certs) ? certs : [certs]).filter(Boolean);
      }
      case 'projects': {
        const projs: any = await getXmlProjects();
        return (Array.isArray(projs) ? projs : [projs]).filter(Boolean);
      }
      case 'achievements': {
        const achs: any = await getXmlAchievements();
        return (Array.isArray(achs) ? achs : [achs]).filter(Boolean);
      }
      case 'testimonials': {
        const tests: any = await getXmlTestimonials();
        const list = Array.isArray(tests) ? tests : [tests];
        return list.filter(Boolean).map((t: any, i: number) => ({
          id: i + 1,
          author_name: t.name || '',
          author_role: t.role || '',
          text: t.text || '',
          display_order: i + 1,
        }));
      }
      case 'contact': {
        const ct: any = await getXmlContact();
        return ct?.contact ? [ct.contact] : (ct ? [ct] : []);
      }
      default:
        return [];
    }
  } catch {
    return [];
  }
}

async function safeQueryTable(table: string, options?: any): Promise<any[]> {
  try {
    const data = await queryTable(table, options);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // fallback
  }

  const xmlData = await getXmlFallback(table);
  if (Array.isArray(xmlData) && xmlData.length > 0) {
    return xmlData;
  }

  return getMemoryFallback(table);
}

export async function query(
  sqlOrDescriptor: string | { table: string; eq?: { column: string; value: any }; order?: string; limit?: number },
  params?: any[]
): Promise<any[]> {
  // Structured call (new style)
  if (typeof sqlOrDescriptor === 'object') {
    const { table, eq, order, limit } = sqlOrDescriptor;
    return safeQueryTable(table, {
      order: order ? { column: order, ascending: true } : undefined,
      eq,
      limit,
    });
  }

  // Legacy raw SQL call — parse the simple patterns used in this project
  const sql = sqlOrDescriptor.trim();

  // Pattern: SELECT * FROM <table> ORDER BY <col> ASC
  const selectAllOrder = sql.match(/^SELECT \* FROM (\w+)\s+ORDER BY (\w+) ASC\s*$/i);
  if (selectAllOrder) {
    const [, table, orderCol] = selectAllOrder;
    return safeQueryTable(table, { order: { column: orderCol, ascending: true } });
  }

  // Pattern: SELECT * FROM <table> ORDER BY <col> DESC LIMIT <n>
  const selectLimitDesc = sql.match(/^SELECT \* FROM (\w+)\s+ORDER BY (\w+) DESC LIMIT (\d+)\s*$/i);
  if (selectLimitDesc) {
    const [, table, orderCol, lim] = selectLimitDesc;
    return safeQueryTable(table, {
      order: { column: orderCol, ascending: false },
      limit: parseInt(lim),
    });
  }

  // Pattern: SELECT * FROM <table> ORDER BY id DESC LIMIT <n>
  const selectOrderLimit = sql.match(/^SELECT \* FROM (\w+)\s+ORDER BY (\w+) DESC\s+LIMIT (\d+)\s*$/i);
  if (selectOrderLimit) {
    const [, table, orderCol, lim] = selectOrderLimit;
    return safeQueryTable(table, {
      order: { column: orderCol, ascending: false },
      limit: parseInt(lim),
    });
  }

  // Pattern: SELECT * FROM <table>  (no order/limit)
  const selectAll = sql.match(/^SELECT \* FROM (\w+)\s*$/i);
  if (selectAll) {
    const [, table] = selectAll;
    return safeQueryTable(table);
  }

  // Pattern: SELECT * FROM <table> WHERE <col> = ? AND <col2> = ?
  const selectWhere = sql.match(/^SELECT \* FROM (\w+)\s+WHERE (.+)$/i);
  if (selectWhere && params?.length) {
    const [, table, wherePart] = selectWhere;
    const conditions = wherePart.split(/\s+AND\s+/i);
    try {
      let q = supabaseAdmin.from(table).select('*');
      conditions.forEach((cond, idx) => {
        const colMatch = cond.match(/(\w+)\s*=\s*\?/);
        if (colMatch) {
          q = q.eq(colMatch[1], params[idx]) as any;
        }
      });
      const { data, error } = await q;
      if (!error && data?.length) return data;
    } catch {
      // fallback below
    }
    return getXmlFallback(table);
  }

  // Pattern: SELECT id FROM <table> ORDER BY id DESC LIMIT 1
  const selectIdLast = sql.match(/^SELECT id FROM (\w+)\s+ORDER BY id DESC LIMIT 1\s*$/i);
  if (selectIdLast) {
    const [, table] = selectIdLast;
    try {
      const { data, error } = await supabaseAdmin.from(table).select('id').order('id', { ascending: false }).limit(1);
      if (!error && data?.length) return data;
    } catch {
      // fallback
    }
    return [{ id: 1 }];
  }

  return [];
}

/**
 * queryOne() — returns first row or null, same as old mysql2 version.
 */
export async function queryOne(
  sqlOrDescriptor: string | { table: string; eq?: { column: string; value: any }; order?: string },
  params?: any[]
): Promise<any | null> {
  const results = await query(sqlOrDescriptor as any, params);
  return results.length > 0 ? results[0] : null;
}

export default supabase;
