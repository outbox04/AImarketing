import { readFirstAvailableSheet, readPublicCsvSheet } from "@/lib/google-sheet";
import { publicMarketingSheets } from "@/lib/google-sheet-config";
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
    const normalized = key
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    if (row[normalized]) {
      return row[normalized];
    }
  }
  return fallback;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function joinDateTime(date: string, time: string) {
  return [date, time].filter(Boolean).join(" ").trim();
}

function mapDeadlinePriority(value: string): Priority {
  const normalized = normalizeText(value);
  if (normalized.includes("KHAN_CAP") || normalized.includes("URGENT")) return "URGENT";
  if (normalized.includes("CAO") || normalized.includes("HIGH")) return "HIGH";
  if (normalized.includes("THAP") || normalized.includes("LOW")) return "LOW";
  return "MEDIUM";
}

function mapDeadlineStatus(value: string): TaskStatus {
  const normalized = normalizeText(value);
  if (normalized.includes("HOAN_THANH") || normalized.includes("DA_XONG") || normalized.includes("DONE")) return "DONE";
  if (normalized.includes("DANG_LAM") || normalized.includes("IN_PROGRESS")) return "IN_PROGRESS";
  if (normalized.includes("DANG_CHO") || normalized.includes("WAIT")) return "WAITING";
  if (normalized.includes("MOI") || normalized.includes("INBOX")) return "INBOX";
  return "TODO";
}

function mapTaskType(value: string): Task["type"] {
  const normalized = normalizeText(value);
  if (normalized.includes("VIDEO")) return "Video";
  if (normalized.includes("EVENT")) return "Event";
  if (normalized.includes("QUANG_CAO") || normalized.includes("ADS")) return "Ads";
  if (normalized.includes("CRM")) return "CRM";
  if (normalized.includes("SEO") || normalized.includes("WEBSITE")) return "Website";
  if (normalized.includes("DESIGN") || normalized.includes("THIET_KE")) return "Design";
  return "Content";
}

function mapChannel(value: string): Channel {
  const normalized = normalizeText(value);
  if (normalized.includes("WEBSITE")) return "Website";
  if (normalized.includes("VIDEO") || normalized.includes("TIKTOK") || normalized.includes("REELS")) return "Video";
  if (normalized.includes("EVENT")) return "Event";
  if (normalized.includes("ADS")) return "Ads";
  return "Facebook";
}

function mapApprovalStatus(value: string): ApprovalStatus {
  const normalized = normalizeText(value);
  if (normalized.includes("DA_DANG") || normalized.includes("DA_LEN_LICH") || normalized.includes("SCHEDULED")) return "SCHEDULED";
  if (normalized.includes("CHO_LEN_LICH") || normalized.includes("CHUA_LEN_LICH")) return "PENDING";
  if (normalized.includes("DUYET") || normalized.includes("APPROVED")) return "APPROVED";
  if (normalized.includes("TU_CHOI") || normalized.includes("REJECT")) return "REJECTED";
  return "DRAFT";
}

function mapAdsStatus(value: string): AdsReport["status"] {
  const normalized = normalizeText(value);
  if (normalized.includes("DANG_CHAY") || normalized.includes("RUNNING")) return "Running";
  if (normalized.includes("TAM_DUNG") || normalized.includes("PAUSED")) return "Paused";
  if (normalized.includes("DANG_LEN_KE_HOACH") || normalized.includes("PLAN")) return "Planning";
  if (normalized.includes("HOAN_THANH") || normalized.includes("COMPLETED")) return "Completed";
  if (normalized.includes("LEARNING")) return "Learning";
  return "Running";
}

function mapScheduleRows(rows: Record<string, string>[], kind: "content" | "video" | "event"): ContentPost[] {
  return rows.map((row, index) => {
    const id = pick(row, ["id content", "id video", "id event", "id"], `${kind}-${index + 1}`);
    const mediaName = pick(row, ["noi dung media", "ten", "title"], "");
    const channel = mapChannel(pick(row, ["kenh dang", "channel"], kind === "event" ? "Event" : "Facebook"));
    const type: ContentType = kind === "video" ? "VIDEO" : kind === "event" ? "IMAGE" : "CONTENT";

    return {
      id: kind === "event" ? `${id}-${index + 1}` : id,
      title: mediaName || `${kind === "video" ? "Video" : kind === "event" ? "Event media" : "Content"} ${id}`,
      channel,
      type,
      scheduledAt: joinDateTime(pick(row, ["ngay dang"], ""), pick(row, ["gio dang"], "")),
      status: mapApprovalStatus(pick(row, ["trang thai", "trang thai dang"], "")),
      campaign: kind === "event" ? id : ""
    };
  });
}

