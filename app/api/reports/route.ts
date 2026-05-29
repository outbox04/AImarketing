import { NextResponse } from "next/server";
import { reportMetrics } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ reportMetrics });
}
