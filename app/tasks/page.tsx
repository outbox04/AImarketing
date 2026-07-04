import { redirect } from "next/navigation";
import { LayoutGrid, ListFilter } from "lucide-react";
import { TaskKanban } from "@/components/tasks/TaskKanban";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { filterMarketingDataForUser } from "@/lib/auth/access";
import { getCurrentUser } from "@/lib/auth/session";
import { getTasksData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const data = await getTasksData();
  const scopedData = filterMarketingDataForUser(
    {
      tasks: data.tasks,
      contentPosts: [],
      approvalItems: [],
      campaignEvents: [],
      leads: [],
      adsReports: [],
      source: data.source,
      errors: data.errors
    },
    currentUser
  );

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        eyebrow="Workflow"
        title="Task"
        description="Kanban chỉ hiển thị các việc thuộc phạm vi quyền và phòng ban của tài khoản hiện tại."
        actions={
          <>
            <Button variant="secondary"><ListFilter size={17} /> Lọc task</Button>
            <Button variant="primary"><LayoutGrid size={17} /> Tạo task</Button>
          </>
        }
      />
      <TaskKanban tasks={scopedData.tasks} />
    </div>
  );
}
