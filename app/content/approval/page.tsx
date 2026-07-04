import { redirect } from "next/navigation";
import { AlertTriangle, CheckCircle2, FileCheck2, Filter, ShieldCheck, XCircle } from "lucide-react";
import { ApprovalCard } from "@/components/content/ApprovalCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { hasFullAccess } from "@/lib/auth/access";
import { getCurrentUser } from "@/lib/auth/session";
import { getApprovalData } from "@/lib/data/marketing-data";

const tabs = ["Tất cả", "Content", "Hình ảnh", "Video", "Website", "Cần duyệt hôm nay", "Cần sửa", "Đã duyệt"];

export const dynamic = "force-dynamic";

export default async function ApprovalPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  if (!hasFullAccess(currentUser)) redirect("/dashboard");

  const data = await getApprovalData();
  const waitingItems = data.approvalItems.filter((item) => item.status === "PENDING");
  const revisionItems = data.approvalItems.filter((item) => item.status === "REVISION");
  const approvedItems = data.approvalItems.filter((item) => item.status === "APPROVED" || item.status === "SCHEDULED");
  const rejectedItems = data.approvalItems.filter((item) => item.status === "REJECTED");

  const stats = [
    { label: "Chờ quyết định", value: waitingItems.length, icon: ShieldCheck, className: "bg-warning-soft text-amber-700" },
    { label: "Yêu cầu sửa", value: revisionItems.length, icon: AlertTriangle, className: "bg-info-soft text-sky-700" },
    { label: "Đã duyệt", value: approvedItems.length, icon: CheckCircle2, className: "bg-success-soft text-green-700" },
    { label: "Từ chối", value: rejectedItems.length, icon: XCircle, className: "bg-danger-soft text-red-700" }
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Cấp duyệt nội dung"
        title="Trung tâm duyệt nội dung"
        description="Khu vực dành cho Ban lãnh đạo và Trưởng phòng kiểm tra caption, media, CTA, rủi ro AI và quyết định duyệt trước khi nội dung được đăng."
        actions={
          <>
            <Select aria-label="Lọc campaign">
              <option>Tất cả campaign</option>
              <option>AI Workshop</option>
              <option>CRM Growth Q2</option>
            </Select>
            <Button variant="secondary"><Filter size={17} /> Bộ lọc</Button>
            <Button variant="primary" disabled title="Duyệt nhanh cần server-side write integration"><ShieldCheck size={17} /> Duyệt nhanh</Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-muted">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-text-main">{stat.value}</p>
                </div>
                <div className={`grid h-11 w-11 place-items-center rounded-2xl ${stat.className}`}>
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mb-6 border-primary/15 bg-primary-soft/50">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-main">Luồng phê duyệt cấp quản lý</h2>
            <p className="mt-1 text-sm leading-6 text-text-muted">Nhân viên chỉ tạo và cập nhật nội dung theo quyền được giao. Ban lãnh đạo hoặc Trưởng phòng là người duyệt, yêu cầu sửa hoặc từ chối.</p>
          </div>
          <Badge className="border-primary bg-white text-primary">
            <FileCheck2 size={14} /> Quyền duyệt: {currentUser.position}
          </Badge>
        </div>
      </Card>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${index === 0 ? "border-primary bg-primary-soft text-primary" : "border-border bg-white text-text-muted"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-5">
        {[...waitingItems, ...revisionItems, ...approvedItems, ...rejectedItems].map((item) => (
          <ApprovalCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
