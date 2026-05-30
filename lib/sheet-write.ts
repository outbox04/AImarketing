import { updatePublicSheetRowById } from "@/lib/google-sheet";
import { publicMarketingSheets } from "@/lib/google-sheet-config";
import type { ApprovalStatus } from "@/types/content";
import type { Priority, TaskStatus } from "@/types/task";

type UpdateValue = string | number | boolean | null | undefined;

function compactUpdates(updates: Record<string, UpdateValue>, labels: Record<string, string>) {
  return Object.entries(updates)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({ header: labels[key] ?? key, value: String(value) }));
}

function toSheetTaskStatus(status: TaskStatus) {
  const values: Record<TaskStatus, string> = {
    INBOX: "MỚI",
    TODO: "CẦN_LÀM",
    IN_PROGRESS: "ĐANG_LÀM",
    WAITING: "ĐANG_CHỜ",
    DONE: "HOÀN_THÀNH"
  };
  return values[status];
}

function toSheetPriority(priority: Priority) {
  const values: Record<Priority, string> = {
    LOW: "THẤP",
    MEDIUM: "TRUNG_BÌNH",
    HIGH: "CAO",
    URGENT: "KHẨN_CẤP"
  };
  return values[priority];
}

function toSheetScheduleStatus(status: ApprovalStatus) {
  const values: Record<ApprovalStatus, string> = {
    DRAFT: "CHUA_LEN_LICH",
    PENDING: "CHO_LEN_LICH",
    REVISION: "CAN_SUA",
    APPROVED: "DA_DUYET",
    REJECTED: "TU_CHOI",
    SCHEDULED: "DA_DANG"
  };
  return values[status];
}

export async function updateDeadlineSheet(id: string, updates: Partial<{
  title: string;
  startDate: string;
  deadline: string;
  priority: Priority;
  status: TaskStatus;
  reminderTime: string;
  note: string;
}>) {
  return updatePublicSheetRowById({
    spreadsheetId: publicMarketingSheets.deadlines.id,
    gid: publicMarketingSheets.deadlines.gid,
    idHeader: "ID",
    id,
    updates: compactUpdates(
      {
        title: updates.title,
        startDate: updates.startDate,
        deadline: updates.deadline,
        priority: updates.priority ? toSheetPriority(updates.priority) : undefined,
        status: updates.status ? toSheetTaskStatus(updates.status) : undefined,
        reminderTime: updates.reminderTime,
        note: updates.note
      },
      {
        title: "Tên deadline",
        startDate: "Ngày bắt đầu",
        deadline: "Ngày kết thúc",
        priority: "Mức độ ưu tiên",
        status: "Trạng thái",
        reminderTime: "Giờ nhắc việc",
        note: "Ghi chú"
      }
    )
  });
}

export async function updateScheduleSheet(id: string, updates: Partial<{
  date: string;
  time: string;
  channel: string;
  status: ApprovalStatus;
  postedAt: string;
  postId: string;
  link: string;
  error: string;
  note: string;
}>) {
  const eventRowMatch = id.match(/^(EVT_[^-]+)-(\d+)$/);
  const sheetId = eventRowMatch ? eventRowMatch[1] : id;
  const occurrence = eventRowMatch ? Number(eventRowMatch[2]) - 1 : 0;
  const target = id.startsWith("VID_")
    ? { sheet: publicMarketingSheets.videoSchedule, idHeader: "ID Video", statusHeader: "Trạng thái đăng", postIdHeader: "ID bài đăng", linkHeader: "Link bài đã đăng" }
    : id.startsWith("EVT_")
      ? { sheet: publicMarketingSheets.eventSchedule, idHeader: "ID Event", statusHeader: "Trạng thái", postIdHeader: "", linkHeader: "Link bài đăng" }
      : { sheet: publicMarketingSheets.contentSchedule, idHeader: "ID Content", statusHeader: "Trạng thái", postIdHeader: "ID Facebook", linkHeader: "" };

  const labels: Record<string, string> = {
    date: "Ngày đăng",
    time: "Giờ đăng",
    channel: "Kênh đăng",
    status: target.statusHeader,
    postedAt: "Thời gian đăng thực tế",
    postId: target.postIdHeader,
    link: target.linkHeader,
    error: "Lỗi",
    note: "Ghi chú"
  };

  return updatePublicSheetRowById({
    spreadsheetId: target.sheet.id,
    gid: target.sheet.gid,
    idHeader: target.idHeader,
    id: sheetId,
    occurrence,
    updates: compactUpdates(
      {
        date: updates.date,
        time: updates.time,
        channel: updates.channel,
        status: updates.status ? toSheetScheduleStatus(updates.status) : undefined,
        postedAt: updates.postedAt,
        postId: updates.postId,
        link: updates.link,
        error: updates.error,
        note: updates.note
      },
      labels
    )
  });
}
