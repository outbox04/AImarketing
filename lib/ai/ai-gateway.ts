import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type AiTaskType =
  | "MEETING_SUMMARY"
  | "PRIORITY_RECOMMENDATION"
  | "CONTENT_WRITING"
  | "CONTENT_REVIEW"
  | "EVENT_PLANNING"
  | "ADS_ANALYSIS"
  | "REPORT_NARRATIVE"
  | "IMAGE_BRIEF";

export type AiProvider = "openai" | "claude";

type AiGatewayRequest = {
  taskType: AiTaskType;
  userAction: string;
  input: unknown;
  provider?: AiProvider;
  regenerate?: boolean;
};

type AiGatewayResponse = {
  ok: boolean;
  taskType: AiTaskType;
  provider: AiProvider;
  content: string | null;
  cached: boolean;
  hash: string;
  message?: string;
};

type AiLogEntry = {
  ID: string;
  CreatedAt: string;
  Provider: AiProvider;
  TaskType: AiTaskType;
  PromptTokens?: number;
  CompletionTokens?: number;
  TotalTokens?: number;
  EstimatedCost?: number;
  UserAction: string;
  Status: "SUCCESS" | "ERROR" | "CACHE_HIT" | "SKIPPED";
  Error?: string;
};

const allowedTasks: AiTaskType[] = [
  "MEETING_SUMMARY",
  "PRIORITY_RECOMMENDATION",
  "CONTENT_WRITING",
  "CONTENT_REVIEW",
  "EVENT_PLANNING",
  "ADS_ANALYSIS",
  "REPORT_NARRATIVE",
  "IMAGE_BRIEF"
];

const resultCache = new Map<string, AiGatewayResponse>();
const logDir = path.join(process.cwd(), "AI_LOGS");
const logFile = path.join(logDir, "ai-logs.jsonl");

export function shouldUseAI(taskType: AiTaskType): boolean {
  return allowedTasks.includes(taskType);
}

export function getAiHash(input: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

function getProvider(provider?: AiProvider): AiProvider {
  return provider ?? (process.env.CLAUDE_API_KEY ? "claude" : "openai");
}

function hasProviderKey(provider: AiProvider) {
  return provider === "claude" ? Boolean(process.env.CLAUDE_API_KEY) : Boolean(process.env.OPENAI_API_KEY);
}

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

function writeAiLog(entry: AiLogEntry) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(logFile, `${JSON.stringify(entry)}\n`, "utf8");
  } catch (error) {
    console.error("AI_LOGS write failed", error);
  }
}

async function callProvider(provider: AiProvider, taskType: AiTaskType, input: unknown) {
  const prompt = JSON.stringify({ taskType, input });
  const promptTokens = estimateTokens(prompt);

  if (!hasProviderKey(provider)) {
    throw new Error(`${provider.toUpperCase()} API key is not configured`);
  }

  if (provider === "claude") {
    const providerStart = Date.now();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY ?? "",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const dur = Date.now() - providerStart;
      console.error(`[ai] claude ${taskType} failed in ${dur}ms, status ${response.status}`);
      throw new Error(`Claude returned ${response.status}`);
    }

    const data = await response.json();
    const dur = Date.now() - providerStart;
    console.log(`[ai] claude ${taskType} completed in ${dur}ms`);
    const content = data.content?.map((item: { text?: string }) => item.text).filter(Boolean).join("\n") ?? "";
    return {
      content,
      promptTokens: data.usage?.input_tokens ?? promptTokens,
      completionTokens: data.usage?.output_tokens ?? estimateTokens(content)
    };
  }

  const providerStart = Date.now();
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    const dur = Date.now() - providerStart;
    console.error(`[ai] openai ${taskType} failed in ${dur}ms, status ${response.status}`);
    throw new Error(`OpenAI returned ${response.status}`);
  }

  const data = await response.json();
  const dur = Date.now() - providerStart;
  console.log(`[ai] openai ${taskType} completed in ${dur}ms`);
  const content = data.choices?.[0]?.message?.content ?? "";
  return {
    content,
    promptTokens: data.usage?.prompt_tokens ?? promptTokens,
    completionTokens: data.usage?.completion_tokens ?? estimateTokens(content)
  };
}

export async function runAiTask(request: AiGatewayRequest): Promise<AiGatewayResponse> {
  const totalStart = Date.now();
  const provider = getProvider(request.provider);
  const hash = getAiHash({ taskType: request.taskType, input: request.input });
  const cacheKey = `${provider}:${request.taskType}:${hash}`;

  if (!shouldUseAI(request.taskType)) {
    writeAiLog({
      ID: crypto.randomUUID(),
      CreatedAt: new Date().toISOString(),
      Provider: provider,
      TaskType: request.taskType,
      UserAction: request.userAction,
      Status: "SKIPPED",
      Error: "Task type is not allowed for AI"
    });

    return { ok: false, taskType: request.taskType, provider, content: null, cached: false, hash, message: "AI task is not allowed." };
  }

  if (!request.regenerate && resultCache.has(cacheKey)) {
    const cached = resultCache.get(cacheKey)!;
    writeAiLog({
      ID: crypto.randomUUID(),
      CreatedAt: new Date().toISOString(),
      Provider: provider,
      TaskType: request.taskType,
      UserAction: request.userAction,
      Status: "CACHE_HIT"
    });
    return { ...cached, cached: true };
  }

  try {
    const result = await callProvider(provider, request.taskType, request.input);
    const totalDur = Date.now() - totalStart;
    console.log(`[ai] runAiTask ${request.taskType} total ${totalDur}ms (provider=${provider})`);
    const totalTokens = result.promptTokens + result.completionTokens;
    const response: AiGatewayResponse = {
      ok: true,
      taskType: request.taskType,
      provider,
      content: result.content,
      cached: false,
      hash
    };

    resultCache.set(cacheKey, response);
    writeAiLog({
      ID: crypto.randomUUID(),
      CreatedAt: new Date().toISOString(),
      Provider: provider,
      TaskType: request.taskType,
      PromptTokens: result.promptTokens,
      CompletionTokens: result.completionTokens,
      TotalTokens: totalTokens,
      EstimatedCost: 0,
      UserAction: request.userAction,
      Status: "SUCCESS"
    });

    return response;
  } catch (error) {
    const totalDur = Date.now() - totalStart;
    console.error(`[ai] runAiTask ${request.taskType} error after ${totalDur}ms`, error);
    const message = error instanceof Error ? error.message : "Unknown AI error";
    writeAiLog({
      ID: crypto.randomUUID(),
      CreatedAt: new Date().toISOString(),
      Provider: provider,
      TaskType: request.taskType,
      UserAction: request.userAction,
      Status: "ERROR",
      Error: message
    });

    return {
      ok: false,
      taskType: request.taskType,
      provider,
      content: null,
      cached: false,
      hash,
      message: "AI hiện chưa phản hồi, bạn vẫn có thể xử lý thủ công."
    };
  }
}
