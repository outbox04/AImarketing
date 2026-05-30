import { ArrowRight, CalendarClock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ownerName } from "@/lib/constants";
import { getRiskFlags, getWorkloadSummary } from "@/lib/rules/marketing-rules";
import type { AdsReport } from "@/types/ads";
import type { ApprovalItem, ContentPost } from "@/types/content";
import type { Lead } from "@/types/crm";
import type { CampaignEvent } from "@/types/event";
import type { Task } from "@/types/task";

type MorningDigestProps = {
  tasks: Task[];
  contentPosts: ContentPost[];
  approvalItems: ApprovalItem[];
  campaignEvents: CampaignEvent[];
  leads: Lead[];
  adsReports: AdsReport[];
};

function getGreeting() {
  const hour = Number(new Intl.DateTimeFormat("vi-VN", { hour: "numeric", hour12: false, timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()));
  if (hour < 11) return { label: "buổi sáng", badge: "Morning Digest" };
  if (hour < 18) return { label: "buổi chiều", badge: "Afternoon Digest" };
  return { label: "buổi tối", badge: "Evening Digest" };
}

function splitRiskFlag(value: string) {
  const [title, ...rest] = value.split(":");
  return { title: title.trim(), note: rest.join(":").trim() };
}

export function MorningDigest({ tasks, contentPosts, approvalItems, campaignEvents, leads, adsReports }: MorningDigestProps) {
  const summary = getWorkloadSummary(tasks, approvalItems, campaignEvents, leads, adsReports, contentPosts);
  const riskFlags = getRiskFlags(tasks, approvalItems, campaignEvents, adsReports).slice(0, 3);
  const greeting = getGreeting();

  return (
    <section className="overflow-hidden rounded-[28px] border border-indigo-100 bg-gradient-to-br from-white via-[#F8FAFF] to-[#EEF2FF] p-6 shadow-soft md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-sm font-semibold text-primary">
            <CalendarClock size={16} />
            {greeting.badge}
          </div>
          <h1 className="text-3xl font-bold tracking-normal text-text-main md:text-4xl">Chào {greeting.label}, {ownerName}.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
            Hôm nay có <strong className="text-text-main">{summary.todayTasks} việc cần xử lý</strong>,{" "}
            <strong className="text-text-main">{summary.pendingContent} nội dung cần duyệt</strong>,{" "}
            <strong className="text-danger">{summary.overdueTasks} deadline trễ</strong>,{" "}
            <strong className="text-text-main">{summary.scheduledContent} bài theo lịch đăng</strong> và{" "}
            <strong className="text-text-main">{summary.runningEvents} campaign đang chạy</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/content/approval">
              <Button variant="primary">
                Duyệt nội dung <ArrowRight size={17} />
              </Button>
            </Link>
            <Link href="#today-timeline">
              <Button variant="secondary">Xem timeline hôm nay</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-card">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-text-soft">Việc cần chú ý</div>
          {riskFlags.length > 0 ? (
            riskFlags.map((item) => {
              const risk = splitRiskFlag(item);
              return (
                <div key={item} className="flex items-start gap-3 border-b border-border py-3 last:border-0">
                  <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-main">{risk.title}</p>
                    <p className="mt-1 text-sm text-text-muted">{risk.note || "Cần kiểm tra tiến độ trong Google Sheet."}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-2xl bg-surface-soft p-3 text-sm font-semibold text-text-muted">Chưa có cảnh báo cần xử lý.</p>
          )}
        </div>
      </div>
    </section>
  );
}
