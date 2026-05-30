export type TaskStatus = "INBOX" | "TODO" | "IN_PROGRESS" | "WAITING" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Task = {
  id: string;
  title: string;
  type: "Content" | "Design" | "Video" | "Website" | "Event" | "Ads" | "CRM" | "Report";
  startDate?: string;
  deadline: string;
  priority: Priority;
  status: TaskStatus;
  fileUrl?: string;
  blocker?: string;
};
