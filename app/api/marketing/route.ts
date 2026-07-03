import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-client";

const categoryTableMap: Record<string, string> = {
  content_post: "content_posts",
  campaign_event: "campaign_events",
  design_task: "tasks",
  video_post: "content_posts",
  lead: "leads",
  ads_report: "ads_reports"
};

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json() as { category?: string; rows?: Record<string, unknown>[] };

  if (!body.category || !Array.isArray(body.rows) || body.rows.length === 0) {
    return NextResponse.json({ ok: false, message: "Missing category or rows" }, { status: 400 });
  }

  const table = categoryTableMap[body.category];
  if (!table) {
    return NextResponse.json({ ok: false, message: "Unknown data category" }, { status: 400 });
  }

  const formattedRows = body.rows.map((row) => {
    if (body.category === "campaign_event") {
      return {
        ...row,
        missing_checklist: Array.isArray(row.missing_checklist)
          ? row.missing_checklist
          : String(row.missing_checklist || "")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
      };
    }
    return row;
  });

  const start = Date.now();
  const { error } = await supabaseAdmin.from(table).insert(formattedRows);
  const dur = Date.now() - start;
  console.log(`[api] POST /api/marketing -> ${table} insert took ${dur}ms`);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: formattedRows.length });
}
