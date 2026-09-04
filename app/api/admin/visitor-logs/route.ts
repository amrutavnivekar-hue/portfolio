import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ['editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;

  // Last 7 days by default
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from('visitor_logs')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const logs = data ?? [];

  // Aggregate stats
  const totalVisits = logs.length;
  const uniquePaths = [...new Set(logs.map((l: any) => l.path))];
  const pathCounts: Record<string, number> = {};
  logs.forEach((l: any) => { pathCounts[l.path] = (pathCounts[l.path] || 0) + 1; });
  const topPages = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  return NextResponse.json({ totalVisits, uniquePages: uniquePaths.length, topPages, recent: logs.slice(0, 50) });
}
