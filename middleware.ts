import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect mock products API. Route handlers also perform signature verification.
  if (pathname.startsWith('/api/products')) {
    const auth = req.headers.get('authorization') || '';
    if (!/^bearer\s+.+/i.test(auth)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/products/:path*'],
};

