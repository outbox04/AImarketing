import { NextResponse } from "next/server";
import { getClaudeClient } from "@/lib/claude";

export async function GET() {
  const status = await getClaudeClient();
  return NextResponse.json({ ok: status.ok, message: status.message });
}
