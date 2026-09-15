import { NextRequest, NextResponse } from 'next/server';

export async function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  // Add performance and security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
