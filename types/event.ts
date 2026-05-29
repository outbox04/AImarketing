export type CampaignEvent = {
  id: string;
  name: string;
  goal: string;
  progress: number;
  missingChecklist: string[];
  risk: string;
  approvalStatus: "Draft" | "Waiting leadership" | "Approved" | "At risk";
  budget: number;
  timeline: string;
};
