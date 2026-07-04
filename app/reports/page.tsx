import { redirect } from "next/navigation";
import { FileDown, Send, WandSparkles } from "lucide-react";
import { ChartBlock } from "@/components/reports/ChartBlock";
import { ReportCard } from "@/components/reports/ReportCard";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { filterMarketingDataForUser } from "@/lib/auth/access";
import { getCurrentUser } from "@/lib/auth/session";
import { getMarketingData } from "@/lib/data/marketing-data";
import { getWorkloadSummary } from "@/lib/rules/marketing-rules";
import type { ReportMetric } from "@/types/report";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const data = filterMarketingDataForUser(await getMarketingData(), currentUser);
  const summary = getWorkloadSummary(data.tasks, data.approvalItems, data.campaignEvents, data.leads, data.adsReports, data.contentPosts);
  const reportMetrics: ReportMetric[] = [
    { id: "r-1", label: "Task hoàn thành", value: String(summary.doneTasks), change: `${data.tasks.length} task tổng`, tone: "success" },
    { id: "r-2", label: "Content đã đăng", value: String(summary.postedContent), change: `${summary.pendingContent} bài chờ duyệt`, tone: "info" },
    { id: "r-3", label: "Lead mới", value: String(summary.newLeads), change: "Từ dữ liệu CRM", tone: "success" },
    { id: "r-4", label: "Deadline trễ", value: String(summary.overdueTasks), change: "Rule-based", tone: "danger" }
  ];
  const chartData = [
    { name: "Tasks", leads: summary.todayTasks, content: summary.doneTasks },
    { name: "Content", leads: summary.newLeads, content: summary.pendingContent },
    { name: "Ads", leads: summary.newLeads, content: summary.postedContent }
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Leadership Reporting"
        title="Reports"
        description="Báo cáo ngày, tuần, tháng, quý theo phạm vi dữ liệu của tài khoản hiện tại."
        actions={
          <>
            <Button variant="secondary">
              <FileDown size={17} /> Xuất PDF
            </Button>
            <Button variant="secondary" disabled title="Telegram cần worker server-side riêng">
              <Send size={17} /> Gửi Telegram
            </Button>
            <Button variant="primary">
              <WandSparkles size={17} /> Tạo nhận xét AI
            </Button>
          </>
        }
      />
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportMetrics.map((metric) => (
          <ReportCard key={metric.id} metric={metric} />
        ))}
      </div>
      <ChartBlock chartData={chartData} />
    </div>
  );
}
