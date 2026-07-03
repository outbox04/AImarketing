import { NextResponse } from "next/server";
import { getTelegramClient } from "@/lib/telegram";

export async function GET() {
  const start = Date.now();
  const status = await getTelegramClient();
  const dur = Date.now() - start;
  console.log(`[api] GET /api/telegram took ${dur}ms`);
  return NextResponse.json({ ok: status.ok, message: status.message });
}
