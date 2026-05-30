import { NextRequest, NextResponse } from "next/server";
import { getContentData } from "@/lib/data/marketing-data";
import { updateScheduleSheet } from "@/lib/sheet-write";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getContentData();
  return NextResponse.json({ contentPosts: data.contentPosts, source: data.source, errors: data.errors });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json() as { id?: string; updates?: Parameters<typeof updateScheduleSheet>[1] };

  if (!body.id || !body.updates) {
    return NextResponse.json({ ok: false, message: "Missing id or updates" }, { status: 400 });
  }

  const result = await updateScheduleSheet(body.id, body.updates);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
