import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ReportMetric } from "@/types/report";

const toneClass = {
  success: "bg-success-soft text-green-700 border-green-200",
  warning: "bg-warning-soft text-amber-700 border-amber-200",
  danger: "bg-danger-soft text-red-700 border-red-200",
  info: "bg-info-soft text-sky-700 border-sky-200"
};

export function ReportCard({ metric }: { metric: ReportMetric }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-semibold text-text-muted">{metric.label}</p>
      <p className="mt-2 text-3xl font-bold text-text-main">{metric.value}</p>
      <Badge className={`mt-4 ${toneClass[metric.tone]}`}>{metric.change}</Badge>
    </Card>
  );
}
