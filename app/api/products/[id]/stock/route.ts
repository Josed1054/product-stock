import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/src/mocks/productsStore';
import { verifyJWT } from '@/src/utils/jwt';

function ensureAuth(req: NextRequest): NextResponse | null {
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/^bearer\s+(.+)/i);
  if (!m) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const token = m[1];
  const secret = process.env.MOCK_JWT_SECRET || 'dev-secret';
  const payload = verifyJWT(token, secret);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = ensureAuth(req);
  if (unauth) return unauth;

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id))
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const stockRaw = req.nextUrl.searchParams.get('stock');
  const stock = Number(stockRaw);
  if (!Number.isFinite(stock) || stock < 0)
    return NextResponse.json({ error: 'Invalid stock' }, { status: 400 });

  const prod = store.products.find((p) => p.id === id);
  if (!prod) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  prod.stock = stock;
  return NextResponse.json(prod, { status: 200 });
}
