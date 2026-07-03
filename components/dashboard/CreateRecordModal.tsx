"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

const categories = [
  { id: "content_post", label: "Bài viết" },
  { id: "campaign_event", label: "Campaign" },
  { id: "design_task", label: "Thiết kế" },
  { id: "video_post", label: "Video" },
  { id: "lead", label: "Lead" },
  { id: "ads_report", label: "Ads" }
] as const;

type CategoryId = (typeof categories)[number]["id"];

type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number";
};

const categoryFields: Record<CategoryId, FieldConfig[]> = {
  content_post: [
    { name: "id", label: "ID" },
    { name: "title", label: "Tiêu đề" },
    { name: "channel", label: "Kênh", placeholder: "Facebook / Website / Video" },
    { name: "type", label: "Loại", placeholder: "CONTENT / WEBSITE / VIDEO" },
    { name: "scheduled_at", label: "Ngày đăng" },
    { name: "status", label: "Trạng thái", placeholder: "PENDING / SCHEDULED" },
    { name: "campaign", label: "Chiến dịch" }
  ],
  campaign_event: [
    { name: "id", label: "ID" },
    { name: "name", label: "Tên chiến dịch" },
    { name: "goal", label: "Mục tiêu" },
    { name: "progress", label: "Tiến độ (%)", type: "number" },
    { name: "missing_checklist", label: "Checklist thiếu", placeholder: "Item1, Item2" },
    { name: "risk", label: "Rủi ro" },
    { name: "approval_status", label: "Trạng thái duyệt" },
    { name: "budget", label: "Ngân sách", type: "number" },
    { name: "timeline", label: "Timeline" }
  ],
  design_task: [
    { name: "id", label: "ID" },
    { name: "title", label: "Tiêu đề" },
    { name: "type", label: "Loại", placeholder: "Design" },
    { name: "start_date", label: "Ngày bắt đầu" },
    { name: "deadline", label: "Deadline" },
    { name: "priority", label: "Ưu tiên", placeholder: "LOW / MEDIUM / HIGH / URGENT" },
    { name: "status", label: "Trạng thái" },
    { name: "file_url", label: "File URL" },
    { name: "blocker", label: "Blocker" }
  ],
  video_post: [
    { name: "id", label: "ID" },
    { name: "title", label: "Tiêu đề" },
    { name: "channel", label: "Kênh", placeholder: "Video" },
    { name: "type", label: "Loại", placeholder: "VIDEO" },
    { name: "scheduled_at", label: "Ngày đăng" },
    { name: "status", label: "Trạng thái" },
    { name: "campaign", label: "Chiến dịch" }
  ],
  lead: [
    { name: "id", label: "ID" },
    { name: "name", label: "Tên khách" },
    { name: "phone", label: "SĐT" },
    { name: "email", label: "Email" },
    { name: "source", label: "Nguồn" },
    { name: "need", label: "Nhu cầu" },
    { name: "status", label: "Trạng thái" },
    { name: "follow_date", label: "Ngày follow" },
    { name: "note", label: "Ghi chú" }
  ],
  ads_report: [
    { name: "id", label: "ID" },
    { name: "campaign_name", label: "Chiến dịch" },
    { name: "platform", label: "Nền tảng" },
    { name: "budget", label: "Budget", type: "number" },
    { name: "spend", label: "Spend", type: "number" },
    { name: "leads", label: "Leads", type: "number" },
    { name: "cpl", label: "CPL", type: "number" },
    { name: "ctr", label: "CTR" },
    { name: "status", label: "Trạng thái" },
    { name: "report_link", label: "Link báo cáo" }
  ]
};

function createEmptyRow(category: CategoryId) {
  return categoryFields[category].reduce((acc, field) => ({ ...acc, [field.name]: "" }), {} as Record<string, string>);
}

type CreateRecordModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateRecordModal({ open, onClose }: CreateRecordModalProps) {
  const [category, setCategory] = useState<CategoryId>("content_post");
  const [rows, setRows] = useState<Record<string, string>[]>([createEmptyRow("content_post")]);
  const [status, setStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setRows([createEmptyRow(category)]);
    setStatus("");
  }, [category]);

  const fields = useMemo(() => categoryFields[category], [category]);

  function updateRow(index: number, field: string, value: string) {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  }

  function addRow() {
    setRows((current) => [...current, createEmptyRow(category)]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  async function saveRows() {
    setStatus("");
    setIsSaving(true);

    const payloadRows = rows.map((row) => {
      const data = { ...row } as Record<string, unknown>;
      if (category === "campaign_event") {
        data.missing_checklist = String(row.missing_checklist)
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
      }
      return data;
    });

    try {
      const response = await fetch("/api/marketing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ category, rows: payloadRows })
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        setStatus(result.message ?? "Không thể lưu dữ liệu.");
      } else {
        setStatus(`Đã tạo ${result.count} mục mới.`);
        setRows([createEmptyRow(category)]);
      }
    } catch (error) {
      setStatus("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal title="Tạo dữ liệu mới" open={open} onClose={onClose}>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${item.id === category ? "border-primary bg-primary-soft text-primary" : "border-border bg-white text-text-muted hover:bg-surface-soft"}`}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="rounded-3xl border border-border p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-text-main">Hàng {rowIndex + 1}</p>
              <Button variant="ghost" size="sm" onClick={() => removeRow(rowIndex)}>
                <Trash2 size={16} /> Xóa
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-semibold text-text-main">{field.label}</label>
                  <Input
                    type={field.type ?? "text"}
                    value={row[field.name] ?? ""}
                    placeholder={field.placeholder ?? ""}
                    onChange={(event) => updateRow(rowIndex, field.name, event.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" onClick={addRow}>
          <Plus size={16} /> Thêm hàng mới
        </Button>
        <Button variant="primary" size="sm" onClick={saveRows} disabled={isSaving || rows.length === 0}>
          {isSaving ? "Đang lưu..." : "Lưu dữ liệu"}
        </Button>
      </div>

      {status ? <p className="mt-4 text-sm text-text-muted">{status}</p> : null}
    </Modal>
  );
}

export function CreateRecordAction() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={16} /> Tạo mới
        </Button>
      </div>
      <CreateRecordModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
