import { redirect } from "next/navigation";
import { CampaignRadar } from "@/components/dashboard/CampaignRadar";
import { CreateRecordAction } from "@/components/dashboard/CreateRecordModal";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { LeadershipDashboard } from "@/components/dashboard/LeadershipDashboard";
import { MorningDigest } from "@/components/dashboard/MorningDigest";
import { StaffDashboard } from "@/components/dashboard/StaffDashboard";
import { TodayTimeline } from "@/components/dashboard/TodayTimeline";
import { filterMarketingDataForUser, hasFullAccess } from "@/lib/auth/access";
import { getCurrentUser } from "@/lib/auth/session";
import { getMarketingData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const rawData = await getMarketingData();
  const data = filterMarketingDataForUser(rawData, currentUser);
  const isLeadershipView = hasFullAccess(currentUser);

  if (isLeadershipView) {
    return (
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard quản trị</h1>
          <p className="text-sm text-text-muted">Tổng quan chỉ số vận hành, chất lượng phòng ban và hiệu suất đội ngũ.</p>
        </div>
        <LeadershipDashboard data={rawData} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard cá nhân</h1>
          <p className="text-sm text-text-muted">Xin chào {currentUser.fullName}. Dữ liệu bên dưới được lọc theo quyền và công việc được giao.</p>
        </div>
        <CreateRecordAction />
      </div>

      <StaffDashboard data={data} user={currentUser} />
      <MorningDigest ownerName={currentUser.fullName} tasks={data.tasks} contentPosts={data.contentPosts} approvalItems={data.approvalItems} campaignEvents={data.campaignEvents} leads={data.leads} adsReports={data.adsReports} />
      <KpiCards tasks={data.tasks} contentPosts={data.contentPosts} approvalItems={data.approvalItems} campaignEvents={data.campaignEvents} leads={data.leads} adsReports={data.adsReports} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]">
        <div className="space-y-6">
          <TodayTimeline tasks={data.tasks} />
          {data.campaignEvents.length > 0 || data.adsReports.length > 0 ? <CampaignRadar campaignEvents={data.campaignEvents} adsReports={data.adsReports} /> : null}
        </div>
      </div>
    </div>
  );
}
