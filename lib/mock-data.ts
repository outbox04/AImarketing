import type { AdsReport } from "@/types/ads";
import type { ApprovalItem, ContentPost } from "@/types/content";
import type { Lead } from "@/types/crm";
import type { CampaignEvent } from "@/types/event";
import type { ReportMetric } from "@/types/report";
import type { Task } from "@/types/task";

export const tasks: Task[] = [
  { id: "task-1", title: "Duyệt 4 bài Facebook tuần này", type: "Content", deadline: "Hôm nay 09:30", priority: "URGENT", status: "TODO", fileUrl: "/api/drive" },
  { id: "task-2", title: "Hoàn thiện proposal event tháng 6", type: "Event", deadline: "Hôm nay 11:00", priority: "URGENT", status: "IN_PROGRESS", blocker: "Thiếu báo giá booth" },
  { id: "task-3", title: "Review landing page chiến dịch tuyển sinh", type: "Website", deadline: "Hôm nay 16:00", priority: "HIGH", status: "WAITING" },
  { id: "task-4", title: "Tổng hợp lead mới từ ads", type: "CRM", deadline: "Ngày mai 10:00", priority: "MEDIUM", status: "INBOX" },
  { id: "task-5", title: "Xuất báo cáo tuần gửi lãnh đạo", type: "Report", deadline: "Thứ sáu 17:00", priority: "HIGH", status: "TODO" },
  { id: "task-6", title: "Brief key visual cho workshop", type: "Design", deadline: "Hôm nay 15:00", priority: "HIGH", status: "IN_PROGRESS" }
];

export const contentPosts: ContentPost[] = [
  { id: "post-1", title: "Checklist chọn giải pháp CRM cho đội sales", channel: "Facebook", type: "CONTENT", scheduledAt: "Hôm nay 18:30", status: "PENDING", campaign: "CRM Growth Q2" },
  { id: "post-2", title: "Landing page workshop AI Marketing", channel: "Website", type: "WEBSITE", scheduledAt: "Ngày mai 09:00", status: "REVISION", campaign: "AI Workshop" },
  { id: "post-3", title: "Video recap khách hàng triển khai automation", channel: "Video", type: "VIDEO", scheduledAt: "Thứ sáu 20:00", status: "SCHEDULED", campaign: "Customer Proof" },
  { id: "post-4", title: "Banner tuyển sinh khóa mới", channel: "Ads", type: "IMAGE", scheduledAt: "Hôm nay 14:00", status: "APPROVED", campaign: "Performance May" }
];

export const approvalItems: ApprovalItem[] = [
  {
    ...contentPosts[0],
    caption: "Nếu đội sales đang mất quá nhiều thời gian cập nhật khách hàng thủ công, đây là 5 dấu hiệu cho thấy doanh nghiệp nên chuẩn hóa CRM ngay trong tháng này.",
    hashtags: ["#CRM", "#SalesOps", "#Automation"],
    cta: "Inbox để nhận checklist CRM miễn phí",
    mediaSrc: "/media/content/content-preview.svg",
    driveUrl: "/api/drive",
    aiScore: 91,
    aiRiskNote: "Caption rõ lợi ích, CTA tốt. Nên rút ngắn câu mở đầu để dễ scan trên mobile.",
    priority: "URGENT",
    warnings: []
  },
  {
    ...contentPosts[1],
    caption: "Workshop AI Marketing giúp đội ngũ xây hệ thống nội dung, ads và báo cáo nhanh hơn với trợ lý AI nội bộ.",
    hashtags: ["#AIMarketing", "#Workshop"],
    cta: undefined,
    mediaSrc: undefined,
    driveUrl: "/api/drive",
    aiScore: 74,
    aiRiskNote: "Thiếu CTA và ảnh đại diện website. Chưa đủ điều kiện auto publish.",
    priority: "HIGH",
    warnings: ["Thiếu CTA", "Thiếu ảnh đại diện"]
  },
  {
    ...contentPosts[2],
    caption: "Một ngày triển khai automation thực tế: từ brief, mapping dữ liệu, đến dashboard theo dõi lead.",
    hashtags: ["#Automation", "#CaseStudy"],
    cta: "Xem bản demo trong phần bình luận",
    mediaSrc: "/media/content/video-preview.svg",
    driveUrl: "/api/drive",
    aiScore: 88,
    aiRiskNote: "Nội dung ổn, cần kiểm tra phụ đề trước khi đăng.",
    priority: "MEDIUM",
    warnings: ["Cần kiểm tra phụ đề"]
  },
  {
    ...contentPosts[3],
    caption: "Khóa mới mở đăng ký với ưu đãi early bird cho 30 học viên đầu tiên.",
    hashtags: ["#Marketing", "#EarlyBird"],
    cta: "Đăng ký tư vấn ngay",
    mediaSrc: "/media/content/design-preview.svg",
    driveUrl: "/api/drive",
    aiScore: 95,
    aiRiskNote: "Đủ điều kiện chạy ads, thông điệp ngắn và rõ.",
    priority: "HIGH",
    warnings: []
  }
];

