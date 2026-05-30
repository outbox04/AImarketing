import { NextRequest, NextResponse } from "next/server";
import { getTasksData } from "@/lib/data/marketing-data";
import { updateDeadlineSheet } from "@/lib/sheet-write";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getTasksData();
  return NextResponse.json({ tasks: data.tasks, source: data.source, errors: data.errors });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json() as { id?: string; updates?: Parameters<typeof updateDeadlineSheet>[1] };

  if (!body.id || !body.updates) {
    return NextResponse.json({ ok: false, message: "Missing id or updates" }, { status: 400 });
  }

  const result = await updateDeadlineSheet(body.id, body.updates);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
