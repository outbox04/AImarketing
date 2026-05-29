import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CampaignEvent } from "@/types/event";

export function EventChecklist({ event }: { event: CampaignEvent }) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-text-main">Checklist còn thiếu</h2>
      <div className="mt-5 space-y-3">
        {event.missingChecklist.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl bg-surface-soft p-3 text-sm font-semibold text-text-main">
            <CheckCircle2 size={17} className="text-warning" />
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}
