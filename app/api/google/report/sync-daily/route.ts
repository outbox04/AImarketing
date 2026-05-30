import { jsonError } from "../../_utils";

export const dynamic = "force-dynamic";

export async function POST() {
  return jsonError("Google Apps Script is read-only. Sync daily report is disabled until a write/report worker is configured.", 501);
}
