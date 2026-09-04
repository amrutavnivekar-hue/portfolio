import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * query() — drop-in replacement for the old mysql2 query helper.
 * Accepts a table name and options instead of raw SQL.
 * For raw SQL use supabase.rpc() or supabase.from() directly.
 */
export async function queryTable(
  table: string,
  options?: {
    select?: string;
    order?: { column: string; ascending?: boolean };
    eq?: { column: string; value: any };
    limit?: number;
    single?: boolean;
  }
) {
  let q = supabase.from(table).select(options?.select ?? '*');

  if (options?.eq) {
    q = q.eq(options.eq.column, options.eq.value) as any;
  }
  if (options?.order) {
    q = q.order(options.order.column, { ascending: options.order.ascending ?? true }) as any;
  }
  if (options?.limit) {
    q = q.limit(options.limit) as any;
  }

  const { data, error } = await (options?.single ? (q as any).single() : q);

  if (error) {
    console.error(`Supabase query error on table "${table}":`, error.message);
    throw new Error(error.message);
  }

  return data;
}

export default supabase;