export const campaignEvents: CampaignEvent[] = [
  { id: "event-1", name: "AI Marketing Workshop", goal: "120 đăng ký, 45 khách tham dự", progress: 68, missingChecklist: ["Proposal final", "Backdrop", "Kịch bản MC"], risk: "Chưa chốt ngân sách vendor", approvalStatus: "At risk", budget: 85000000, timeline: "12/06/2026" },
  { id: "event-2", name: "CRM Growth Q2", goal: "Tăng 320 lead chất lượng", progress: 74, missingChecklist: ["Case study video", "Email nurture"], risk: "Lịch content dày vào cuối tuần", approvalStatus: "Waiting leadership", budget: 120000000, timeline: "Q2/2026" },
  { id: "event-3", name: "Website SEO Sprint", goal: "Publish 18 bài website", progress: 52, missingChecklist: ["Ảnh đại diện", "Internal link"], risk: "Thiếu reviewer SEO", approvalStatus: "Draft", budget: 25000000, timeline: "Tháng 6/2026" }
];

export const leads: Lead[] = [
  { id: "lead-1", name: "Nguyễn Minh Anh", phone: "09xx xxx 128", email: "anh.nguyen@example.com", source: "Facebook Ads", need: "Tư vấn CRM", status: "Lead mới", followDate: "Hôm nay", note: "Quan tâm automation sales" },
  { id: "lead-2", name: "Trần Quốc Huy", phone: "09xx xxx 245", email: "huy.tran@example.com", source: "Workshop", need: "Đào tạo AI Marketing", status: "Đang tư vấn", followDate: "Ngày mai", note: "Cần proposal nội bộ" },
  { id: "lead-3", name: "Lê Phương Thảo", phone: "09xx xxx 811", email: "thao.le@example.com", source: "Website", need: "SEO content", status: "Báo giá", followDate: "Thứ sáu", note: "Muốn gói 3 tháng" }
];

export const adsReports: AdsReport[] = [
  { id: "ads-1", campaignName: "AI Workshop Lead Gen", platform: "Facebook", budget: 30000000, spend: 18200000, leads: 146, cpl: 124657, ctr: "2.8%", status: "Running", reportLink: "/api/reports" },
  { id: "ads-2", campaignName: "CRM Checklist Download", platform: "Google", budget: 22000000, spend: 9100000, leads: 64, cpl: 142188, ctr: "3.1%", status: "Learning", reportLink: "/api/reports" },
  { id: "ads-3", campaignName: "Retarget Website Visitors", platform: "Facebook", budget: 12000000, spend: 7800000, leads: 38, cpl: 205263, ctr: "1.9%", status: "Running", reportLink: "/api/reports" }
];

export const reportMetrics: ReportMetric[] = [
  { id: "r-1", label: "Task hoàn thành", value: "42", change: "+12 tuần này", tone: "success" },
  { id: "r-2", label: "Content đã đăng", value: "27", change: "5 bài chờ duyệt", tone: "info" },
  { id: "r-3", label: "Lead mới", value: "248", change: "+18%", tone: "success" },
  { id: "r-4", label: "Deadline nguy hiểm", value: "3", change: "Cần xử lý hôm nay", tone: "danger" }
];

export const aiInsights = [
  "Ưu tiên proposal event trước 11:00 vì đang chặn timeline vendor.",
  "Bài website AI Workshop thiếu ảnh đại diện và CTA, chưa nên publish.",
  "Có 2 bài Facebook nên dời lịch vì trùng khung giờ 18:30.",
  "Ads CRM Checklist đang tăng CPL, cần kiểm tra audience overlap."
];

export const chartData = [
  { name: "T2", leads: 34, content: 5 },
  { name: "T3", leads: 42, content: 4 },
  { name: "T4", leads: 51, content: 6 },
  { name: "T5", leads: 47, content: 5 },
  { name: "T6", leads: 58, content: 7 },
  { name: "T7", leads: 39, content: 3 }
];
