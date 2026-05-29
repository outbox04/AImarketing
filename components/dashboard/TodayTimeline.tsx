import { Clock3 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getTodayTasks } from "@/lib/rules/marketing-rules";
import type { Task } from "@/types/task";

const priorityClass = {
  URGENT: "bg-danger",
  HIGH: "bg-warning",
  MEDIUM: "bg-info",
  LOW: "bg-primary"
};

function extractTime(deadline: string) {
  return deadline.match(/\d{1,2}:\d{2}/)?.[0] ?? "--:--";
}

export function TodayTimeline({ tasks }: { tasks: Task[] }) {
  const timeline = getTodayTasks(tasks);

  return (
    <Card>
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-info-soft text-info">
          <Clock3 size={19} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-main">Timeline hôm nay</h2>
          <p className="text-sm text-text-muted">Giữ nhịp làm việc theo deadline quan trọng.</p>
        </div>
      </div>
      <div className="space-y-4">
        {timeline.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-14 shrink-0 text-sm font-bold text-text-main">{extractTime(item.deadline)}</div>
            <div className="relative flex-1 pb-4 last:pb-0">
              <span className={`absolute left-0 top-1 h-3 w-3 rounded-full ${priorityClass[item.priority]}`} />
              <div className="ml-6 rounded-2xl border border-border bg-surface-soft p-3">
                <p className="text-sm font-semibold text-text-main">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
