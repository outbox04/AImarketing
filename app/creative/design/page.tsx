import { ExternalLink, PenTool } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

const designs = [
  { name: "Key visual AI Workshop", size: "1920x1080", channel: "Event + Ads", deadline: "Hôm nay 15:00", status: "Chờ duyệt" },
  { name: "Carousel CRM Checklist", size: "1080x1350", channel: "Facebook", deadline: "Ngày mai", status: "Đang thiết kế" },
  { name: "Backdrop sân khấu", size: "6m x 3m", channel: "Event", deadline: "Thứ sáu", status: "Cần sửa" }
];

export default function CreativeDesignPage() {
  return (
    <div className="mx-auto max-w-[1300px]">
      <PageHeader
        eyebrow="Creative Pipeline"
        title="Thiết kế ấn phẩm"
        description="Quản lý brief, deadline, preview và Drive link theo workflow thiết kế thực tế."
        actions={<Button variant="primary"><PenTool size={17} /> Tạo brief thiết kế</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {designs.map((item) => (
          <Card key={item.name}>
            <div className="mb-4 aspect-[16/10] rounded-2xl border border-border bg-[url('/media/content/design-preview.svg')] bg-cover bg-center" />
            <h3 className="text-lg font-bold text-text-main">{item.name}</h3>
            <p className="mt-2 text-sm text-text-muted">{item.size} · {item.channel}</p>
            <p className="mt-3 text-sm font-semibold text-warning">{item.deadline}</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="rounded-full bg-info-soft px-3 py-1 text-xs font-bold text-sky-700">{item.status}</span>
              <Button size="sm" variant="secondary"><ExternalLink size={16} /> Drive</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
