import { NextResponse } from "next/server";
import { contentPosts } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ contentPosts });
}
