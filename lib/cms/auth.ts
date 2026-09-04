import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { CmsRole, CmsUser } from '@/lib/cms/types';

const SESSION_COOKIE = 'cms_session';
const SESSION_TTL = 60 * 60 * 24;
const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-secret-in-production';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function arrayBufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlToArrayBuffer(base64url: string): ArrayBuffer {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

const fallbackUsers: CmsUser[] = [
  {
    username: process.env.CMS_ADMIN_USER || 'admin',
    password: process.env.CMS_ADMIN_PASSWORD || 'admin123',
    role: 'superadmin',
  },
  {
    username: process.env.CMS_EDITOR_USER || 'editor',
    password: process.env.CMS_EDITOR_PASSWORD || 'editor123',
    role: 'editor',
  },
];

export interface AuthSession {
  username: string;
  role: CmsRole;
}

export function loginWithPassword(username: string, password: string): AuthSession | null {
  const user = fallbackUsers.find((entry) => entry.username === username);
  if (!user || user.password !== password) return null;
  return { username: user.username, role: user.role };
}

export async function signSessionToken(session: AuthSession): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL
  };
  
  const encodedHeader = arrayBufferToBase64Url(encoder.encode(JSON.stringify(header)));
  const encodedPayload = arrayBufferToBase64Url(encoder.encode(JSON.stringify(payload)));
  
  const tokenInput = `${encodedHeader}.${encodedPayload}`;
  const key = await getCryptoKey(JWT_SECRET);
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(tokenInput)
  );
  
  const encodedSignature = arrayBufferToBase64Url(signature);
  return `${tokenInput}.${encodedSignature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<AuthSession | null> {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    
    const key = await getCryptoKey(JWT_SECRET);
    const signatureBuffer = base64UrlToArrayBuffer(encodedSignature);
    const tokenInput = `${encodedHeader}.${encodedPayload}`;
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      encoder.encode(tokenInput)
    );
    
    if (!isValid) return null;
    
    const payloadBytes = base64UrlToArrayBuffer(encodedPayload);
    const payload = JSON.parse(decoder.decode(payloadBytes));
    
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return { username: payload.username, role: payload.role };
  } catch (err) {
    console.error('Session verification error:', err);
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL,
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
}

export async function sessionFromRequest(request: NextRequest): Promise<AuthSession | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return await verifySessionToken(token);
}

export function hasRole(session: AuthSession | null, required: CmsRole[]) {
  if (!session) return false;
  return required.includes(session.role);
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}
