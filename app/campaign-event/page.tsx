import { EventChecklist } from "@/components/event/EventChecklist";
import { EventTimeline } from "@/components/event/EventTimeline";
import { VendorTable } from "@/components/event/VendorTable";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getEventData } from "@/lib/data/marketing-data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignEventPage() {
  const data = await getEventData();
  const selected = data.campaignEvents[0];

  if (!selected) {
    return (
      <div className="mx-auto max-w-[1500px]">
        <PageHeader eyebrow="Leadership Request" title="Campaign & Event" description="Chưa có dữ liệu campaign/event." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        eyebrow="Leadership Request"
        title="Campaign & Event"
        description="Left-right layout để chọn campaign nhanh và xử lý chi tiết: brief, mục tiêu, checklist, vendor, ngân sách, proposal, media plan, rủi ro."
      />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          {data.campaignEvents.map((event) => (
            <Card key={event.id} className={`p-4 ${event.id === selected.id ? "border-primary bg-primary-soft" : ""}`}>
              <h3 className="font-bold text-text-main">{event.name}</h3>
              <p className="mt-1 text-sm text-text-muted">{event.goal}</p>
              <p className="mt-3 text-sm font-bold text-primary">{event.progress}% hoàn thành</p>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-text-main">{selected.name}</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">Brief từ ban lãnh đạo: tạo workshop AI Marketing có khả năng tạo lead chất lượng, có proposal rõ ngân sách, timeline, media plan và rủi ro.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-surface-soft p-4"><p className="text-xs font-bold uppercase text-text-soft">Ngân sách</p><p className="mt-1 font-bold">{formatCurrency(selected.budget)}</p></div>
              <div className="rounded-2xl bg-surface-soft p-4"><p className="text-xs font-bold uppercase text-text-soft">Duyệt</p><p className="mt-1 font-bold">{selected.approvalStatus}</p></div>
              <div className="rounded-2xl bg-danger-soft p-4"><p className="text-xs font-bold uppercase text-red-400">Rủi ro</p><p className="mt-1 font-bold text-red-700">{selected.risk}</p></div>
            </div>
          </Card>
          <div className="grid gap-6 lg:grid-cols-2"><EventTimeline campaignEvents={data.campaignEvents} /><EventChecklist event={selected} /></div>
          <VendorTable />
        </div>
      </div>
    </div>
  );
}
