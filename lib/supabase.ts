import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-side admin client — uses service role key to bypass RLS
const adminKey = supabaseServiceKey || supabaseAnonKey;
export const supabaseAdmin = createClient(supabaseUrl, adminKey);

// Public client — anon key, for browser-side use only
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  try {
    const client = typeof window === 'undefined' ? supabaseAdmin : supabase;
    let q = client.from(table).select(options?.select ?? '*');

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
      console.warn(`[supabase] queryTable on "${table}":`, error.message);
      return [];
    }

    return data || [];
  } catch (err: any) {
    console.warn(`[supabase] queryTable error on "${table}":`, err?.message || err);
    return [];
  }
}

export default supabase;
