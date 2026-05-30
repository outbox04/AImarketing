import { NextRequest, NextResponse } from "next/server";
import { getApprovalData } from "@/lib/data/marketing-data";
import { updateDeadlineSheet, updateScheduleSheet } from "@/lib/sheet-write";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getApprovalData();
  return NextResponse.json({ approvalItems: data.approvalItems, source: data.source, errors: data.errors });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json() as {
    id?: string;
    status?: "APPROVED" | "REJECTED" | "REVISION" | "PENDING" | "SCHEDULED" | "DRAFT";
    note?: string;
  };

  if (!body.id || !body.status) {
    return NextResponse.json({ ok: false, message: "Missing id or status" }, { status: 400 });
  }

  const rawId = body.id.startsWith("approval-") ? body.id.replace(/^approval-/, "") : body.id;
  const result = rawId.startsWith("DL_")
    ? await updateDeadlineSheet(rawId, {
        status: body.status === "APPROVED" || body.status === "SCHEDULED" ? "DONE" : body.status === "REVISION" ? "IN_PROGRESS" : "WAITING",
        note: body.note
      })
    : await updateScheduleSheet(rawId, { status: body.status, note: body.note });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
