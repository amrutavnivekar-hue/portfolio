import { NextRequest, NextResponse } from 'next/server';
import { CmsRole } from '@/lib/cms/types';
import { hasRole, sessionFromRequest } from '@/lib/cms/auth';

export async function requireSession(request: NextRequest, roles: CmsRole[] = ['viewer', 'editor', 'admin', 'superadmin']) {
  const session = await sessionFromRequest(request);
  if (!hasRole(session, roles)) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null };
  }
  return { error: null, session };
}
