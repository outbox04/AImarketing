import { AlertTriangle, CheckSquare, Clock, Megaphone, RadioTower, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getKpiSummary } from "@/lib/rules/marketing-rules";
import type { AdsReport } from "@/types/ads";
import type { ApprovalItem, ContentPost } from "@/types/content";
import type { Lead } from "@/types/crm";
import type { CampaignEvent } from "@/types/event";
import type { Task } from "@/types/task";

const iconByLabel = {
  "Task hôm nay": CheckSquare,
  "Chờ duyệt": Clock,
  "Deadline trễ": AlertTriangle,
  "Bài sắp đăng": Megaphone,
  "Lead mới": Users,
  "Campaign chạy": RadioTower
};

const toneClass = {
  primary: "text-primary bg-primary-soft",
  warning: "text-warning bg-warning-soft",
  danger: "text-danger bg-danger-soft",
  info: "text-info bg-info-soft",
  success: "text-success bg-success-soft"
};

type KpiCardsProps = {
  tasks: Task[];
  contentPosts: ContentPost[];
  approvalItems: ApprovalItem[];
  campaignEvents: CampaignEvent[];
  leads: Lead[];
  adsReports: AdsReport[];
};

export function KpiCards({ tasks, contentPosts, approvalItems, campaignEvents, leads, adsReports }: KpiCardsProps) {
  const kpis = getKpiSummary(tasks, approvalItems, campaignEvents, leads, adsReports, contentPosts);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = iconByLabel[kpi.label as keyof typeof iconByLabel];
        return (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text-muted">{kpi.label}</p>
                <p className="mt-2 text-3xl font-bold text-text-main">{kpi.value}</p>
              </div>
              <div className={`grid h-10 w-10 place-items-center rounded-2xl ${toneClass[kpi.tone as keyof typeof toneClass]}`}>
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
