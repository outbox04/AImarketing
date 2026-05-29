import { NextResponse } from "next/server";
import { getFacebookClient } from "@/lib/facebook";

export async function GET() {
  const status = await getFacebookClient();
  return NextResponse.json({ ok: status.ok, message: status.message });
}
