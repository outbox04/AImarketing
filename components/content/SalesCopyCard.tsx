import { Copy, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ApprovalItem } from "@/types/content";

export function SalesCopyCard({ item }: { item: ApprovalItem }) {
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-text-main">{item.title}</h3>
        <Badge className="border-green-200 bg-success-soft text-green-700">Đã duyệt</Badge>
      </div>
      <p className="text-sm leading-6 text-text-main">{item.caption}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.hashtags.map((tag) => (
          <span key={tag} className="rounded-full bg-surface-soft px-2.5 py-1 text-xs font-semibold text-text-muted">{tag}</span>
        ))}
      </div>
      <p className="mt-4 rounded-2xl bg-primary-soft p-3 text-sm font-semibold text-primary">Cách đăng: copy caption, tải ảnh Drive, đăng đúng khung giờ đã duyệt.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" variant="primary"><Copy size={16} /> Copy caption</Button>
        <Button size="sm" variant="secondary"><ExternalLink size={16} /> Open Drive Folder</Button>
      </div>
    </Card>
  );
}
