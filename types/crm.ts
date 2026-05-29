export type LeadStatus = "Lead mới" | "Đã liên hệ" | "Đang tư vấn" | "Báo giá" | "Chốt deal" | "Chăm sóc lại";

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
