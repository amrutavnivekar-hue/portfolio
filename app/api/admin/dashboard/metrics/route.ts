import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { listCmsSections } from '@/lib/cms/xmlEngine';
import { getDrafts, getRevisions } from '@/lib/cms/storage';

export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ['viewer', 'editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;

  const sections = listCmsSections();
  const drafts = Object.keys(getDrafts());
  const revisions = getRevisions();
  const last7Days = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentUpdates = revisions.filter((item) => new Date(item.createdAt).getTime() >= last7Days).length;

  return NextResponse.json({
    totalPages: 1,
    totalSections: sections.length,
    recentUpdates,
    publishedCount: sections.filter((s) => s.status === 'published').length,
    draftCount: drafts.length,
  });
}
