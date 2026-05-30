import { NextResponse } from "next/server";
import { getMarketingData } from "@/lib/data/marketing-data";
import { getKpiSummary, getTodayTasks, getWorkloadSummary } from "@/lib/rules/marketing-rules";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getMarketingData();
  const summary = getWorkloadSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports, data.contentPosts);

  return NextResponse.json({
    summary,
    kpis: getKpiSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports, data.contentPosts),
    todayTimeline: getTodayTasks(data.tasks),
    source: data.source,
    errors: data.errors
  });
}
