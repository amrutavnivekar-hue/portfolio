import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { updateSectionOrder } from '@/lib/cms/xmlEngine';

export async function PATCH(request: NextRequest) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error || !auth.session) {
    return auth.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const sections = Array.isArray(body.sections) ? body.sections : [];
  const result = updateSectionOrder(sections, auth.session.username);
  return NextResponse.json(result);
}
