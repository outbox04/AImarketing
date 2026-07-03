import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();
  const resp = { ok: Boolean(process.env.OPENAI_API_KEY), message: "OpenAI is only available through /api/ai/* routes and is never required for dashboard load." };
  const dur = Date.now() - start;
  console.log(`[api] GET /api/openai took ${dur}ms`);
  return NextResponse.json(resp);
}
