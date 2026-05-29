import { AlertTriangle, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { campaignEvents } from "@/lib/mock-data";

export function CampaignRadar() {
  return (
    <Card>
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-warning-soft text-warning">
          <Target size={19} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-main">Campaign/Event Radar</h2>
          <p className="text-sm text-text-muted">Theo dõi rủi ro và checklist đang chặn tiến độ.</p>
        </div>
      </div>
      <div className="space-y-4">
        {campaignEvents.slice(0, 3).map((event) => (
          <div key={event.id} className="rounded-2xl border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-text-main">{event.name}</p>
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
      </div>
    </Card>
  );
}
