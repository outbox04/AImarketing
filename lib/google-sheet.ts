import crypto from "node:crypto";

const tokenUrl = "https://oauth2.googleapis.com/token";
const sheetsScope = "https://www.googleapis.com/auth/spreadsheets.readonly";

type SheetRowsResult = {
  ok: boolean;
  rows: Record<string, string>[];
  message?: string;
};

let tokenCache: { accessToken: string; expiresAt: number } | null = null;

function base64Url(input: string | Buffer) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function getPrivateKey() {
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function hasGoogleSheetEnv() {
  return Boolean(process.env.GOOGLE_CLIENT_EMAIL && getPrivateKey());
}

async function getAccessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error("Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: sheetsScope,
      aud: tokenUrl,
      exp: now + 3600,
      iat: now
    })
  );
  const unsignedToken = `${header}.${payload}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsignedToken).sign(privateKey);
  const assertion = `${unsignedToken}.${base64Url(signature)}`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Google OAuth returned ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  };

  return data.access_token;
}

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/\s+/g, "_");
}

function rowsToObjects(values: string[][] = []) {
  const [headers = [], ...rows] = values;
  const normalizedHeaders = headers.map(normalizeHeader);

  return rows
    .filter((row) => row.some((cell) => String(cell ?? "").trim().length > 0))
    .map((row) => {
      return normalizedHeaders.reduce<Record<string, string>>((record, header, index) => {
        if (header) {
          record[header] = String(row[index] ?? "").trim();
        }
        return record;
      }, {});
    });
}

export async function getGoogleSheetClient() {
  return {
    ok: hasGoogleSheetEnv(),
    message: hasGoogleSheetEnv()
      ? "Google Sheet env is configured. Data is read server-side through /api/* routes."
      : "Google Sheet env is missing. App will use fallback mock data."
  };
}

export async function readSheetRows(spreadsheetId: string | undefined, range: string): Promise<SheetRowsResult> {
  if (!spreadsheetId) {
    return { ok: false, rows: [], message: "Missing spreadsheet id" };
  }

  try {
    const accessToken = await getAccessToken();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`;
    const response = await fetch(url, {
      headers: { authorization: `Bearer ${accessToken}` },
      cache: "no-store"
    });

    if (!response.ok) {
      return { ok: false, rows: [], message: `Google Sheets returned ${response.status} for ${range}` };
    }

    const data = (await response.json()) as { values?: string[][] };
    return { ok: true, rows: rowsToObjects(data.values), message: `Read ${range}` };
  } catch (error) {
    return {
      ok: false,
      rows: [],
      message: error instanceof Error ? error.message : "Unknown Google Sheet error"
    };
  }
}

export async function readFirstAvailableSheet(spreadsheetId: string | undefined, ranges: string[]) {
  const errors: string[] = [];

  for (const range of ranges) {
    const result = await readSheetRows(spreadsheetId, range);
    if (result.ok && result.rows.length > 0) {
      return result;
    }
    if (result.message) {
      errors.push(result.message);
    }
  }

  return { ok: false, rows: [], message: errors.join("; ") || "No sheet range returned data" };
}
