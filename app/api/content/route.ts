import { NextResponse } from "next/server";
import { getContentData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getContentData();
  return NextResponse.json({ contentPosts: data.contentPosts, source: data.source, errors: data.errors });
}
