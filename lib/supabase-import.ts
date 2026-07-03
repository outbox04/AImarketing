import { supabaseAdmin } from "@/lib/supabase-client";
import { getAdsData, getApprovalData, getContentData, getEventData, getLeadData, getTasksData } from "@/lib/data/marketing-data";
import type { AdsReport } from "@/types/ads";
import type { ApprovalItem } from "@/types/content";
import type { ContentPost } from "@/types/content";
import type { Lead } from "@/types/crm";
import type { CampaignEvent } from "@/types/event";
import type { Task } from "@/types/task";

type UpsertResult = { ok: boolean; error?: string; count: number };

type ImportResult = {
  ok: boolean;
  dataset: string;
  results: Record<string, UpsertResult>;
  message?: string;
};

async function upsertRows<T extends Record<string, unknown>>(table: string, rows: T[]): Promise<UpsertResult> {
  if (rows.length === 0) {
    return { ok: true, count: 0 };
  }

  if (!supabaseAdmin) {
    return { ok: false, error: "Supabase is not configured", count: rows.length };
  }

  const { error } = await supabaseAdmin.from(table as string).upsert(rows as any[], {
    onConflict: "id"
  });

  return {
    ok: error === null,
    error: error?.message ?? undefined,
    count: rows.length
  };
}

export async function importMarketingData(dataset: string): Promise<ImportResult> {
  const results: Record<string, UpsertResult> = {};

  const importers: Record<string, () => Promise<UpsertResult>> = {
    tasks: async () => {
      const { tasks, errors } = await getTasksData();
      const result = await upsertRows<Task>("tasks", tasks);
      if (!result.ok && errors.length) result.error = `${result.error ?? ""} ${errors.join("; ")}`.trim();
      return result;
    },
    leads: async () => {
      const { leads, errors } = await getLeadData();
      const result = await upsertRows<Lead>("leads", leads);
      if (!result.ok && errors.length) result.error = `${result.error ?? ""} ${errors.join("; ")}`.trim();
      return result;
    },
    content_posts: async () => {
      const { contentPosts, errors } = await getContentData();
      const result = await upsertRows<ContentPost>("content_posts", contentPosts);
      if (!result.ok && errors.length) result.error = `${result.error ?? ""} ${errors.join("; ")}`.trim();
      return result;
    },
    approval_items: async () => {
      const { approvalItems, errors } = await getApprovalData();
      const result = await upsertRows<ApprovalItem>("approval_items", approvalItems);
      if (!result.ok && errors.length) result.error = `${result.error ?? ""} ${errors.join("; ")}`.trim();
      return result;
    },
    campaign_events: async () => {
      const { campaignEvents, errors } = await getEventData();
      const result = await upsertRows<CampaignEvent>("campaign_events", campaignEvents);
      if (!result.ok && errors.length) result.error = `${result.error ?? ""} ${errors.join("; ")}`.trim();
      return result;
    },
    ads_reports: async () => {
      const { adsReports, errors } = await getAdsData();
      const result = await upsertRows<AdsReport>("ads_reports", adsReports);
      if (!result.ok && errors.length) result.error = `${result.error ?? ""} ${errors.join("; ")}`.trim();
      return result;
    }
  };

  const targets = dataset === "all" ? Object.keys(importers) : [dataset];

  for (const target of targets) {
    const importer = importers[target];
    if (!importer) {
      return {
        ok: false,
        dataset,
        results,
        message: `Unknown dataset: ${dataset}`
      };
    }
    results[target] = await importer();
  }

  return {
    ok: Object.values(results).every((result) => result.ok),
    dataset,
    results
  };
}
