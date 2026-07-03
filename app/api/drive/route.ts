import { NextResponse } from "next/server";
import { getGoogleDriveClient } from "@/lib/google-drive";

export async function GET() {
  const start = Date.now();
  const status = await getGoogleDriveClient();
  const dur = Date.now() - start;
  console.log(`[api] GET /api/drive took ${dur}ms`);
  return NextResponse.json({ ok: status.ok, message: status.message });
}
