import { Bot } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { aiInsights } from "@/lib/mock-data";

export function AiInsightCard() {
  return (
    <Card className="bg-gradient-to-br from-white to-primary-soft">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white">
          <Bot size={19} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-main">AI đề xuất hôm nay</h2>
          <p className="text-sm text-text-muted">Tập trung vào việc có tác động và rủi ro cao nhất.</p>
        </div>
      </div>
      <ol className="space-y-3">
        {aiInsights.slice(0, 3).map((insight, index) => (
          <li key={insight} className="flex gap-3 rounded-2xl bg-white/80 p-3 text-sm font-semibold leading-6 text-text-main">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs text-primary">{index + 1}</span>
            {insight}
          </li>
        ))}
      </ol>
    </Card>
  );
}
