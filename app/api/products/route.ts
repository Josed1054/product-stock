import { NextRequest, NextResponse } from 'next/server';
import { store, type Product } from '@/src/mocks/productsStore';
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

export async function GET(req: NextRequest) {
  const unauth = ensureAuth(req);
  if (unauth) return unauth;
  return NextResponse.json(store.products, { status: 200 });
}

export async function POST(req: NextRequest) {
  const unauth = ensureAuth(req);
  if (unauth) return unauth;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object')
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { name, price, stock } = body as Partial<Product>;
  if (!name || typeof name !== 'string' || !name.trim())
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const priceNum = Number(price);
  const stockNum = Number(stock);
  if (!Number.isFinite(priceNum) || priceNum <= 0)
    return NextResponse.json({ error: 'Price must be > 0' }, { status: 400 });
  if (!Number.isFinite(stockNum) || stockNum < 0)
    return NextResponse.json({ error: 'Stock must be >= 0' }, { status: 400 });

  const created: Product = {
    id: store.nextId++,
    name: name.trim(),
    price: priceNum,
    stock: stockNum,
  };
  store.products.push(created);
  return NextResponse.json(created, { status: 201 });
}