function mapScheduleApprovals(posts: ContentPost[]): ApprovalItem[] {
  return posts
    .filter((post) => post.status === "PENDING" || post.status === "DRAFT")
    .map((post) => ({
      ...post,
      caption: "",
      hashtags: [],
      driveUrl: "/api/drive",
      aiScore: 0,
      aiRiskNote: post.status === "PENDING" ? "Đang chờ hoàn tất trước khi đăng." : "Chưa lên lịch đăng.",
      priority: "MEDIUM",
      warnings: post.status === "DRAFT" ? ["Chưa lên lịch"] : []
    }));
}

function mapDeadlineApprovals(tasks: Task[]): ApprovalItem[] {
  return tasks
    .filter((task) => task.status !== "DONE" && (task.title.toLowerCase().includes("duyệt") || task.title.toLowerCase().includes("duyet")))
    .map((task) => ({
      id: `approval-${task.id}`,
      title: task.title,
      channel: task.type === "Video" ? "Video" : task.type === "Website" ? "Website" : "Facebook",
      type: task.type === "Video" ? "VIDEO" : task.type === "Website" ? "WEBSITE" : "CONTENT",
      scheduledAt: task.deadline,
      status: "PENDING",
      campaign: pick({ module_lien_quan: task.type }, ["module lien quan"], task.type),
      caption: "",
      hashtags: [],
      driveUrl: task.fileUrl ?? "/api/drive",
      aiScore: 0,
      aiRiskNote: task.blocker ?? "Deadline duyệt đang mở.",
      priority: task.priority,
      warnings: task.blocker ? [task.blocker] : []
    }));
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
    title: pick(row, ["title", "task", "name", "ten task", "ten deadline"], "Untitled task"),
    type: mapTaskType(pick(row, ["type", "loai", "module lien quan"], "Content")),
    startDate: pick(row, ["start", "start date", "ngay bat dau"], undefined as unknown as string),
    deadline: pick(row, ["deadline", "due", "han", "han chot", "ngay ket thuc"], ""),
    priority: mapDeadlinePriority(pick(row, ["priority", "muc do", "muc do uu tien"], "MEDIUM")),
    status: mapDeadlineStatus(pick(row, ["status", "trang thai"], "TODO")),
    fileUrl: pick(row, ["fileUrl", "file_url", "drive", "drive_url"], undefined as unknown as string),
    blocker: pick(row, ["blocker", "blocked_by", "can_tro", "ghi chu"], undefined as unknown as string)
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
    name: pick(row, ["name", "customer", "khach_hang", "ho ten"], "Unknown lead"),
    phone: pick(row, ["phone", "sdt", "so dien thoai"], ""),
    email: pick(row, ["email"], ""),
    source: pick(row, ["source", "nguon", "nguon lead"], ""),
    need: pick(row, ["need", "nhu_cau", "nhu cau", "san pham quan tam"], ""),
    status: pick(row, ["status", "trang_thai", "trang thai khach hang"], leadStatuses[0]),
    followDate: pick(row, ["followDate", "follow_date", "follow", "ngay follow-up tiep theo"], ""),
    note: pick(row, ["note", "ghi_chu", "ghi chu khach hang"], "")
  }));
}

