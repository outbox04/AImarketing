import crypto from "node:crypto";

const tokenUrl = "https://oauth2.googleapis.com/token";
const sheetsScope = "https://www.googleapis.com/auth/spreadsheets";
const requestTimeoutMs = 15_000;

type SheetRowsResult = {
  ok: boolean;
  rows: Record<string, string>[];
  message?: string;
};

type SheetValuesResult = {
  ok: boolean;
  values: string[][];
  message?: string;
};

type PublicSheetCellUpdate = {
  header: string;
  value: string;
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

function stripVietnamese(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function normalizeHeader(header: string) {
  return stripVietnamese(header)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim().length > 0)) {
    rows.push(row);
  }

  return rows;
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

function cellValue(value: string) {
  return { userEnteredValue: { stringValue: value } };
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
      signal: AbortSignal.timeout(requestTimeoutMs),
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

export async function readPublicCsvSheet(spreadsheetId: string | undefined, gid: string | undefined): Promise<SheetRowsResult> {
  if (!spreadsheetId || !gid) {
    return { ok: false, rows: [], message: "Missing public spreadsheet id or gid" };
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(spreadsheetId)}/export?format=csv&gid=${encodeURIComponent(gid)}`;
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(requestTimeoutMs) });

    if (!response.ok) {
      return { ok: false, rows: [], message: `Public Google Sheet CSV returned ${response.status}` };
    }

    const csv = await response.text();
    return { ok: true, rows: rowsToObjects(parseCsv(csv)), message: `Read public CSV gid ${gid}` };
  } catch (error) {
    return {
      ok: false,
      rows: [],
      message: error instanceof Error ? error.message : "Unknown public Google Sheet error"
    };
  }
}

export async function readPublicCsvValues(spreadsheetId: string | undefined, gid: string | undefined): Promise<SheetValuesResult> {
  if (!spreadsheetId || !gid) {
    return { ok: false, values: [], message: "Missing public spreadsheet id or gid" };
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(spreadsheetId)}/export?format=csv&gid=${encodeURIComponent(gid)}`;
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(requestTimeoutMs) });

    if (!response.ok) {
      return { ok: false, values: [], message: `Public Google Sheet CSV returned ${response.status}` };
    }

    return { ok: true, values: parseCsv(await response.text()), message: `Read public CSV gid ${gid}` };
  } catch (error) {
    return {
      ok: false,
      values: [],
      message: error instanceof Error ? error.message : "Unknown public Google Sheet error"
    };
  }
}

export async function updatePublicSheetRowById(params: {
  spreadsheetId: string | undefined;
  gid: string | undefined;
  idHeader: string;
  id: string;
  occurrence?: number;
  updates: PublicSheetCellUpdate[];
}) {
  const { spreadsheetId, gid, idHeader, id, occurrence = 0, updates } = params;

  if (!spreadsheetId || !gid) {
    return { ok: false, message: "Missing public spreadsheet id or gid" };
  }
  if (!updates.length) {
    return { ok: false, message: "No update values provided" };
  }

  const valuesResult = await readPublicCsvValues(spreadsheetId, gid);
  if (!valuesResult.ok || valuesResult.values.length === 0) {
    return { ok: false, message: valuesResult.message ?? "Could not read public sheet values" };
  }

  const [headers = [], ...rows] = valuesResult.values;
  const normalizedHeaders = headers.map(normalizeHeader);
  const idColumnIndex = normalizedHeaders.indexOf(normalizeHeader(idHeader));

  if (idColumnIndex === -1) {
    return { ok: false, message: `Missing id column: ${idHeader}` };
  }

  const matchingRows = rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => String(row[idColumnIndex] ?? "").trim() === id);
  const rowIndex = matchingRows[occurrence]?.index ?? -1;
  if (rowIndex === -1) {
    return { ok: false, message: `No row found for ${idHeader}=${id}` };
  }

  const cells = updates
    .map((update) => ({
      columnIndex: normalizedHeaders.indexOf(normalizeHeader(update.header)),
      value: update.value
    }))
    .filter((update) => update.columnIndex >= 0)
    .sort((a, b) => a.columnIndex - b.columnIndex);

  if (!cells.length) {
    return { ok: false, message: "No matching update columns found" };
  }

  const accessToken = await getAccessToken();
  const sheetId = Number(gid);
  const requests = cells.map((update) => ({
    updateCells: {
      range: {
        sheetId,
        startRowIndex: rowIndex + 1,
        endRowIndex: rowIndex + 2,
        startColumnIndex: update.columnIndex,
        endColumnIndex: update.columnIndex + 1
      },
      rows: [{ values: [cellValue(update.value)] }],
      fields: "userEnteredValue"
    }
  }));

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({ requests }),
    cache: "no-store",
    signal: AbortSignal.timeout(requestTimeoutMs)
  });

  if (!response.ok) {
    return { ok: false, message: `Google Sheets update returned ${response.status}` };
  }

  return { ok: true, message: `Updated ${idHeader}=${id}` };
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
