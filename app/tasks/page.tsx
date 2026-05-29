import { LayoutGrid, ListFilter } from "lucide-react";
import { TaskKanban } from "@/components/tasks/TaskKanban";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export default function TasksPage() {
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
      <TaskKanban />
    </div>
  );
}
