import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();
  const resp = { ok: Boolean(process.env.CLAUDE_API_KEY), message: "Claude is only available through /api/ai/* routes and is never required for dashboard load." };
  const dur = Date.now() - start;
  console.log(`[api] GET /api/claude took ${dur}ms`);
  return NextResponse.json(resp);
}
