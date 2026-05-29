import type { ApprovalStatus } from "@/types/content";
import type { Priority, TaskStatus } from "@/types/task";

export const approvalStatusMeta: Record<ApprovalStatus, { label: string; className: string }> = {
  DRAFT: { label: "Bản nháp", className: "bg-surface-soft text-text-muted border-border" },
  PENDING: { label: "Chờ duyệt", className: "bg-warning-soft text-amber-700 border-amber-200" },
  REVISION: { label: "Cần sửa", className: "bg-info-soft text-sky-700 border-sky-200" },
  APPROVED: { label: "Đã duyệt", className: "bg-success-soft text-green-700 border-green-200" },
  REJECTED: { label: "Từ chối", className: "bg-danger-soft text-red-700 border-red-200" },
  SCHEDULED: { label: "Đã lên lịch", className: "bg-info-soft text-sky-700 border-sky-200" }
};

export const priorityMeta: Record<Priority, { label: string; className: string; dot: string }> = {
  LOW: { label: "Thấp", className: "bg-surface-soft text-text-muted border-border", dot: "bg-text-soft" },
  MEDIUM: { label: "Vừa", className: "bg-info-soft text-sky-700 border-sky-200", dot: "bg-info" },
  HIGH: { label: "Cao", className: "bg-warning-soft text-amber-700 border-amber-200", dot: "bg-warning" },
  URGENT: { label: "Khẩn cấp", className: "bg-danger-soft text-red-700 border-red-200", dot: "bg-danger" }
};

export const taskStatusMeta: Record<TaskStatus, { label: string }> = {
  INBOX: { label: "Inbox" },
  TODO: { label: "Cần làm" },
  IN_PROGRESS: { label: "Đang làm" },
  WAITING: { label: "Chờ phản hồi" },
  DONE: { label: "Hoàn thành" }
};
