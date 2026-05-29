import { NextResponse } from "next/server";
import { getMarketingData } from "@/lib/data/marketing-data";
import { buildBasicDailyReport, getWorkloadSummary } from "@/lib/rules/marketing-rules";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getMarketingData();
  const summary = getWorkloadSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports);
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "/dashboard";

  return NextResponse.json({
    report: buildBasicDailyReport(summary, data.tasks.length, dashboardUrl),
    summary,
    source: data.source,
    errors: data.errors
  });
}
