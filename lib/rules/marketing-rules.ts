import type { AdsReport } from "@/types/ads";
import type { ApprovalItem, ContentPost, ContentType } from "@/types/content";
import type { Lead } from "@/types/crm";
import type { CampaignEvent } from "@/types/event";
import type { Task, TaskStatus } from "@/types/task";

const incompleteStatuses: TaskStatus[] = ["INBOX", "TODO", "IN_PROGRESS", "WAITING"];

function normalizeVietnameseDate(value: string) {
  return value.toLowerCase();
}

export function isToday(value: string) {
  const normalized = normalizeVietnameseDate(value);
  return normalized.includes("hom nay") || normalized.includes("hôm nay") || normalized.includes("hă´m nay");
}

export function isTomorrow(value: string) {
  const normalized = normalizeVietnameseDate(value);
  return normalized.includes("ngay mai") || normalized.includes("ngày mai") || normalized.includes("ngă y mai");
}

export function isPastDeadline(task: Task) {
  return task.priority === "URGENT" && task.status !== "DONE" && !isToday(task.deadline) && !isTomorrow(task.deadline);
}

export function getTodayTasks(tasks: Task[]) {
  return tasks.filter((task) => isToday(task.deadline) && task.status !== "DONE");
}

export function getOverdueTasks(tasks: Task[]) {
  return tasks.filter(isPastDeadline);
}

export function getInProgressTasks(tasks: Task[]) {
  return tasks.filter((task) => task.status === "IN_PROGRESS");
}

export function getDoneTasks(tasks: Task[]) {
  return tasks.filter((task) => task.status === "DONE");
}

export function getPendingApproval<T extends ContentPost | ApprovalItem>(contents: T[]) {
  return contents.filter((item) => item.status === "PENDING" || item.status === "REVISION");
}

export function getPendingByType<T extends ContentPost | ApprovalItem>(contents: T[], type: ContentType) {
  return getPendingApproval(contents).filter((item) => item.type === type);
}

export function getScheduledSoon<T extends ContentPost | ApprovalItem>(contents: T[]) {
  return contents.filter((item) => item.status === "SCHEDULED" || item.status === "APPROVED");
}

export function getRunningEvents(events: CampaignEvent[]) {
  return events.filter((event) => event.approvalStatus !== "Draft" && event.progress < 100);
}

export function getRiskFlags(tasks: Task[], contents: ApprovalItem[], events: CampaignEvent[], adsReports: AdsReport[]) {
  const flags: string[] = [];
  const blockedTasks = tasks.filter((task) => Boolean(task.blocker) && incompleteStatuses.includes(task.status));
  const missingContent = contents.filter((item) => item.warnings.length > 0);
  const riskyEvents = events.filter((event) => event.approvalStatus === "At risk" || event.missingChecklist.length > 0);
  const costlyAds = adsReports.filter((report) => report.status === "Learning" || report.cpl > 180000);

  blockedTasks.forEach((task) => flags.push(`${task.title}: ${task.blocker}`));
  missingContent.forEach((item) => flags.push(`${item.title}: ${item.warnings.join(", ")}`));
  riskyEvents.forEach((event) => flags.push(`${event.name}: ${event.risk}`));
  costlyAds.forEach((report) => flags.push(`${report.campaignName}: CPL ${report.cpl.toLocaleString("vi-VN")} VND`));

  return flags;
}

export function getWorkloadSummary(tasks: Task[], contents: ApprovalItem[], events: CampaignEvent[], leads: Lead[], adsReports: AdsReport[]) {
  const pendingContent = getPendingApproval(contents);
  const overdueTasks = getOverdueTasks(tasks);

  return {
    todayTasks: getTodayTasks(tasks).length,
    overdueTasks: overdueTasks.length,
    inProgressTasks: getInProgressTasks(tasks).length,
    doneTasks: getDoneTasks(tasks).length,
    pendingContent: pendingContent.length,
    pendingImages: getPendingByType(contents, "IMAGE").length,
    pendingWebsite: getPendingByType(contents, "WEBSITE").length,
    pendingVideos: getPendingByType(contents, "VIDEO").length,
    runningEvents: getRunningEvents(events).length,
    newLeads: leads.filter((lead) => lead.status.toLowerCase().includes("lead")).length,
    adsSpend: adsReports.reduce((sum, report) => sum + report.spend, 0),
    postedContent: contents.filter((item) => item.status === "APPROVED" || item.status === "SCHEDULED").length,
    riskFlags: getRiskFlags(tasks, contents, events, adsReports)
  };
}

export function getKpiSummary(tasks: Task[], contents: ApprovalItem[], events: CampaignEvent[], leads: Lead[], adsReports: AdsReport[]) {
  const summary = getWorkloadSummary(tasks, contents, events, leads, adsReports);

  return [
    { label: "Task hôm nay", value: summary.todayTasks, change: `${getInProgressTasks(tasks).length} đang làm`, tone: "primary" },
    { label: "Chờ duyệt", value: summary.pendingContent, change: `${summary.pendingImages + summary.pendingWebsite} cần kiểm tra`, tone: "warning" },
    { label: "Deadline trễ", value: summary.overdueTasks, change: summary.overdueTasks > 0 ? "Cần xử lý" : "Không có", tone: "danger" },
    { label: "Bài sắp đăng", value: getScheduledSoon(contents).length, change: "Theo lịch content", tone: "info" },
    { label: "Lead mới", value: summary.newLeads, change: "Từ CRM", tone: "success" },
    { label: "Campaign chạy", value: summary.runningEvents, change: `${summary.riskFlags.length} cảnh báo`, tone: "primary" }
  ];
}

export function buildMorningDigest(summary: ReturnType<typeof getWorkloadSummary>, approvalUrl: string) {
  return [
    "🌅 DUYỆT MARKETING BUỔI SÁNG",
    "",
    "Hôm nay có:",
    `- ${summary.todayTasks} việc cần làm`,
    `- ${summary.pendingContent} content cần duyệt`,
    `- ${summary.pendingImages} hình ảnh cần duyệt`,
    `- ${summary.pendingWebsite} bài website cần duyệt`,
    `- ${summary.overdueTasks} việc quá hạn`,
    "",
    "Mở trung tâm duyệt:",
    approvalUrl
  ].join("\n");
}

export function buildBasicDailyReport(summary: ReturnType<typeof getWorkloadSummary>, totalTasks: number, dashboardUrl: string) {
  return [
    "BÁO CÁO MARKETING CUỐI NGÀY",
    "",
    `Hoàn thành: ${summary.doneTasks}/${totalTasks}`,
    `Quá hạn: ${summary.overdueTasks}`,
    `Bài đã đăng: ${summary.postedContent}`,
    `Content chờ duyệt: ${summary.pendingContent}`,
    `Lead mới: ${summary.newLeads}`,
    `Chi phí Ads: ${summary.adsSpend.toLocaleString("vi-VN")} VND`,
    "",
    "Chi tiết xem dashboard:",
    dashboardUrl
  ].join("\n");
}

export function mapTaskStatus(status: TaskStatus) {
  const labels: Record<TaskStatus, string> = {
    INBOX: "Mới",
    TODO: "Cần làm",
    IN_PROGRESS: "Đang làm",
    WAITING: "Đang chờ",
    DONE: "Hoàn thành"
  };

  return labels[status];
}
