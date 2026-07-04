import { redirect } from "next/navigation";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { ApprovalPreview } from "@/components/dashboard/ApprovalPreview";
import { CampaignRadar } from "@/components/dashboard/CampaignRadar";
import { CreateRecordAction } from "@/components/dashboard/CreateRecordModal";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { LeadershipDashboard } from "@/components/dashboard/LeadershipDashboard";
import { MorningDigest } from "@/components/dashboard/MorningDigest";
import { StaffDashboard } from "@/components/dashboard/StaffDashboard";
import { TodayTimeline } from "@/components/dashboard/TodayTimeline";
import { filterMarketingDataForUser, hasFullAccess } from "@/lib/auth/access";
import { getCurrentUser } from "@/lib/auth/session";
import { departmentLabel } from "@/lib/auth/users";
import { getMarketingData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const rawData = await getMarketingData();
  const data = filterMarketingDataForUser(rawData, currentUser);
  const scopeLabel = hasFullAccess(currentUser) ? "toan he thong" : `phong ${departmentLabel(currentUser.department)}`;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-text-muted">Xin chao {currentUser.fullName}. Dashboard dang hien thi du lieu theo pham vi {scopeLabel}.</p>
        </div>
        <CreateRecordAction />
      </div>

      {hasFullAccess(currentUser) ? (
        <LeadershipDashboard data={rawData} />
      ) : (
        <>
          <StaffDashboard data={data} user={currentUser} />
          <MorningDigest ownerName={currentUser.fullName} tasks={data.tasks} contentPosts={data.contentPosts} approvalItems={data.approvalItems} campaignEvents={data.campaignEvents} leads={data.leads} adsReports={data.adsReports} />
          <KpiCards tasks={data.tasks} contentPosts={data.contentPosts} approvalItems={data.approvalItems} campaignEvents={data.campaignEvents} leads={data.leads} adsReports={data.adsReports} />
        </>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]">
        {hasFullAccess(currentUser) && data.approvalItems.length > 0 ? <ApprovalPreview approvalItems={data.approvalItems} /> : null}
        <div className="space-y-6">
          <TodayTimeline tasks={data.tasks} />
          {data.campaignEvents.length > 0 || data.adsReports.length > 0 ? <CampaignRadar campaignEvents={data.campaignEvents} adsReports={data.adsReports} /> : null}
          <AiInsightCard />
        </div>
      </div>
    </div>
  );
}
