import { NextResponse } from "next/server";
import { getGoogleCalendarClient } from "@/lib/google-calendar";

export async function GET() {
  const status = await getGoogleCalendarClient();
  return NextResponse.json({ ok: status.ok, message: status.message });
}
