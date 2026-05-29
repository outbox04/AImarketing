import { ArrowRight, CalendarClock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ownerName } from "@/lib/constants";
import { getRiskFlags, getWorkloadSummary } from "@/lib/rules/marketing-rules";
import type { AdsReport } from "@/types/ads";
import type { ApprovalItem } from "@/types/content";
import type { Lead } from "@/types/crm";
import type { CampaignEvent } from "@/types/event";
import type { Task } from "@/types/task";

type MorningDigestProps = {
  tasks: Task[];
  approvalItems: ApprovalItem[];
  campaignEvents: CampaignEvent[];
  leads: Lead[];
  adsReports: AdsReport[];
};

export function MorningDigest({ tasks, approvalItems, campaignEvents, leads, adsReports }: MorningDigestProps) {
  const summary = getWorkloadSummary(tasks, approvalItems, campaignEvents, leads, adsReports);
  const riskFlags = getRiskFlags(tasks, approvalItems, campaignEvents, adsReports).slice(0, 3);

  return (
    <section className="overflow-hidden rounded-[28px] border border-indigo-100 bg-gradient-to-br from-white via-[#F8FAFF] to-[#EEF2FF] p-6 shadow-soft md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-sm font-semibold text-primary">
            <CalendarClock size={16} />
            Morning Digest
          </div>
          <h1 className="text-3xl font-bold tracking-normal text-text-main md:text-4xl">Chào buổi sáng, {ownerName}.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
            Hôm nay có <strong className="text-text-main">{summary.todayTasks} việc cần xử lý</strong>,{" "}
            <strong className="text-text-main">{summary.pendingContent} nội dung cần duyệt</strong>,{" "}
            <strong className="text-danger">{summary.overdueTasks} deadline trễ</strong> và{" "}
            <strong className="text-text-main">{summary.runningEvents} event đang chạy</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary">
              Duyệt nội dung <ArrowRight size={17} />
            </Button>
            <Button variant="secondary">Xem timeline hôm nay</Button>
          </div>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-card">
          {riskFlags.map((item) => (
            <div key={item} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary-soft text-primary">
                <CheckCircle2 size={18} />
              </div>
              <p className="text-sm font-semibold text-text-main">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
