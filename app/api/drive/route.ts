import { NextResponse } from "next/server";
import { getGoogleDriveClient } from "@/lib/google-drive";

export async function GET() {
  const status = await getGoogleDriveClient();
  return NextResponse.json({ ok: status.ok, message: status.message });
}
