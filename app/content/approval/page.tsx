import { Filter, ShieldCheck } from "lucide-react";
import { ApprovalCard } from "@/components/content/ApprovalCard";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { getApprovalData } from "@/lib/data/marketing-data";

const tabs = ["Tất cả", "Content", "Hình ảnh", "Video", "Website", "Cần duyệt hôm nay", "Cần sửa", "Đã duyệt"];

export const dynamic = "force-dynamic";

export default async function ApprovalPage() {
  const data = await getApprovalData();

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Content Operations"
        title="Duyệt nội dung"
        description="Nơi kiểm tra caption, media, CTA, rủi ro AI và điều kiện auto-post trước khi nội dung được đăng."
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
        {data.approvalItems.map((item) => (
          <ApprovalCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
