import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { permissionLabel } from "@/lib/auth/access";
import { getDoneTasks, getOverdueTasks, getPendingApproval } from "@/lib/rules/marketing-rules";
import type { MarketingData } from "@/lib/data/marketing-data";
import type { EmployeeProfile } from "@/types/employee";

export function StaffDashboard({ data, user }: { data: MarketingData; user: EmployeeProfile }) {
  const doneTasks = getDoneTasks(data.tasks).length;
  const overdueTasks = getOverdueTasks(data.tasks).length;
  const pendingContent = getPendingApproval(data.contentPosts).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <h2 className="text-lg font-bold text-text-main">Pham vi cong viec cua toi</h2>
        <p className="mt-1 text-sm text-text-muted">Dashboard chi hien thi du lieu va module tuong ung voi quyen duoc gan.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {user.permissions.map((permission) => (
            <Badge key={permission} className="border-primary-soft bg-primary-soft text-primary">
              {permissionLabel(permission)}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm font-semibold text-text-muted">Viec duoc giao</p>
          <p className="mt-2 text-3xl font-bold text-text-main">{data.tasks.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-text-muted">Da hoan thanh</p>
          <p className="mt-2 text-3xl font-bold text-success">{doneTasks}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-text-muted">Can chu y</p>
          <p className="mt-2 text-3xl font-bold text-warning">{overdueTasks + pendingContent}</p>
        </Card>
      </div>
    </div>
  );
}
