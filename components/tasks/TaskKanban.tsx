import { tasks } from "@/lib/mock-data";
import { taskStatusMeta } from "@/lib/status";
import type { TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";

const columns: TaskStatus[] = ["INBOX", "TODO", "IN_PROGRESS", "WAITING", "DONE"];

export function TaskKanban() {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {columns.map((column) => (
        <section key={column} className="rounded-card border border-border bg-white p-4 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-main">{taskStatusMeta[column].label}</h2>
            <span className="rounded-full bg-surface-soft px-2 py-1 text-xs font-bold text-text-muted">
              {tasks.filter((task) => task.status === column).length}
            </span>
          </div>
          <div className="space-y-3">
            {tasks.filter((task) => task.status === column).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
