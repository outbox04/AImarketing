import { NextResponse } from "next/server";
import { importMarketingData } from "@/lib/supabase-import";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dataset = url.searchParams.get("dataset") ?? "all";

  try {
    const start = Date.now();
    const result = await importMarketingData(dataset);
    const dur = Date.now() - start;
    console.log(`[api] GET /api/supabase/import?dataset=${dataset} took ${dur}ms`);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed";
    return NextResponse.json({ ok: false, dataset, message }, { status: 500 });
  }
}
