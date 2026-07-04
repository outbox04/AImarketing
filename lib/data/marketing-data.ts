import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-client";
import { adsReports as mockAdsReports, approvalItems as mockApprovalItems, campaignEvents as mockCampaignEvents, contentPosts as mockContentPosts, leads as mockLeads, tasks as mockTasks } from "@/lib/mock-data";
import type { AdsReport } from "@/types/ads";
import type { ApprovalItem, ContentPost } from "@/types/content";
import type { Lead } from "@/types/crm";
import type { CampaignEvent } from "@/types/event";
import type { Task } from "@/types/task";

export type MarketingData = {
  tasks: Task[];
  contentPosts: ContentPost[];
  approvalItems: ApprovalItem[];
  campaignEvents: CampaignEvent[];
  leads: Lead[];
  adsReports: AdsReport[];
  source: "supabase" | "mock";
  errors: string[];
};

type DataTableResult<T> = {
  rows: T[];
  source: "supabase" | "mock";
};

async function queryTable<T>(table: string, fallback: T[], errors: string[]): Promise<DataTableResult<T>> {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return { rows: fallback, source: "mock" };
  }

  const { data, error } = await supabaseAdmin.from(table as string).select("*");
  if (error) {
    errors.push(error.message);
    return { rows: fallback, source: "mock" };
  }

  return { rows: (data as T[]) ?? [], source: "supabase" };
}

export async function getTasksData() {
  const errors: string[] = [];
  const result = await queryTable<Task>("tasks", mockTasks, errors);
  return { tasks: result.rows, source: result.source, errors };
}

export async function getContentData() {
  const errors: string[] = [];
  const result = await queryTable<ContentPost>("content_posts", mockContentPosts, errors);
  return { contentPosts: result.rows, source: result.source, errors };
}

export async function getApprovalData() {
  const errors: string[] = [];
  const result = await queryTable<ApprovalItem>("approval_items", mockApprovalItems, errors);
  return { approvalItems: result.rows, source: result.source, errors };
}

export async function getEventData() {
  const errors: string[] = [];
  const result = await queryTable<CampaignEvent>("campaign_events", mockCampaignEvents, errors);
  return { campaignEvents: result.rows, source: result.source, errors };
}

export async function getLeadData() {
  const errors: string[] = [];
  const result = await queryTable<Lead>("leads", mockLeads, errors);
  return { leads: result.rows, source: result.source, errors };
}

export async function getAdsData() {
  const errors: string[] = [];
  const result = await queryTable<AdsReport>("ads_reports", mockAdsReports, errors);
  return { adsReports: result.rows, source: result.source, errors };
}

export async function getMarketingData(): Promise<MarketingData> {
  const CACHE_TTL = 2000; // ms
  try {
    if ((global as any).__marketing_cache && Date.now() - (global as any).__marketing_cache.ts < CACHE_TTL) {
      return (global as any).__marketing_cache.data as MarketingData;
    }
  } catch (e) {
    // ignore
  }
  const [tasksData, contentData, approvalData, eventData, leadData, adsData] = await Promise.all([
    getTasksData(),
    getContentData(),
    getApprovalData(),
    getEventData(),
    getLeadData(),
    getAdsData()
  ]);

  const errors = [
    ...tasksData.errors,
    ...contentData.errors,
    ...approvalData.errors,
    ...eventData.errors,
    ...leadData.errors,
    ...adsData.errors
  ];

  const allMock =
    tasksData.source === "mock" &&
    contentData.source === "mock" &&
    approvalData.source === "mock" &&
    eventData.source === "mock" &&
    leadData.source === "mock" &&
    adsData.source === "mock";

  const result: MarketingData = {
    tasks: tasksData.tasks,
    contentPosts: contentData.contentPosts,
    approvalItems: approvalData.approvalItems,
    campaignEvents: eventData.campaignEvents,
    leads: leadData.leads,
    adsReports: adsData.adsReports,
    source: allMock ? "mock" : "supabase",
    errors
  };

  try {
    (global as any).__marketing_cache = { data: result, ts: Date.now() };
  } catch (e) {
    // ignore
  }

  return result;
}
