import { NextRequest, NextResponse } from "next/server";
import { getContentData } from "@/lib/data/marketing-data";
import { supabaseAdmin } from "@/lib/supabase-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const data = await getContentData();
  const dur = Date.now() - start;
  console.log(`[api] GET /api/content took ${dur}ms`);
  return NextResponse.json({ contentPosts: data.contentPosts, source: data.source, errors: data.errors });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json() as { id?: string; updates?: Record<string, unknown> };

  if (!body.id || !body.updates) {
    return NextResponse.json({ ok: false, message: "Missing id or updates" }, { status: 400 });
  }

  const start = Date.now();
  const { error, data } = await supabaseAdmin.from("content_posts").update(body.updates).eq("id", body.id);
  const dur = Date.now() - start;
  console.log(`[api] PATCH /api/content took ${dur}ms`);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data }, { status: 200 });
}
