import { NextResponse } from "next/server";
import { getMarketingData } from "@/lib/data/marketing-data";
import { getKpiSummary, getTodayTasks, getWorkloadSummary } from "@/lib/rules/marketing-rules";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const data = await getMarketingData();
  const summary = getWorkloadSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports, data.contentPosts);
  const dur = Date.now() - start;
  console.log(`[api] GET /api/dashboard/summary took ${dur}ms`);

  return NextResponse.json({
    summary,
    kpis: getKpiSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports, data.contentPosts),
    todayTimeline: getTodayTasks(data.tasks),
    source: data.source,
    errors: data.errors
  });
}
