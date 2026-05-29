import { NextResponse } from "next/server";
import { getTasksData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getTasksData();
  return NextResponse.json({ tasks: data.tasks, source: data.source, errors: data.errors });
}
