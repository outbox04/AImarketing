import { LayoutGrid, ListFilter } from "lucide-react";
import { TaskKanban } from "@/components/tasks/TaskKanban";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTasksData } from "@/lib/data/marketing-data";

export const revalidate = 15;

export default async function TasksPage() {
  const data = await getTasksData();

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        eyebrow="Marketing Workflow"
        title="Task Marketing"
        description="Kanban gọn cho đội marketing một người: ít cột, thấy ngay việc bị chặn và deadline nguy hiểm."
        actions={
          <>
            <Button variant="secondary"><ListFilter size={17} /> Lọc task</Button>
            <Button variant="primary"><LayoutGrid size={17} /> Tạo task</Button>
          </>
        }
      />
      <TaskKanban tasks={data.tasks} />
    </div>
  );
}
