import { NextResponse } from "next/server";
import { getMarketingData } from "@/lib/data/marketing-data";
import { buildBasicDailyReport, getWorkloadSummary } from "@/lib/rules/marketing-rules";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const data = await getMarketingData();
  const summary = getWorkloadSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports, data.contentPosts);
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "/dashboard";
  const dur = Date.now() - start;
  console.log(`[api] GET /api/reports/basic took ${dur}ms`);

  return NextResponse.json({
    report: buildBasicDailyReport(summary, data.tasks.length, dashboardUrl),
    summary,
    source: data.source,
    errors: data.errors
  });
}
