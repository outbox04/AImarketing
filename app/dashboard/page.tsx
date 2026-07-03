import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { ApprovalPreview } from "@/components/dashboard/ApprovalPreview";
import { CampaignRadar } from "@/components/dashboard/CampaignRadar";
import { CreateRecordAction } from "@/components/dashboard/CreateRecordModal";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { MorningDigest } from "@/components/dashboard/MorningDigest";
import { TodayTimeline } from "@/components/dashboard/TodayTimeline";
import { getMarketingData } from "@/lib/data/marketing-data";

export const revalidate = 15;

export default async function DashboardPage() {
  const data = await getMarketingData();

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-text-muted">Tạo và quản lý dữ liệu marketing trực tiếp từ Supabase.</p>
        </div>
        <CreateRecordAction />
      </div>

      <MorningDigest tasks={data.tasks} contentPosts={data.contentPosts} approvalItems={data.approvalItems} campaignEvents={data.campaignEvents} leads={data.leads} adsReports={data.adsReports} />
      <KpiCards tasks={data.tasks} contentPosts={data.contentPosts} approvalItems={data.approvalItems} campaignEvents={data.campaignEvents} leads={data.leads} adsReports={data.adsReports} />
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]">
        <ApprovalPreview approvalItems={data.approvalItems} />
        <div className="space-y-6">
          <TodayTimeline tasks={data.tasks} />
          <CampaignRadar campaignEvents={data.campaignEvents} adsReports={data.adsReports} />
          <AiInsightCard />
        </div>
      </div>
    </div>
  );
}
