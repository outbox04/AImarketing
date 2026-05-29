import { readFirstAvailableSheet } from "@/lib/google-sheet";
import { adsReports as mockAdsReports, approvalItems as mockApprovalItems, campaignEvents as mockCampaignEvents, contentPosts as mockContentPosts, leads as mockLeads, tasks as mockTasks } from "@/lib/mock-data";
import type { AdsReport } from "@/types/ads";
import type { ApprovalItem, ApprovalStatus, Channel, ContentPost, ContentType } from "@/types/content";
import type { Lead, LeadStatus } from "@/types/crm";
import type { CampaignEvent } from "@/types/event";
import type { Priority, Task, TaskStatus } from "@/types/task";

type MarketingData = {
  tasks: Task[];
  contentPosts: ContentPost[];
  approvalItems: ApprovalItem[];
  campaignEvents: CampaignEvent[];
  leads: Lead[];
  adsReports: AdsReport[];
  source: "google-sheet" | "mock";
  errors: string[];
};

const taskStatuses: TaskStatus[] = ["INBOX", "TODO", "IN_PROGRESS", "WAITING", "DONE"];
const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const approvalStatuses: ApprovalStatus[] = ["DRAFT", "PENDING", "REVISION", "APPROVED", "REJECTED", "SCHEDULED"];
const contentTypes: ContentType[] = ["CONTENT", "IMAGE", "VIDEO", "WEBSITE"];
const channels: Channel[] = ["Facebook", "Website", "Video", "Event", "Ads", "Group sharing"];
const leadStatuses = Array.from(new Set(mockLeads.map((lead) => lead.status))) as LeadStatus[];

function pick(row: Record<string, string>, keys: string[], fallback = "") {
  for (const key of keys) {
    const normalized = key.toLowerCase().replace(/\s+/g, "_");
    if (row[normalized]) {
      return row[normalized];
    }
  }
  return fallback;
}

function asEnum<T extends string>(value: string, allowed: readonly T[], fallback: T) {
  const found = allowed.find((item) => item.toLowerCase() === value.toLowerCase());
  return found ?? fallback;
}

