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

  // Fetch contact submissions count
  let unreadMessages = 0;
  let totalMessages = 0;
  try {
    const { count: total } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    const { count: unread } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);
    totalMessages = total ?? 0;
    unreadMessages = unread ?? 0;
  } catch { /* table may not exist yet */ }

  // Fetch visitor count (last 7 days)
  let visitorsThisWeek = 0;
  try {
    const { count } = await supabaseAdmin
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', last7Days);
    visitorsThisWeek = count ?? 0;
  } catch { /* table may not exist yet */ }

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
