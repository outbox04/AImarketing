import { NextResponse } from "next/server";
import { getOpenAiClient } from "@/lib/openai";

export async function GET() {
  const status = await getOpenAiClient();
  return NextResponse.json({ ok: status.ok, message: status.message });
}
