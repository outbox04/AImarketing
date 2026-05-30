export type GoogleRow = Record<string, unknown>;

export function stringifyCell(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

export function humanizeKey(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getRowId(row: GoogleRow, index: number) {
  const id = row.id ?? row.ID ?? row.Id ?? row.ma ?? row.code;
  return stringifyCell(id) || `row-${index}`;
}

export function getColumns(rows: GoogleRow[], maxColumns = 10) {
  const columns = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (columns.size < maxColumns) columns.add(key);
    });
  });
  return Array.from(columns);
}

export function findValue(row: GoogleRow, candidates: string[]) {
  const normalized = new Map(Object.keys(row).map((key) => [normalizeKey(key), key]));
  for (const candidate of candidates) {
    const key = normalized.get(normalizeKey(candidate));
    if (key) return stringifyCell(row[key]);
  }
  return "";
}

export function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function rowMatchesSearch(row: GoogleRow, search: string) {
  const keyword = search.trim().toLowerCase();
  if (!keyword) return true;
  return Object.values(row).some((value) => stringifyCell(value).toLowerCase().includes(keyword));
}

export function getStatusValue(row: GoogleRow) {
  return findValue(row, ["status", "trang thai", "trạng thái", "trang_thai", "approval status", "tinh trang"]);
}

export function getDateValue(row: GoogleRow) {
  return findValue(row, ["date", "ngay", "ngày", "deadline", "due date", "ngay dang", "ngày đăng", "created_at"]);
}
