import { NextResponse } from "next/server";
import { getGoogleCalendarClient } from "@/lib/google-calendar";

export async function GET() {
  const start = Date.now();
  const status = await getGoogleCalendarClient();
  const dur = Date.now() - start;
  console.log(`[api] GET /api/calendar took ${dur}ms`);
  return NextResponse.json({ ok: status.ok, message: status.message });
}
