import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { deleteSection, loadSectionModel, saveDraft } from '@/lib/cms/xmlEngine';
import { getSchemaBySection } from '@/lib/cms/registry';

interface Params {
  params: { section: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireSession(request, ['viewer', 'editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;
  if (!getSchemaBySection(params.section)) {
    return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
  }
  const section = await loadSectionModel(params.section);
  return NextResponse.json(section);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireSession(request, ['editor', 'admin', 'superadmin']);
  if (auth.error || !auth.session) {
    return auth.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!getSchemaBySection(params.section)) {
    return NextResponse.json({ error: 'Section not found.' }, { status: 404 });
  }
  const body = await request.json();
  const xml = await saveDraft(params.section, body.model || {}, auth.session.username);
  return NextResponse.json({ success: true, xml });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error || !auth.session) {
    return auth.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  deleteSection(params.section, auth.session.username);
  return NextResponse.json({ success: true });
}
