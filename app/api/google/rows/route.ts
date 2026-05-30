import { getRows } from "@/lib/google/apps-script-client";
import { jsonError, jsonOk, requireModule } from "../_utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const sheetModule = requireModule(searchParams.get("module"));
    const tab = searchParams.get("tab");
    if (!tab) return jsonError("Missing tab", 400);

    const result = await getRows(sheetModule, tab);
    return jsonOk(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load Google Sheet rows";
    return jsonError(message);
  }
}
