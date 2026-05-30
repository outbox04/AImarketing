import { SHEET_MODULES } from "./sheet-modules";
import type { SheetModule } from "./sheet-modules";

export type ModulePageConfig = {
  module: SheetModule;
  title: string;
  description: string;
  tabs: readonly { label: string; tab: string }[];
};

export const CONTENT_REPORT_TABS = [
  { label: "Ngay", tab: "REPORT_DAILY" },
  { label: "Tuan", tab: "REPORT_WEEKLY" },
  { label: "Thang", tab: "REPORT_MONTHLY" },
  { label: "Nam", tab: "REPORT_YEARLY" }
] as const;

export const modulePageConfigs = {
  contentCalendar: {
    module: SHEET_MODULES.CONTENT,
    title: "Content Calendar",
    description: "Doc CONTENT / CONTENT_CALENDAR tu Google Sheet qua Next.js API route.",
    tabs: [{ label: "Calendar", tab: "CONTENT_CALENDAR" }]
  },
  contentApproval: {
    module: SHEET_MODULES.CONTENT,
    title: "Duyet noi dung",
    description: "Doc CONTENT / CONTENT_APPROVAL va loc trang thai tu du lieu Google Sheet.",
    tabs: [{ label: "Approval", tab: "CONTENT_APPROVAL" }]
  },
  contentMedia: {
    module: SHEET_MODULES.CONTENT,
    title: "Content Media",
    description: "Quan ly media cua Content tu CONTENT / CONTENT_MEDIA.",
    tabs: [{ label: "Media", tab: "CONTENT_MEDIA" }]
  },
  contentWebsite: {
    module: SHEET_MODULES.CONTENT,
    title: "Content Website",
    description: "Quan ly bai website tu CONTENT / CONTENT_WEBSITE.",
    tabs: [{ label: "Website", tab: "CONTENT_WEBSITE" }]
  },
  contentReports: {
    module: SHEET_MODULES.CONTENT,
    title: "Content Reports",
    description: "Bao cao ngay, tuan, thang, nam cua module Content.",
    tabs: CONTENT_REPORT_TABS
  },
  video: {
    module: SHEET_MODULES.VIDEO,
    title: "Video Management",
    description: "Ke hoach, script, quay, dung, duyet, dang va KPI video tu Google Sheet.",
    tabs: [
      { label: "Plan", tab: "VIDEO_PLAN" },
      { label: "Script", tab: "VIDEO_SCRIPT" },
      { label: "Production", tab: "VIDEO_PRODUCTION" },
      { label: "Editing", tab: "VIDEO_EDITING" },
      { label: "Approval", tab: "VIDEO_APPROVAL" },
      { label: "Publishing", tab: "VIDEO_PUBLISHING" },
      { label: "KPI", tab: "VIDEO_KPI" }
    ]
  },
  videoReports: {
    module: SHEET_MODULES.VIDEO,
    title: "Video Reports",
    description: "Bao cao ngay, tuan, thang, nam cua module Video.",
    tabs: CONTENT_REPORT_TABS
  },
  ads: {
    module: SHEET_MODULES.ADS,
    title: "Ads Management",
    description: "Ke hoach, campaign, creative, hieu suat, ngan sach, toi uu va KPI ads.",
    tabs: [
      { label: "Plan", tab: "ADS_PLAN" },
      { label: "Campaign", tab: "ADS_CAMPAIGN" },
      { label: "Creative", tab: "ADS_CREATIVE" },
      { label: "Performance", tab: "ADS_DAILY_PERFORMANCE" },
      { label: "Budget", tab: "ADS_BUDGET" },
      { label: "Optimization", tab: "ADS_OPTIMIZATION" },
      { label: "KPI", tab: "ADS_KPI" }
    ]
  },
  adsReports: {
    module: SHEET_MODULES.ADS,
    title: "Ads Reports",
    description: "Bao cao ngay, tuan, thang, nam cua module Ads.",
    tabs: CONTENT_REPORT_TABS
  },
  leads: {
    module: SHEET_MODULES.LEADS,
    title: "Leads Management",
    description: "Database, follow-up, pipeline, revenue, quality va KPI lead tu Google Sheet.",
    tabs: [
      { label: "Database", tab: "LEADS_DATABASE" },
      { label: "Follow-up", tab: "LEADS_FOLLOWUP" },
      { label: "Pipeline", tab: "LEADS_PIPELINE" },
      { label: "Revenue", tab: "LEADS_REVENUE" },
      { label: "Quality", tab: "LEADS_QUALITY" },
      { label: "KPI", tab: "LEADS_KPI" }
    ]
  },
  leadsReports: {
    module: SHEET_MODULES.LEADS,
    title: "Leads Reports",
    description: "Bao cao ngay, tuan, thang, nam cua module Leads.",
    tabs: CONTENT_REPORT_TABS
  },
  event: {
    module: SHEET_MODULES.EVENT,
    title: "Event Management",
    description: "Ke hoach, timeline, vendor, media production, ngan sach, execution va KPI event.",
    tabs: [
      { label: "Plan", tab: "EVENT_PLAN" },
      { label: "Timeline", tab: "EVENT_TIMELINE" },
      { label: "Vendor", tab: "EVENT_VENDOR" },
      { label: "Media", tab: "EVENT_MEDIA_PRODUCTION" },
      { label: "Budget", tab: "EVENT_BUDGET" },
      { label: "Execution", tab: "EVENT_EXECUTION" },
      { label: "KPI", tab: "EVENT_KPI" }
    ]
  },
  eventReports: {
    module: SHEET_MODULES.EVENT,
    title: "Event Reports",
    description: "Bao cao ngay, tuan, thang, nam cua module Event.",
    tabs: CONTENT_REPORT_TABS
  }
} satisfies Record<string, ModulePageConfig>;
