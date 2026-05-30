import { jsonError } from "../_utils";

export const dynamic = "force-dynamic";

export async function POST() {
  return jsonError("Google Apps Script is read-only. Update row/approve actions require a separate server-side Google Sheets write integration.", 501);
}
