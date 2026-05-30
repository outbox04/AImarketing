import { jsonError } from "../../_utils";

export const dynamic = "force-dynamic";

export async function POST() {
  return jsonError("Google Apps Script is read-only. Telegram sending is disabled until a server-side Telegram/report worker is configured.", 501);
}
