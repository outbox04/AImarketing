import { NextResponse } from "next/server";
import { getTelegramClient } from "@/lib/telegram";

export async function GET() {
  const status = await getTelegramClient();
  return NextResponse.json({ ok: status.ok, message: status.message });
}
