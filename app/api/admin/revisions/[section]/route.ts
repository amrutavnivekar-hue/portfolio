import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { listRevisions } from '@/lib/cms/xmlEngine';

interface Params {
  params: { section: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireSession(request, ['viewer', 'editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;
  return NextResponse.json(listRevisions(params.section));
}
