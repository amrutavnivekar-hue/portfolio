import { NextRequest, NextResponse } from 'next/server';

// Only track public portfolio pages — skip admin, API, static assets
const TRACK_PATHS = /^\/(?!admin|api|_next|favicon|robots|sitemap)/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (TRACK_PATHS.test(pathname)) {
    // Fire-and-forget — don't block the response
    const url = request.nextUrl.clone();
    url.pathname = '/api/track';

    const payload = JSON.stringify({
      path: pathname,
      referrer: request.headers.get('referer') || '',
      userAgent: request.headers.get('user-agent') || '',
      ip:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown',
    });

    // Use waitUntil if available, else just fire
    fetch(new URL('/api/track', request.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-internal': 'middleware' },
      body: payload,
    }).catch(() => {});
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
