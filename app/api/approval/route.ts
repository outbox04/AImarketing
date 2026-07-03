import { NextRequest, NextResponse } from "next/server";
import { getApprovalData } from "@/lib/data/marketing-data";
import { supabaseAdmin } from "@/lib/supabase-client";

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
  const updates: Record<string, unknown> = { status: body.status };
  if (body.note) {
    updates.aiRiskNote = body.note;
  }

  const { error, data } = await supabaseAdmin.from("approval_items").update(updates).eq("id", rawId);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data }, { status: 200 });
}
