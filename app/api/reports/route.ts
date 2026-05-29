import { NextResponse } from "next/server";
import { getMarketingData } from "@/lib/data/marketing-data";
import { getWorkloadSummary } from "@/lib/rules/marketing-rules";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getMarketingData();
  return NextResponse.json({
    summary: getWorkloadSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports),
    source: data.source,
    errors: data.errors
  });
}
