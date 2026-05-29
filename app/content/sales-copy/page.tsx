import { SalesCopyCard } from "@/components/content/SalesCopyCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { getApprovalData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export default async function SalesCopyPage() {
  const data = await getApprovalData();
  const approved = data.approvalItems.filter((item) => item.status === "APPROVED");
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        eyebrow="Sales Enablement"
        title="Sales Copy"
        description="Không hiển thị task nội bộ hay ghi chú nhạy cảm. Sales chỉ thấy bài đã duyệt, caption, ảnh Drive và hướng dẫn đăng."
        actions={<Select><option>Tất cả sản phẩm/campaign</option><option>AI Workshop</option><option>CRM Growth Q2</option></Select>}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {approved.map((item) => <SalesCopyCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
