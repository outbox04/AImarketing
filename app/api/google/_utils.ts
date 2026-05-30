import { NextResponse } from "next/server";
import { isSheetModule } from "@/lib/google/sheet-modules";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, data: [], message }, { status });
}

export function requireModule(value: string | null) {
  if (!isSheetModule(value)) {
    throw new Error("Invalid or missing module");
  }
  return value;
}

export async function readJsonBody(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
