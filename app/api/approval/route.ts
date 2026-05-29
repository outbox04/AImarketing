import { NextResponse } from "next/server";
import { getApprovalData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getApprovalData();
  return NextResponse.json({ approvalItems: data.approvalItems, source: data.source, errors: data.errors });
}
