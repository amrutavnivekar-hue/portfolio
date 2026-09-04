import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { listCmsSections } from '@/lib/cms/xmlEngine';

export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ['viewer', 'editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;
  const sections = listCmsSections().sort((a, b) => a.order - b.order);
  return NextResponse.json(sections);
}
