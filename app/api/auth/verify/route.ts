import { NextRequest, NextResponse } from "next/server";

import { verifyJWT } from "@/src/utils/jwt";

export async function POST(req: NextRequest) {
  const secret = process.env.MOCK_JWT_SECRET || "dev-secret";
  const body = await req.json().catch(() => null);
  const token = body?.token as string | undefined;
  if (!token)
    return NextResponse.json(
      { ok: false, error: "token required" },
      { status: 400 }
    );
  const payload = verifyJWT(token, secret);
  if (!payload) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, payload }, { status: 200 });
}
