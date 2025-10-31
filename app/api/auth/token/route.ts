import { NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/src/utils/jwt';

export async function GET(_req: NextRequest) {
  const secret = process.env.MOCK_JWT_SECRET || 'dev-secret';
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: 'demo', iat: now, exp: now + 60 * 60 };
  const token = signJWT(payload, secret);
  return NextResponse.json({ token }, { status: 200 });
}

