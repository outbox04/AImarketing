import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: Boolean(process.env.OPENAI_API_KEY),
    message: "OpenAI is only available through /api/ai/* routes and is never required for dashboard load."
  });
}
