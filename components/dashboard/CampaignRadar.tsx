import { AlertTriangle, ArrowRight, RadioTower, Target } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { AdsReport } from "@/types/ads";
import type { CampaignEvent } from "@/types/event";

function adsStatusLabel(status: AdsReport["status"]) {
  const labels: Record<AdsReport["status"], string> = {
    Running: "Đang chạy",
    Paused: "Tạm dừng",
    Learning: "Đang học",
    Completed: "Hoàn thành",
    Planning: "Lên kế hoạch"
  };
  return labels[status];
}

export function CampaignRadar({ campaignEvents, adsReports }: { campaignEvents: CampaignEvent[]; adsReports: AdsReport[] }) {
  const visibleAds = adsReports.slice(0, 3);
  const visibleEvents = campaignEvents.slice(0, Math.max(0, 3 - visibleAds.length));

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-warning-soft text-warning">
            <Target size={19} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">Campaign/Event Radar</h2>
            <p className="text-sm text-text-muted">Theo dõi campaign ads và media event đang ảnh hưởng tới tiến độ hôm nay.</p>
          </div>
        </div>
        <Link href="/ads" className="hidden items-center gap-1 text-sm font-semibold text-primary md:inline-flex">
          Mở ads <ArrowRight size={15} />
        </Link>
      </div>
      <div className="space-y-4">
        {visibleAds.map((ad) => (
          <div key={ad.id} className="rounded-2xl border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-indigo-100 bg-primary-soft text-primary">Ads</Badge>
                  <Badge className="border-border bg-surface-soft text-text-muted">{adsStatusLabel(ad.status)}</Badge>
                </div>
                <p className="mt-3 font-bold text-text-main">{ad.campaignName}</p>
                <p className="mt-1 text-sm text-text-muted">{ad.platform} · Ngân sách {formatCurrency(ad.budget)}</p>
              </div>
              <RadioTower className="text-primary" size={18} />
            </div>
            <div className="mt-3 grid gap-1 text-sm text-text-muted">
              <p>ID: <span className="font-semibold text-text-main">{ad.id}</span></p>
              <p>Spend hiện có: <span className="font-semibold text-text-main">{formatCurrency(ad.spend)}</span></p>
              <p>Lead/CPL: <span className="font-semibold text-text-main">{ad.leads} lead · {formatCurrency(ad.cpl)}</span></p>
            </div>
          </div>
        ))}
        {visibleEvents.map((event) => (
          <div key={event.id} className="rounded-2xl border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-amber-100 bg-warning-soft text-amber-700">Event</Badge>
                  <Badge className="border-border bg-surface-soft text-text-muted">{event.approvalStatus}</Badge>
                </div>
                <p className="mt-3 font-bold text-text-main">{event.name}</p>
                <p className="mt-1 text-sm text-text-muted">{event.goal}</p>
              </div>
              <span className="text-sm font-bold text-primary">{event.progress}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-surface-soft">
              <div className="h-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" style={{ width: `${event.progress}%` }} />
            </div>
            <div className="mt-3 flex gap-2 rounded-2xl bg-warning-soft p-3 text-sm font-semibold text-amber-800">
              <AlertTriangle size={17} />
              {event.risk}
            </div>
          </div>
        ))}
        {visibleAds.length === 0 && visibleEvents.length === 0 ? (
          <p className="rounded-2xl bg-surface-soft p-4 text-sm font-semibold text-text-muted">Chưa có campaign hoặc event cần theo dõi.</p>
        ) : null}
      </div>
    </Card>
  );
}
