import { SHEET_MODULES } from "./sheet-modules";

export const REPORT_TABS = ["REPORT_DAILY", "REPORT_WEEKLY", "REPORT_MONTHLY", "REPORT_YEARLY"] as const;

export const SHEET_TABS = {
  [SHEET_MODULES.MAIN]: ["DAILY_WORK", "WORK_OVERVIEW", ...REPORT_TABS, "DROPDOWN_OPTIONS"],
  [SHEET_MODULES.CONTENT]: ["02_CONTENT", "CONTENT_CALENDAR", "CONTENT_APPROVAL", "CONTENT_MEDIA", "CONTENT_WEBSITE", ...REPORT_TABS],
  [SHEET_MODULES.VIDEO]: [
    "VIDEO_PLAN",
    "VIDEO_SCRIPT",
    "VIDEO_PRODUCTION",
    "VIDEO_EDITING",
    "VIDEO_APPROVAL",
    "VIDEO_PUBLISHING",
    "VIDEO_KPI",
    ...REPORT_TABS
  ],
  [SHEET_MODULES.ADS]: [
    "ADS_PLAN",
    "ADS_CAMPAIGN",
    "ADS_CREATIVE",
    "ADS_DAILY_PERFORMANCE",
    "ADS_BUDGET",
    "ADS_OPTIMIZATION",
    "ADS_KPI",
    ...REPORT_TABS
  ],
  [SHEET_MODULES.LEADS]: ["LEADS_DATABASE", "LEADS_FOLLOWUP", "LEADS_PIPELINE", "LEADS_REVENUE", "LEADS_QUALITY", "LEADS_KPI", ...REPORT_TABS],
  [SHEET_MODULES.EVENT]: [
    "EVENT_PLAN",
    "EVENT_TIMELINE",
    "EVENT_VENDOR",
    "EVENT_MEDIA_PRODUCTION",
    "EVENT_BUDGET",
    "EVENT_EXECUTION",
    "EVENT_KPI",
    ...REPORT_TABS
  ]
} as const;

export const MODULE_SHEET_URLS = {
  [SHEET_MODULES.MAIN]: "https://docs.google.com/spreadsheets/d/1EMgrSN-hYxHDPsm0PfO7fCp7rga3hlazFw6JGpW9XHY/edit",
  [SHEET_MODULES.CONTENT]: "https://docs.google.com/spreadsheets/d/13qX5JmnviqWSwVIntdj4jfkQMtjXb3ez0C-OhD0yx68/edit",
  [SHEET_MODULES.VIDEO]: "https://docs.google.com/spreadsheets/d/1-E-5uvUhR1F9Yksg0ZWlotkGbozz3frWrs0JIUb4n7g/edit",
  [SHEET_MODULES.ADS]: "https://docs.google.com/spreadsheets/d/1vgCDxo-fRIjFEq5vj_dcJuTVLW43q_hjQDqxLsxa28g/edit",
  [SHEET_MODULES.LEADS]: "https://docs.google.com/spreadsheets/d/15UAA5oGkjUwXTWeXokJC_zz9nQ3O-XiqzFNYEZewY70/edit",
  [SHEET_MODULES.EVENT]: "https://docs.google.com/spreadsheets/d/1peepjk9hBojquQDdkKw0KO4kFItUUtpKVxFQBUX8UJc/edit"
} as const;
