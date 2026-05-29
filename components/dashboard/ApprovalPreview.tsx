import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { approvalItems } from "@/lib/mock-data";
import { ApprovalCard } from "@/components/content/ApprovalCard";

export function ApprovalPreview() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text-main">Cần duyệt ngay</h2>
          <p className="text-sm text-text-muted">Ưu tiên những nội dung đang chặn lịch đăng và auto posting.</p>
        </div>
        <Link
          href="/content/approval"
          className="hidden h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-surface-soft md:inline-flex"
        >
          Xem tất cả <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid gap-4">
        {approvalItems.slice(0, 3).map((item) => (
          <ApprovalCard key={item.id} item={item} compact />
        ))}
      </div>
    </section>
  );
}
