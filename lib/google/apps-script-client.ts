import type { SheetModule } from "./sheet-modules";

const requestTimeoutMs = 20_000;

type AppsScriptResponse<T = unknown> = {
  success?: boolean;
  ok?: boolean;
  data?: T;
  rows?: T;
  values?: T;
  message?: string;
  error?: string;
};

function getAppsScriptUrl() {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!url) {
    throw new Error("Missing GOOGLE_APPS_SCRIPT_URL");
  }
  return url;
}

function buildUrl(action: string, params: Record<string, string | undefined> = {}) {
  const url = new URL(getAppsScriptUrl());
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url;
}

function normalizeResponse<T>(payload: AppsScriptResponse<T>): { success: boolean; data: T; message?: string } {
  const success = payload.success ?? payload.ok ?? !payload.error;
  const data = (payload.data ?? payload.rows ?? payload.values ?? ([] as T)) as T;
  return {
    success,
    data,
    message: payload.message ?? payload.error
  };
}

async function parseResponse<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as AppsScriptResponse<T>)
    : ({ success: response.ok, data: await response.text() } as AppsScriptResponse<T>);

  if (!response.ok) {
    throw new Error(payload.message ?? payload.error ?? `Apps Script returned ${response.status}`);
  }

  const result = normalizeResponse<T>(payload);
  if (!result.success) {
    throw new Error(result.message ?? "Apps Script request failed");
  }
  return result;
}

export async function getRows(module: SheetModule, tab: string) {
  const response = await fetch(buildUrl("get_rows", { module, tab }), {
    cache: "no-store",
    signal: AbortSignal.timeout(requestTimeoutMs)
  });
  return parseResponse<Record<string, unknown>[]>(response);
}

export async function getDropdown(group: string, module?: SheetModule) {
  const response = await fetch(buildUrl("get_dropdown", { group, module }), {
    cache: "no-store",
    signal: AbortSignal.timeout(requestTimeoutMs)
  });
  return parseResponse<unknown[]>(response);
}
