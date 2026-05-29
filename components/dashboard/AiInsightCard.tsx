"use client";

import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AiResponse = {
  ok: boolean;
  content: string | null;
  message?: string;
  cached?: boolean;
};

export function AiInsightCard() {
  const [result, setResult] = useState<AiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function requestAiSuggestion() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/priority-recommendation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          input: { screen: "dashboard", intent: "prioritize today" },
          userAction: "Gợi ý AI"
        })
      });
      setResult(await response.json());
    } catch {
      setResult({ ok: false, content: null, message: "AI hiện chưa phản hồi, bạn vẫn có thể xử lý thủ công." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-gradient-to-br from-white to-primary-soft">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white">
          <Bot size={19} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-main">Gợi ý AI</h2>
          <p className="text-sm text-text-muted">Chỉ phân tích khi bạn chủ động yêu cầu.</p>
        </div>
      </div>

      {result?.content ? (
        <div className="rounded-2xl bg-white/80 p-3 text-sm font-semibold leading-6 text-text-main">{result.content}</div>
      ) : (
        <div className="rounded-2xl bg-white/80 p-3 text-sm leading-6 text-text-muted">
          {result?.message ?? "Dashboard đang dùng số liệu rule-based. Bấm nút bên dưới nếu cần AI đề xuất ưu tiên."}
        </div>
      )}

      <Button className="mt-4" size="sm" variant="primary" onClick={requestAiSuggestion} disabled={isLoading}>
        <Sparkles size={16} /> {isLoading ? "Đang phân tích..." : "Gợi ý AI"}
      </Button>
    </Card>
  );
}
