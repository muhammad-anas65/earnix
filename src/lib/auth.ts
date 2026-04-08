import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const AUTH_SECRET = process.env.JWT_SECRET || 'earnix-fallback-secret-123';

export interface SessionData {
  userId: string;
  email: string;
  role: string;
}

export async function createSession(data: SessionData) {
  const payload = JSON.stringify({ ...data, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }); // 7 days
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  const token = `${Buffer.from(payload).toString('base64')}.${signature}`;
  
  return token;
}

export function verifySession(token: string): SessionData | null {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;
    
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString();
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadJson).digest('hex');
    
    if (signature !== expectedSignature) return null;
    
    const data = JSON.parse(payloadJson);
    if (data.exp < Date.now()) return null;
    
    return data;
  } catch (err) {
    return null;
  }
}

export function getSession(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  if (!token) return null;
  return verifySession(token);
}
