import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getTodayTasks } from "@/lib/rules/marketing-rules";
import { priorityMeta, taskStatusMeta } from "@/lib/status";
import type { Task } from "@/types/task";

const priorityClass = {
  URGENT: "bg-danger",
  HIGH: "bg-warning",
  MEDIUM: "bg-info",
  LOW: "bg-primary"
};

function extractTime(value?: string) {
  return value?.match(/\d{1,2}:\d{2}/)?.[0] ?? "--:--";
}

export function TodayTimeline({ tasks }: { tasks: Task[] }) {
  const timeline = getTodayTasks(tasks);

  return (
    <Card id="today-timeline">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-info-soft text-info">
            <Clock3 size={19} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-main">Timeline hôm nay</h2>
            <p className="text-sm text-text-muted">Các việc đang mở theo ngày bắt đầu hoặc deadline trong hôm nay.</p>
          </div>
        </div>
        <Link href="/tasks" className="hidden items-center gap-1 text-sm font-semibold text-primary md:inline-flex">
          Mở task <ArrowRight size={15} />
        </Link>
      </div>
      <div className="space-y-4">
        {timeline.length > 0 ? (
          timeline.map((item) => {
            const priority = priorityMeta[item.priority];
            const status = taskStatusMeta[item.status];
            return (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 shrink-0 text-sm font-bold text-text-main">{extractTime(item.deadline)}</div>
                <div className="relative flex-1 pb-4 last:pb-0">
                  <span className={`absolute left-0 top-1 h-3 w-3 rounded-full ${priorityClass[item.priority]}`} />
                  <div className="ml-6 rounded-2xl border border-border bg-surface-soft p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={priority.className}>{priority.label}</Badge>
                      <Badge className="border-border bg-white text-text-muted">{status.label}</Badge>
                      <Badge className="border-border bg-white text-text-muted">{item.type}</Badge>
                    </div>
                    <p className="mt-3 text-sm font-bold text-text-main">{item.title}</p>
                    <div className="mt-2 grid gap-1 text-sm text-text-muted">
                      <p>ID: <span className="font-semibold text-text-main">{item.id}</span></p>
                      <p>Bắt đầu: <span className="font-semibold text-text-main">{item.startDate || "Chưa có"}</span></p>
                      <p>Deadline: <span className="font-semibold text-text-main">{item.deadline || "Chưa có"}</span></p>
                      {item.blocker ? <p>Ghi chú: <span className="font-semibold text-text-main">{item.blocker}</span></p> : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-2xl bg-surface-soft p-4 text-sm font-semibold text-text-muted">Không có task nào trong timeline hôm nay.</p>
        )}
      </div>
    </Card>
  );
}
