import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";

const prompts = ["Tóm tắt cuộc họp này", "Tạo timeline event", "Lên brief thiết kế", "Phân bổ lịch đăng bài tuần sau", "Phân tích hiệu suất ads"];

export default function AiAssistantPage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        eyebrow="AI Workbench"
        title="AI Assistant"
        description="Giao diện chat nội bộ để tóm tắt, tạo timeline, brief, deadline, rủi ro và đề xuất hành động."
      />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <h2 className="text-lg font-bold text-text-main">Mẫu yêu cầu</h2>
          <div className="mt-4 space-y-2">
            {prompts.map((prompt) => <button key={prompt} className="w-full rounded-2xl bg-surface-soft px-3 py-3 text-left text-sm font-semibold text-text-main">{prompt}</button>)}
          </div>
        </Card>
        <Card className="min-h-[560px]">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-soft text-primary"><Bot size={19} /></div>
            <div><h2 className="font-bold text-text-main">Marketing Ops Copilot</h2><p className="text-sm text-text-muted">Output chia theo tóm tắt, việc cần làm, timeline, deadline, brief, rủi ro, đề xuất.</p></div>
          </div>
          <div className="rounded-2xl bg-surface-soft p-4 text-sm leading-6 text-text-main">
            <p className="font-bold">Tóm tắt</p>
            <p className="mt-1 text-text-muted">Proposal event đang là điểm nghẽn chính. Cần chốt vendor, timeline và media plan trước 11:00.</p>
            <p className="mt-4 font-bold">Việc cần làm</p>
            <p className="mt-1 text-text-muted">1. Cập nhật proposal. 2. Gửi lãnh đạo duyệt. 3. Dời lịch 2 bài Facebook bị trùng giờ.</p>
          </div>
          <div className="mt-6 flex gap-2">
            <Input placeholder="Nhập yêu cầu cho AI..." />
            <Button variant="primary" aria-label="Gửi yêu cầu"><Send size={17} /></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
