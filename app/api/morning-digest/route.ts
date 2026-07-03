import { NextResponse } from "next/server";
import { getMarketingData } from "@/lib/data/marketing-data";
import { buildMorningDigest, getWorkloadSummary } from "@/lib/rules/marketing-rules";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const data = await getMarketingData();
  const summary = getWorkloadSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports);
  const dur = Date.now() - start;
  console.log(`[api] GET /api/morning-digest took ${dur}ms`);
  const approvalUrl = process.env.NEXT_PUBLIC_APPROVAL_URL ?? "/content/approval";

  return NextResponse.json({
    digest: buildMorningDigest(summary, approvalUrl),
    summary,
    source: data.source,
    errors: data.errors
  });
}
