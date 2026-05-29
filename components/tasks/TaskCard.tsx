import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { priorityMeta, taskStatusMeta } from "@/lib/status";
import type { Task } from "@/types/task";

export function TaskCard({ task }: { task: Task }) {
  const priority = priorityMeta[task.priority];
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge className={priority.className}>{priority.label}</Badge>
        <span className="text-xs font-semibold text-text-soft">{task.type}</span>
      </div>
      <h3 className="font-bold text-text-main">{task.title}</h3>
      <p className="mt-2 text-sm font-semibold text-text-muted">{task.deadline}</p>
      {task.blocker ? <p className="mt-3 rounded-2xl bg-danger-soft p-2 text-sm font-semibold text-red-700">{task.blocker}</p> : null}
      <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
        <span>{taskStatusMeta[task.status].label}</span>
        {task.fileUrl ? <ExternalLink size={16} /> : null}
      </div>
    </Card>
  );
}
