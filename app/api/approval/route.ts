import { NextResponse } from "next/server";
import { approvalItems } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ approvalItems });
}
