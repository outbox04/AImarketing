import { priorityMeta, taskStatusMeta } from "@/lib/status";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Task } from "@/types/task";

export function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface-soft text-xs uppercase text-text-soft">
            <tr>
              <th className="px-5 py-4">Task</th>
              <th className="px-5 py-4">Loại</th>
              <th className="px-5 py-4">Deadline</th>
              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-5 py-4 font-semibold text-text-main">{task.title}</td>
                <td className="px-5 py-4 text-text-muted">{task.type}</td>
                <td className="px-5 py-4 text-text-muted">{task.deadline}</td>
                <td className="px-5 py-4"><Badge className={priorityMeta[task.priority].className}>{priorityMeta[task.priority].label}</Badge></td>
                <td className="px-5 py-4 text-text-muted">{taskStatusMeta[task.status].label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
