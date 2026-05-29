import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: Boolean(process.env.CLAUDE_API_KEY),
    message: "Claude is only available through /api/ai/* routes and is never required for dashboard load."
  });
}
