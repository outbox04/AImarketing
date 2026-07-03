import { NextResponse } from "next/server";
import { getFacebookClient } from "@/lib/facebook";

export async function GET() {
  const start = Date.now();
  const status = await getFacebookClient();
  const dur = Date.now() - start;
  console.log(`[api] GET /api/facebook took ${dur}ms`);
  return NextResponse.json({ ok: status.ok, message: status.message });
}