function asNumber(value: string, fallback = 0) {
  const normalized = value.replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asList(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapTasks(rows: Record<string, string>[]): Task[] {
  return rows.map((row, index) => ({
    id: pick(row, ["id"], `task-${index + 1}`),
    title: pick(row, ["title", "task", "name", "ten_task"], "Untitled task"),
    type: asEnum(pick(row, ["type", "loai"], "Content"), ["Content", "Design", "Video", "Website", "Event", "Ads", "CRM", "Report"], "Content"),
    deadline: pick(row, ["deadline", "due", "han", "han_chot"], ""),
    priority: asEnum(pick(row, ["priority", "muc_do"], "MEDIUM"), priorities, "MEDIUM"),
    status: asEnum(pick(row, ["status", "trang_thai"], "TODO"), taskStatuses, "TODO"),
    fileUrl: pick(row, ["fileUrl", "file_url", "drive", "drive_url"], undefined as unknown as string),
    blocker: pick(row, ["blocker", "blocked_by", "can_tro"], undefined as unknown as string)
  }));
}

function mapContentPosts(rows: Record<string, string>[]): ContentPost[] {
  return rows.map((row, index) => ({
    id: pick(row, ["id"], `post-${index + 1}`),
    title: pick(row, ["title", "name", "tieu_de"], "Untitled content"),
    channel: asEnum(pick(row, ["channel", "kenh"], "Facebook"), channels, "Facebook"),
    type: asEnum(pick(row, ["type", "loai"], "CONTENT"), contentTypes, "CONTENT"),
    scheduledAt: pick(row, ["scheduledAt", "scheduled_at", "schedule", "lich_dang"], ""),
    status: asEnum(pick(row, ["status", "trang_thai"], "DRAFT"), approvalStatuses, "DRAFT"),
    campaign: pick(row, ["campaign", "chien_dich"], "")
  }));
}

function mapApprovalItems(rows: Record<string, string>[], contentFallback: ContentPost[]): ApprovalItem[] {
  return rows.map((row, index) => {
    const content = contentFallback[index];
    return {
      id: pick(row, ["id"], content?.id ?? `approval-${index + 1}`),
      title: pick(row, ["title", "name", "tieu_de"], content?.title ?? "Untitled approval"),
      channel: asEnum(pick(row, ["channel", "kenh"], content?.channel ?? "Facebook"), channels, "Facebook"),
      type: asEnum(pick(row, ["type", "loai"], content?.type ?? "CONTENT"), contentTypes, "CONTENT"),
      scheduledAt: pick(row, ["scheduledAt", "scheduled_at", "schedule", "lich_dang"], content?.scheduledAt ?? ""),
      status: asEnum(pick(row, ["status", "trang_thai"], content?.status ?? "PENDING"), approvalStatuses, "PENDING"),
      campaign: pick(row, ["campaign", "chien_dich"], content?.campaign ?? ""),
      caption: pick(row, ["caption", "copy", "noi_dung"], ""),
      hashtags: asList(pick(row, ["hashtags", "hashtag"], "")),
      cta: pick(row, ["cta"], undefined as unknown as string),
      mediaSrc: pick(row, ["mediaSrc", "media_src", "image", "image_url"], undefined as unknown as string),
      driveUrl: pick(row, ["driveUrl", "drive_url", "drive"], "/api/drive"),
      aiScore: asNumber(pick(row, ["aiScore", "ai_score"], "0")),
      aiRiskNote: pick(row, ["aiRiskNote", "ai_risk_note"], ""),
      priority: asEnum(pick(row, ["priority", "muc_do"], "MEDIUM"), priorities, "MEDIUM"),
      warnings: asList(pick(row, ["warnings", "warning", "canh_bao"], ""))
    };
  });
}

function mapEvents(rows: Record<string, string>[]): CampaignEvent[] {
  return rows.map((row, index) => ({
    id: pick(row, ["id"], `event-${index + 1}`),
    name: pick(row, ["name", "title", "campaign", "event"], "Untitled event"),
    goal: pick(row, ["goal", "muc_tieu"], ""),
    progress: asNumber(pick(row, ["progress", "tien_do"], "0")),
    missingChecklist: asList(pick(row, ["missingChecklist", "missing_checklist", "checklist"], "")),
    risk: pick(row, ["risk", "rui_ro"], ""),
    approvalStatus: asEnum(pick(row, ["approvalStatus", "approval_status", "duyet"], "Draft"), ["Draft", "Waiting leadership", "Approved", "At risk"], "Draft"),
    budget: asNumber(pick(row, ["budget", "ngan_sach"], "0")),
    timeline: pick(row, ["timeline", "thoi_gian"], "")
  }));
}

function mapLeads(rows: Record<string, string>[]): Lead[] {
  return rows.map((row, index) => ({
    id: pick(row, ["id"], `lead-${index + 1}`),
    name: pick(row, ["name", "customer", "khach_hang"], "Unknown lead"),
    phone: pick(row, ["phone", "sdt"], ""),
    email: pick(row, ["email"], ""),
    source: pick(row, ["source", "nguon"], ""),
    need: pick(row, ["need", "nhu_cau"], ""),
    status: asEnum(pick(row, ["status", "trang_thai"], leadStatuses[0]), leadStatuses, leadStatuses[0]),
    followDate: pick(row, ["followDate", "follow_date", "follow"], ""),
    note: pick(row, ["note", "ghi_chu"], "")
  }));
}

function mapAds(rows: Record<string, string>[]): AdsReport[] {
  return rows.map((row, index) => ({
    id: pick(row, ["id"], `ads-${index + 1}`),
    campaignName: pick(row, ["campaignName", "campaign_name", "campaign"], "Untitled campaign"),
    platform: asEnum(pick(row, ["platform", "nen_tang"], "Facebook"), ["Facebook", "Google", "TikTok", "LinkedIn"], "Facebook"),
    budget: asNumber(pick(row, ["budget", "ngan_sach"], "0")),
    spend: asNumber(pick(row, ["spend", "chi_phi"], "0")),
    leads: asNumber(pick(row, ["leads", "lead"], "0")),
    cpl: asNumber(pick(row, ["cpl"], "0")),
    ctr: pick(row, ["ctr"], "0%"),
    status: asEnum(pick(row, ["status", "trang_thai"], "Running"), ["Running", "Paused", "Learning", "Completed"], "Running"),
    reportLink: pick(row, ["reportLink", "report_link", "link"], "/api/reports")
  }));
}

async function readDataset<T>(spreadsheetId: string | undefined, ranges: string[], mapper: (rows: Record<string, string>[]) => T[], fallback: T[], errors: string[]) {
  const result = await readFirstAvailableSheet(spreadsheetId, ranges);
  if (!result.ok || result.rows.length === 0) {
    if (result.message) {
      errors.push(result.message);
    }
    return fallback;
  }

  return mapper(result.rows);
}

export async function getTasksData() {
  const errors: string[] = [];
  const tasks = await readDataset(
    process.env.GOOGLE_SHEET_ID_MAIN,
    [process.env.GOOGLE_SHEET_RANGE_TASKS ?? "Tasks!A:Z", "Task!A:Z", "tasks!A:Z"],
    mapTasks,
    mockTasks,
    errors
  );

  return { tasks, source: tasks === mockTasks ? "mock" as const : "google-sheet" as const, errors };
}

export async function getContentData() {
  const errors: string[] = [];
  const contentPosts = await readDataset(
    process.env.GOOGLE_SHEET_ID_CONTENT,
    [process.env.GOOGLE_SHEET_RANGE_CONTENT ?? "Content!A:Z", "Posts!A:Z", "content!A:Z"],
    mapContentPosts,
    mockContentPosts,
    errors
  );

  return { contentPosts, source: contentPosts === mockContentPosts ? "mock" as const : "google-sheet" as const, errors };
}

export async function getApprovalData() {
  const errors: string[] = [];
  const contentPosts = await readDataset(
    process.env.GOOGLE_SHEET_ID_CONTENT,
    [process.env.GOOGLE_SHEET_RANGE_CONTENT ?? "Content!A:Z", "Posts!A:Z", "content!A:Z"],
    mapContentPosts,
    mockContentPosts,
    errors
  );
  const approvalItems = await readDataset(
    process.env.GOOGLE_SHEET_ID_CONTENT,
    [process.env.GOOGLE_SHEET_RANGE_APPROVAL ?? "Approval!A:Z", "Approvals!A:Z", "approval!A:Z"],
    (rows) => mapApprovalItems(rows, contentPosts),
    mockApprovalItems,
    errors
  );

  return { approvalItems, source: approvalItems === mockApprovalItems ? "mock" as const : "google-sheet" as const, errors };
}

export async function getEventData() {
  const errors: string[] = [];
  const campaignEvents = await readDataset(
    process.env.GOOGLE_SHEET_ID_EVENT,
    [process.env.GOOGLE_SHEET_RANGE_EVENTS ?? "Events!A:Z", "Campaigns!A:Z", "Event!A:Z"],
    mapEvents,
    mockCampaignEvents,
    errors
  );

  return { campaignEvents, source: campaignEvents === mockCampaignEvents ? "mock" as const : "google-sheet" as const, errors };
}

export async function getLeadData() {
  const errors: string[] = [];
  const leads = await readDataset(
    process.env.GOOGLE_SHEET_ID_MAIN,
    [process.env.GOOGLE_SHEET_RANGE_LEADS ?? "Leads!A:Z", "CRM!A:Z", "leads!A:Z"],
    mapLeads,
    mockLeads,
    errors
  );

  return { leads, source: leads === mockLeads ? "mock" as const : "google-sheet" as const, errors };
}

export async function getAdsData() {
  const errors: string[] = [];
  const adsReports = await readDataset(
    process.env.GOOGLE_SHEET_ID_MAIN,
    [process.env.GOOGLE_SHEET_RANGE_ADS ?? "Ads!A:Z", "AdsReports!A:Z", "ads!A:Z"],
    mapAds,
    mockAdsReports,
    errors
  );

  return { adsReports, source: adsReports === mockAdsReports ? "mock" as const : "google-sheet" as const, errors };
}

export async function getMarketingData(): Promise<MarketingData> {
  const [tasksData, contentData, approvalData, eventData, leadData, adsData] = await Promise.all([
    getTasksData(),
    getContentData(),
    getApprovalData(),
    getEventData(),
    getLeadData(),
    getAdsData()
  ]);
  const { tasks } = tasksData;
  const { contentPosts } = contentData;
  const { approvalItems } = approvalData;
  const { campaignEvents } = eventData;
  const { leads } = leadData;
  const { adsReports } = adsData;
  const errors = [...tasksData.errors, ...contentData.errors, ...approvalData.errors, ...eventData.errors, ...leadData.errors, ...adsData.errors];

  const allMock =
    tasks === mockTasks &&
    contentPosts === mockContentPosts &&
    approvalItems === mockApprovalItems &&
    campaignEvents === mockCampaignEvents &&
    leads === mockLeads &&
    adsReports === mockAdsReports;

  return {
    tasks,
    contentPosts,
    approvalItems,
    campaignEvents,
    leads,
    adsReports,
    source: allMock ? "mock" : "google-sheet",
    errors
  };
}
