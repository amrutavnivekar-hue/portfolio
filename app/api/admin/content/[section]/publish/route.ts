import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { getSchemaBySection } from '@/lib/cms/registry';
import { publishSection } from '@/lib/cms/xmlEngine';

interface Params {
  params: { section: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error || !auth.session) {
    return auth.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!getSchemaBySection(params.section)) {
    return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
  }
  publishSection(params.section, auth.session.username);
  return NextResponse.json({ success: true });
}
