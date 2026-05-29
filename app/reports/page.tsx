import { FileDown, Send, WandSparkles } from "lucide-react";
import { ChartBlock } from "@/components/reports/ChartBlock";
import { ReportCard } from "@/components/reports/ReportCard";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { reportMetrics } from "@/lib/mock-data";

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Leadership Reporting"
        title="Reports"
        description="Báo cáo ngày, tuần, tháng, quý cho lãnh đạo: task, content, ads, lead, event, website."
        actions={
          <>
            <Button variant="secondary"><FileDown size={17} /> Xuất PDF</Button>
            <Button variant="secondary"><Send size={17} /> Gửi Telegram</Button>
            <Button variant="primary"><WandSparkles size={17} /> Tạo báo cáo AI</Button>
          </>
        }
      />
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportMetrics.map((metric) => <ReportCard key={metric.id} metric={metric} />)}
      </div>
      <ChartBlock />
    </div>
  );
}
