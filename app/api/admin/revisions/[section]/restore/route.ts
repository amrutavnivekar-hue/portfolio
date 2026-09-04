import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { restoreRevision } from '@/lib/cms/xmlEngine';

interface Params {
  params: { section: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error || !auth.session) {
    return auth.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (!body.revisionId) {
    return NextResponse.json({ error: 'revisionId is required.' }, { status: 400 });
  }
  restoreRevision(params.section, body.revisionId, auth.session.username);
  return NextResponse.json({ success: true });
}
