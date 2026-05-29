import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { approvalStatusMeta } from "@/lib/status";
import type { ContentPost } from "@/types/content";

export function ContentCard({ post }: { post: ContentPost }) {
  const status = approvalStatusMeta[post.status];
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-text-main">{post.title}</h3>
          <p className="mt-1 text-sm text-text-muted">{post.channel} · {post.campaign}</p>
        </div>
        <Badge className={status.className}>{status.label}</Badge>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-text-muted">
        <CalendarDays size={16} />
        {post.scheduledAt}
      </div>
    </Card>
  );
}
