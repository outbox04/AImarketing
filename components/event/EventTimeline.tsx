import { Card } from "@/components/ui/Card";
import type { CampaignEvent } from "@/types/event";

export function EventTimeline({ campaignEvents }: { campaignEvents: CampaignEvent[] }) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-text-main">Timeline</h2>
      <div className="mt-5 space-y-4">
        {campaignEvents.map((event) => (
          <div key={event.id} className="flex gap-3">
            <span className="mt-2 h-3 w-3 rounded-full bg-primary" />
            <div>
              <p className="font-bold text-text-main">{event.name}</p>
              <p className="text-sm text-text-muted">{event.timeline} · {event.progress}% hoàn thành</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
