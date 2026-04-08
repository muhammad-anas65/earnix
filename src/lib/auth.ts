import { NextRequest } from 'next/server';

const AUTH_SECRET = process.env.JWT_SECRET || 'earnix-fallback-secret-123';

export interface SessionData {
  userId: string;
  email: string;
  role: string;
  exp?: number;
}

// Convert string to ArrayBuffer safely for Web Crypto
const getEncoder = () => new TextEncoder();

async function getHmacKey() {
  return await crypto.subtle.importKey(
    'raw',
    getEncoder().encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSession(data: SessionData) {
  const payload = JSON.stringify({ ...data, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }); // 7 days
  const key = await getHmacKey();
  
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    getEncoder().encode(payload)
  );
  
  const signature = bufferToHex(signatureBuffer);
  
  const base64Payload = btoa(unescape(encodeURIComponent(payload)));
  const token = `${base64Payload}.${signature}`;
  
  return token;
}

export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;
    
    // Safely decode base64
    const payloadJson = decodeURIComponent(escape(atob(payloadBase64)));
    
    // Re-sign to verify
    const key = await getHmacKey();
    const expectedSignatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      getEncoder().encode(payloadJson)
    );
    
    const expectedSignature = bufferToHex(expectedSignatureBuffer);
    
    if (signature !== expectedSignature) return null;
    
    const data = JSON.parse(payloadJson);
    if (data.exp && data.exp < Date.now()) return null;
    
    return data;
  } catch (err) {
    return null;
  }
}

export async function getSession(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  if (!token) return null;
  return await verifySession(token);
}