function mapAds(rows: Record<string, string>[]): AdsReport[] {
  return rows.map((row, index) => ({
    id: pick(row, ["id"], `ads-${index + 1}`),
    campaignName: pick(row, ["campaignName", "campaign_name", "campaign", "ten campaign"], "Untitled campaign"),
    platform: asEnum(pick(row, ["platform", "nen_tang", "nen tang"], "Facebook"), ["Facebook", "Google", "TikTok", "LinkedIn"], "Facebook"),
    budget: asNumber(pick(row, ["budget", "ngan_sach"], "0")),
    spend: asNumber(pick(row, ["spend", "chi_phi"], "0")),
    leads: asNumber(pick(row, ["leads", "lead"], "0")),
    cpl: asNumber(pick(row, ["cpl"], "0")),
    ctr: pick(row, ["ctr"], "0%"),
    status: mapAdsStatus(pick(row, ["status", "trang_thai", "trang thai campaign"], "Running")),
    reportLink: pick(row, ["reportLink", "report_link", "link", "link bao cao"], "/api/reports")
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

async function readPublicDataset<T>(
  spreadsheetId: string | undefined,
  gid: string | undefined,
  mapper: (rows: Record<string, string>[]) => T[],
  errors: string[]
) {
  const result = await readPublicCsvSheet(spreadsheetId, gid);
  if (!result.ok || result.rows.length === 0) {
    if (result.message) errors.push(result.message);
    return null;
  }

  return mapper(result.rows);
}

export async function getTasksData() {
  const errors: string[] = [];
  const publicTasks = await readPublicDataset(
    publicMarketingSheets.deadlines.id,
    publicMarketingSheets.deadlines.gid,
    mapTasks,
    errors
  );
  if (publicTasks) {
    return { tasks: publicTasks, source: "google-sheet" as const, errors };
  }

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
  const [contentSchedule, videoSchedule, eventSchedule] = await Promise.all([
    readPublicDataset(
      publicMarketingSheets.contentSchedule.id,
      publicMarketingSheets.contentSchedule.gid,
      (rows) => mapScheduleRows(rows, "content"),
      errors
    ),
    readPublicDataset(
      publicMarketingSheets.videoSchedule.id,
      publicMarketingSheets.videoSchedule.gid,
      (rows) => mapScheduleRows(rows, "video"),
      errors
    ),
    readPublicDataset(
      publicMarketingSheets.eventSchedule.id,
      publicMarketingSheets.eventSchedule.gid,
      (rows) => mapScheduleRows(rows, "event"),
      errors
    )
  ]);
  const publicPosts = [...(contentSchedule ?? []), ...(videoSchedule ?? []), ...(eventSchedule ?? [])];
  if (publicPosts.length > 0) {
    return { contentPosts: publicPosts, source: "google-sheet" as const, errors };
  }

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
  const [tasksData, contentData] = await Promise.all([getTasksData(), getContentData()]);
  if (tasksData.source === "google-sheet" || contentData.source === "google-sheet") {
    const approvalItems = [...mapDeadlineApprovals(tasksData.tasks), ...mapScheduleApprovals(contentData.contentPosts)];
    return { approvalItems, source: "google-sheet" as const, errors: [...errors, ...tasksData.errors, ...contentData.errors] };
  }

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
  const eventPosts = await readPublicDataset(
    publicMarketingSheets.eventSchedule.id,
    publicMarketingSheets.eventSchedule.gid,
    (rows) => mapScheduleRows(rows, "event"),
    errors
  );
  if (eventPosts && eventPosts.length > 0) {
    const grouped = new Map<string, ContentPost[]>();
    eventPosts.forEach((post) => {
      const key = post.campaign || post.id;
      grouped.set(key, [...(grouped.get(key) ?? []), post]);
    });
    const campaignEvents = Array.from(grouped.entries()).map(([id, posts]) => {
      const done = posts.filter((post) => post.status === "SCHEDULED" || post.status === "APPROVED").length;
      const missing = posts.filter((post) => post.status === "DRAFT" || post.status === "PENDING").map((post) => post.title);

      return {
        id,
        name: id,
        goal: `${posts.length} nội dung media`,
        progress: Math.round((done / posts.length) * 100),
        missingChecklist: missing,
        risk: missing.length > 0 ? `${missing.length} nội dung chưa sẵn sàng` : "Không có cảnh báo",
        approvalStatus: missing.length > 0 ? "At risk" as const : "Approved" as const,
        budget: 0,
        timeline: posts.map((post) => post.scheduledAt).filter(Boolean).join(", ")
      };
    });

    return { campaignEvents, source: "google-sheet" as const, errors };
  }

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
  const publicLeads = await readPublicDataset(
    publicMarketingSheets.leads.id,
    publicMarketingSheets.leads.gid,
    mapLeads,
    errors
  );
  if (publicLeads) {
    return { leads: publicLeads, source: "google-sheet" as const, errors };
  }

  if (!process.env.GOOGLE_SHEET_ID_MAIN) {
    return { leads: [], source: "google-sheet" as const, errors: ["No CRM sheet configured"] };
  }

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
  const publicAds = await readPublicDataset(
    publicMarketingSheets.ads.id,
    publicMarketingSheets.ads.gid,
    mapAds,
    errors
  );
  if (publicAds) {
    return { adsReports: publicAds, source: "google-sheet" as const, errors };
  }

  if (!process.env.GOOGLE_SHEET_ID_MAIN) {
    return { adsReports: [], source: "google-sheet" as const, errors: ["No Ads sheet configured"] };
  }

  const result = await readFirstAvailableSheet(
    process.env.GOOGLE_SHEET_ID_MAIN,
    [process.env.GOOGLE_SHEET_RANGE_ADS ?? "Ads!A:Z", "AdsReports!A:Z", "ads!A:Z"]
  );
  if (!result.ok || result.rows.length === 0) {
    if (result.message) errors.push(result.message);
    return { adsReports: [], source: "google-sheet" as const, errors };
  }

  const adsReports = mapAds(result.rows);

  return { adsReports, source: "google-sheet" as const, errors };
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
