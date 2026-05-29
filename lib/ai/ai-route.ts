import { NextRequest, NextResponse } from "next/server";
import { runAiTask, type AiTaskType } from "@/lib/ai/ai-gateway";

export function createAiRoute(taskType: AiTaskType, userAction: string) {
  return async function POST(request: NextRequest) {
    const body = await request.json().catch(() => ({}));
    const result = await runAiTask({
      taskType,
      userAction,
      input: body.input ?? body,
      provider: body.provider,
      regenerate: Boolean(body.regenerate)
    });

    return NextResponse.json(result, { status: result.ok ? 200 : 200 });
  };
}
