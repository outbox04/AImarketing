import { TodayTimeline } from "@/components/dashboard/TodayTimeline";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { ApprovalPreview } from "@/components/dashboard/ApprovalPreview";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMarketingData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const data = await getMarketingData();

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Focus Mode"
        title="Hôm nay cần xử lý gì"
        description="Một màn hình giảm tải nhận thức: lịch trong ngày, nội dung chờ duyệt và đề xuất ưu tiên từ AI."
      />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <TodayTimeline tasks={data.tasks} />
          <AiInsightCard />
        </div>
        <ApprovalPreview approvalItems={data.approvalItems} />
      </div>
    </div>
  );
}
