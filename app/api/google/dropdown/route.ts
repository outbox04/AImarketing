import { getDropdown } from "@/lib/google/apps-script-client";
import { isSheetModule } from "@/lib/google/sheet-modules";
import { jsonError, jsonOk } from "../_utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const group = searchParams.get("group");
    if (!group) return jsonError("Missing group", 400);

    const moduleParam = searchParams.get("module");
    if (moduleParam && !isSheetModule(moduleParam)) {
      return jsonError("Invalid module", 400);
    }

    const sheetModule = moduleParam && isSheetModule(moduleParam) ? moduleParam : undefined;
    const result = await getDropdown(group, sheetModule);
    return jsonOk(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load dropdown values";
    return jsonError(message);
  }
}
