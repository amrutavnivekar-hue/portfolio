import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { getActivityLog } from '@/lib/cms/storage';

export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ['admin', 'superadmin']);
  if (auth.error) return auth.error;
  return NextResponse.json(getActivityLog().slice(0, 100));
}
