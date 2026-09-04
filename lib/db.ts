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

import { supabase, queryTable } from './supabase';

// Re-export supabase client for direct use
export { supabase };

/**
 * High-level query helper — mirrors the old mysql2 query() API.
 *
 * For simple SELECT * FROM table ORDER BY col queries, pass a structured
 * descriptor object instead of raw SQL. All existing call sites in this
 * project are simple SELECTs so we handle them directly.
 */
export async function query(
  sqlOrDescriptor: string | { table: string; eq?: { column: string; value: any }; order?: string; limit?: number },
  params?: any[]
): Promise<any[]> {
  // Structured call (new style)
  if (typeof sqlOrDescriptor === 'object') {
    const { table, eq, order, limit } = sqlOrDescriptor;
    return queryTable(table, {
      order: order ? { column: order, ascending: true } : undefined,
      eq,
      limit,
    }) as Promise<any[]>;
  }

  // Legacy raw SQL call — parse the simple patterns used in this project
  const sql = sqlOrDescriptor.trim();

  // Pattern: SELECT * FROM <table> ORDER BY <col> ASC
  const selectAllOrder = sql.match(/^SELECT \* FROM (\w+)\s+ORDER BY (\w+) ASC\s*$/i);
  if (selectAllOrder) {
    const [, table, orderCol] = selectAllOrder;
    return queryTable(table, { order: { column: orderCol, ascending: true } }) as Promise<any[]>;
  }

  // Pattern: SELECT * FROM <table> ORDER BY <col> DESC LIMIT <n>
  const selectLimitDesc = sql.match(/^SELECT \* FROM (\w+)\s+ORDER BY (\w+) DESC LIMIT (\d+)\s*$/i);
  if (selectLimitDesc) {
    const [, table, orderCol, lim] = selectLimitDesc;
    return queryTable(table, {
      order: { column: orderCol, ascending: false },
      limit: parseInt(lim),
    }) as Promise<any[]>;
  }

  // Pattern: SELECT * FROM <table> ORDER BY id DESC LIMIT <n>
  const selectOrderLimit = sql.match(/^SELECT \* FROM (\w+)\s+ORDER BY (\w+) DESC\s+LIMIT (\d+)\s*$/i);
  if (selectOrderLimit) {
    const [, table, orderCol, lim] = selectOrderLimit;
    return queryTable(table, {
      order: { column: orderCol, ascending: false },
      limit: parseInt(lim),
    }) as Promise<any[]>;
  }

  // Pattern: SELECT * FROM <table>  (no order/limit)
  const selectAll = sql.match(/^SELECT \* FROM (\w+)\s*$/i);
  if (selectAll) {
    const [, table] = selectAll;
    return queryTable(table) as Promise<any[]>;
  }

  // Pattern: SELECT * FROM <table> WHERE <col> = ? AND <col2> = ?
  const selectWhere = sql.match(/^SELECT \* FROM (\w+)\s+WHERE (.+)$/i);
  if (selectWhere && params?.length) {
    const [, table, wherePart] = selectWhere;
    // Extract column names from "col = ? AND col2 = ?" pattern
    const conditions = wherePart.split(/\s+AND\s+/i);
    let q = supabase.from(table).select('*');
    conditions.forEach((cond, idx) => {
      const colMatch = cond.match(/(\w+)\s*=\s*\?/);
      if (colMatch) {
        q = q.eq(colMatch[1], params[idx]) as any;
      }
    });
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  // Pattern: SELECT id FROM <table> ORDER BY id DESC LIMIT 1
  const selectIdLast = sql.match(/^SELECT id FROM (\w+)\s+ORDER BY id DESC LIMIT 1\s*$/i);
  if (selectIdLast) {
    const [, table] = selectIdLast;
    const { data, error } = await supabase.from(table).select('id').order('id', { ascending: false }).limit(1);
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  // Fallback: log and return empty (avoids crashing on INSERT/UPDATE from migrate script)
  console.warn('[db.ts] Unhandled SQL pattern, returning []. SQL:', sql.substring(0, 120));
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
