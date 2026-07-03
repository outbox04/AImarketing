import { NextResponse } from "next/server";
import { getMarketingData } from "@/lib/data/marketing-data";
import { getWorkloadSummary } from "@/lib/rules/marketing-rules";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const data = await getMarketingData();
  const dur = Date.now() - start;
  console.log(`[api] GET /api/reports took ${dur}ms`);
  return NextResponse.json({
    summary: getWorkloadSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports, data.contentPosts),
    source: data.source,
    errors: data.errors
  });
}
