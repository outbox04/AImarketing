import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";

const prompts = ["Tóm tắt cuộc họp", "Tạo timeline event", "Tạo brief", "Phân tích Ads", "Tạo báo cáo AI"];

export default function AiAssistantPage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        eyebrow="AI Workbench"
        title="AI Assistant"
        description="Các tác vụ AI chỉ chạy khi người dùng chọn mẫu yêu cầu hoặc gửi prompt rõ ràng."
      />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <h2 className="text-lg font-bold text-text-main">Mẫu yêu cầu AI</h2>
          <div className="mt-4 space-y-2">
            {prompts.map((prompt) => (
              <button key={prompt} className="w-full rounded-2xl bg-surface-soft px-3 py-3 text-left text-sm font-semibold text-text-main">
                {prompt}
              </button>
            ))}
          </div>
        </Card>
        <Card className="min-h-[560px]">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Bot size={19} />
            </div>
            <div>
              <h2 className="font-bold text-text-main">Marketing Ops Copilot</h2>
              <p className="text-sm text-text-muted">Không tự tạo nội dung khi mở trang.</p>
            </div>
          </div>
          <div className="rounded-2xl bg-surface-soft p-4 text-sm leading-6 text-text-muted">
            Chọn một tác vụ AI hoặc nhập yêu cầu, sau đó bấm gửi. Nếu AI chưa phản hồi, workflow thủ công vẫn tiếp tục.
          </div>
          <div className="mt-6 flex gap-2">
            <Input placeholder="Nhập yêu cầu cho AI..." />
            <Button variant="primary" aria-label="Gửi yêu cầu AI">
              <Send size={17} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
