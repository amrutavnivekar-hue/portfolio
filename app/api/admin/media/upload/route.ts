import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/cms/http';
import { getMediaAssets, saveMediaAssets } from '@/lib/cms/storage';

export async function POST(request: NextRequest) {
  const auth = await requireSession(request, ['editor', 'admin', 'superadmin']);
  if (auth.error || !auth.session) {
    return auth.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (!body.path) {
    return NextResponse.json({ error: 'path is required.' }, { status: 400 });
  }
  const media = getMediaAssets();
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    path: body.path,
    alt: body.alt || '',
    uploadedBy: auth.session.username,
    uploadedAt: new Date().toISOString(),
  };
  media.unshift(item);
  saveMediaAssets(media.slice(0, 500));
  return NextResponse.json({ success: true, item });
}

export async function GET(request: NextRequest) {
  const auth = await requireSession(request, ['viewer', 'editor', 'admin', 'superadmin']);
  if (auth.error) return auth.error;
  return NextResponse.json(getMediaAssets());
}
