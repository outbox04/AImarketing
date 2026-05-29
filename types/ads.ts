export type AdsReport = {
  id: string;
  campaignName: string;
  platform: "Facebook" | "Google" | "TikTok" | "LinkedIn";
  budget: number;
  spend: number;
  leads: number;
  cpl: number;
  ctr: string;
  status: "Running" | "Paused" | "Learning" | "Completed";
  reportLink: string;
};
