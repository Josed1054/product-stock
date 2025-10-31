import crypto from 'crypto';

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function b64urlDecode(str: string) {
  const pad = 4 - (str.length % 4 || 4);
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad === 4 ? 0 : pad);
  return Buffer.from(base64, 'base64');
}

export type JWTPayload = {
  sub?: string;
  iat?: number;
  exp?: number;
  [k: string]: unknown;
};

export function signJWT(payload: JWTPayload, secret: string) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encHeader = b64url(JSON.stringify(header));
  const encPayload = b64url(JSON.stringify(payload));
  const data = `${encHeader}.${encPayload}`;
  const sig = crypto.createHmac('sha256', secret).update(data).digest();
  const encSig = b64url(sig);
  return `${data}.${encSig}`;
}

export function verifyJWT(token: string, secret: string): JWTPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [encHeader, encPayload, encSig] = parts;
  const data = `${encHeader}.${encPayload}`;
  const expected = b64url(crypto.createHmac('sha256', secret).update(data).digest());
  if (!crypto.timingSafeEqual(Buffer.from(encSig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(b64urlDecode(encPayload).toString('utf8')) as JWTPayload;
    if (payload && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      if (now >= payload.exp) return null;
    }
    return payload;
  } catch {
    return null;
  }
}
