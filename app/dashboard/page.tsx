import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { ApprovalPreview } from "@/components/dashboard/ApprovalPreview";
import { CampaignRadar } from "@/components/dashboard/CampaignRadar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { MorningDigest } from "@/components/dashboard/MorningDigest";
import { TodayTimeline } from "@/components/dashboard/TodayTimeline";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <MorningDigest />
      <KpiCards />
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]">
        <ApprovalPreview />
        <div className="space-y-6">
          <TodayTimeline />
          <CampaignRadar />
          <AiInsightCard />
        </div>
      </div>
    </div>
  );
}
