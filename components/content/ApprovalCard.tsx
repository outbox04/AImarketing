"use client";

import { AlertTriangle, Copy, ExternalLink, FileImage, Pencil, ShieldCheck, Sparkles, ThumbsUp, Wand2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { approvalStatusMeta, priorityMeta } from "@/lib/status";
import type { ApprovalItem } from "@/types/content";
import { MediaPreview } from "./MediaPreview";

type ApprovalCardProps = {
  item: ApprovalItem;
  compact?: boolean;
};

export function ApprovalCard({ item, compact = false }: ApprovalCardProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const status = approvalStatusMeta[item.status];
  const priority = priorityMeta[item.priority];
  const canAutoPost = item.status === "APPROVED";
  const ruleNote = item.warnings.length > 0 ? item.warnings.join(" · ") : "Đủ điều kiện xử lý thủ công";

  async function updateApproval(statusValue: "APPROVED" | "REVISION" | "REJECTED") {
    setPendingAction(statusValue);
    try {
      const response = await fetch("/api/approval", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: item.id, status: statusValue })
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(result?.message ?? "Không thể cập nhật dữ liệu Supabase");
      }

      setPendingAction(null);
    } catch (error) {
      console.error(error);
      setPendingAction(null);
    }
  }

  return (
    <Card className={compact ? "p-4" : undefined}>
      <div className={compact ? "grid gap-4" : "grid gap-5 lg:grid-cols-[280px_1fr]"}>
        <MediaPreview src={item.mediaSrc} alt={item.title} />
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge className={status.className}>{status.label}</Badge>
            <Badge className={priority.className}>{priority.label}</Badge>
            <Badge className={canAutoPost ? "border-green-200 bg-success-soft text-green-700" : "border-border bg-surface-soft text-text-muted"}>
              Auto post: {canAutoPost ? "Sẵn sàng" : "Chưa đủ điều kiện"}
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-text-main">{item.title}</h3>
          <p className="mt-1 text-sm font-semibold text-text-muted">
            {item.channel} · {item.scheduledAt} · {item.campaign}
          </p>
          <p className="mt-4 text-sm leading-6 text-text-main">{item.caption}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.hashtags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-surface-soft p-3">
              <p className="text-xs font-bold uppercase text-text-soft">CTA</p>
              <p className="mt-1 text-sm font-semibold text-text-main">{item.cta ?? "Chưa có CTA"}</p>
            </div>
            <div className="rounded-2xl bg-surface-soft p-3">
              <p className="text-xs font-bold uppercase text-text-soft">Rule check</p>
              <p className="mt-1 text-sm font-semibold text-text-main">{ruleNote}</p>
            </div>
          </div>
          {item.warnings.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-warning-soft p-3">
              <div className="flex gap-2 text-sm font-semibold text-amber-800">
                <AlertTriangle size={18} />
                {item.warnings.join(" · ")}
              </div>
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary">
              <Copy size={16} /> Copy caption
            </Button>
            <Button size="sm" variant="primary" disabled={Boolean(pendingAction)} onClick={() => updateApproval("APPROVED")}>
              <ThumbsUp size={16} /> Duyệt
            </Button>
            <Button size="sm" variant="secondary" disabled={Boolean(pendingAction)} onClick={() => updateApproval("REVISION")}>
              <Pencil size={16} /> Yêu cầu sửa
            </Button>
            <Button size="sm" variant="danger" disabled={Boolean(pendingAction)} onClick={() => updateApproval("REJECTED")}>
              <X size={16} /> Từ chối
            </Button>
            <Button size="sm" variant="secondary">
              <ExternalLink size={16} /> Drive
            </Button>
            {!compact ? (
              <Button size="sm" variant="ghost">
                <ShieldCheck size={16} /> Sửa thủ công
              </Button>
            ) : null}
            {!compact ? (
              <Button size="sm" variant="ghost">
                <Sparkles size={16} /> Review bằng AI
              </Button>
            ) : null}
            {!compact ? (
              <Button size="sm" variant="ghost">
                <Wand2 size={16} /> Viết lại bằng Claude
              </Button>
            ) : null}
            {!compact ? (
              <Button size="sm" variant="ghost">
                <FileImage size={16} /> Tạo brief AI
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
