import type { Priority } from "./task";

export type ApprovalStatus = "DRAFT" | "PENDING" | "REVISION" | "APPROVED" | "REJECTED" | "SCHEDULED";
export type ContentType = "CONTENT" | "IMAGE" | "VIDEO" | "WEBSITE";
export type Channel = "Facebook" | "Website" | "Video" | "Event" | "Ads" | "Group sharing";

export type ContentPost = {
  id: string;
  title: string;
  channel: Channel;
  type: ContentType;
  scheduledAt: string;
  status: ApprovalStatus;
  campaign: string;
};

export type ApprovalItem = ContentPost & {
  caption: string;
  hashtags: string[];
  cta?: string;
  mediaSrc?: string;
  driveUrl: string;
  aiScore: number;
  aiRiskNote: string;
  priority: Priority;
  warnings: string[];
};
