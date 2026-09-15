import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { listCmsSections } from '@/lib/cms/xmlEngine';
import { getDrafts, getRevisions, getActivityLog } from '@/lib/cms/storage';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ['viewer', 'editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;

  const sections = listCmsSections();
  const drafts = getDrafts();
  const revisions = getRevisions();
  const activity = getActivityLog ? getActivityLog() : [];

  const publishedSections = sections.filter((s) => s.status === 'published').length;
  const draftSections = Object.keys(drafts).length;
  const totalRevisions = revisions.length;
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Fetch counts in parallel for fast response
  let unreadMessages = 0;
  let totalMessages = 0;
  let visitorsThisWeek = 0;

  try {
    const [totalRes, unreadRes, visitorRes] = await Promise.all([
      supabaseAdmin.from('contact_submissions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('read', false),
      supabaseAdmin.from('visitor_logs').select('*', { count: 'exact', head: true }).gte('created_at', last7Days),
    ]);

    totalMessages = totalRes.count ?? 0;
    unreadMessages = unreadRes.count ?? 0;
    visitorsThisWeek = visitorRes.count ?? 0;
  } catch {
    // Graceful fallback if tables are empty/unavailable
  }

  // Recent activity (last 10)
  const recentActivity = Array.isArray(activity)
    ? [...activity].reverse().slice(0, 10)
    : [];

  return NextResponse.json({
    totalSections: sections.length,
    publishedSections,
    draftSections,
    totalRevisions,
    totalMessages,
    unreadMessages,
    visitorsThisWeek,
    recentActivity,
  });
}
