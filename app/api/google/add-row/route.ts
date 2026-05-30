import { jsonError } from "../_utils";

export const dynamic = "force-dynamic";

export async function POST() {
  return jsonError("Google Apps Script is read-only. Add row requires a separate server-side Google Sheets write integration.", 501);
}
