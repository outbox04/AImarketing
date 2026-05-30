export type LeadStatus = string;

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  need: string;
  status: LeadStatus;
  followDate: string;
  note: string;
};
