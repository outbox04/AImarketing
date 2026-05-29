import { AlertTriangle, CheckSquare, Clock, Megaphone, RadioTower, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const kpis = [
  { label: "Task hôm nay", value: "14", change: "+4 mới", icon: CheckSquare, tone: "text-primary bg-primary-soft" },
  { label: "Chờ duyệt", value: "6", change: "3 khẩn", icon: Clock, tone: "text-warning bg-warning-soft" },
  { label: "Deadline trễ", value: "3", change: "Cần xử lý", icon: AlertTriangle, tone: "text-danger bg-danger-soft" },
  { label: "Bài sắp đăng", value: "9", change: "24h tới", icon: Megaphone, tone: "text-info bg-info-soft" },
  { label: "Lead mới", value: "28", change: "+18%", icon: Users, tone: "text-success bg-success-soft" },
  { label: "Campaign chạy", value: "4", change: "1 rủi ro", icon: RadioTower, tone: "text-primary bg-primary-soft" }
];

export function KpiCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text-muted">{kpi.label}</p>
                <p className="mt-2 text-3xl font-bold text-text-main">{kpi.value}</p>
              </div>
              <div className={`grid h-10 w-10 place-items-center rounded-2xl ${kpi.tone}`}>
                <Icon size={19} />
              </div>
            </div>
            <Badge className="mt-4 border-border bg-surface-soft text-text-muted">{kpi.change}</Badge>
          </Card>
        );
      })}
    </div>
  );
}
