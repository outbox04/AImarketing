"use client";

import { ExternalLink, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getColumns, getDateValue, getRowId, getStatusValue, humanizeKey, rowMatchesSearch, stringifyCell } from "@/lib/google/table-utils";
import type { GoogleRow } from "@/lib/google/table-utils";

type GoogleDataTableProps = {
  rows: GoogleRow[];
  title?: string;
  loading?: boolean;
  error?: string;
  sheetUrl?: string;
  onRefresh?: () => void;
};

function statusClass(status: string) {
  const value = status.toLowerCase();
  if (value.includes("done") || value.includes("hoan") || value.includes("duyet") || value.includes("đã")) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (value.includes("tre") || value.includes("trễ") || value.includes("risk") || value.includes("late")) return "border-red-200 bg-red-50 text-red-700";
  if (value.includes("dang") || value.includes("đang") || value.includes("running")) return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function GoogleDataTable({ rows, title, loading = false, error, sheetUrl, onRefresh }: GoogleDataTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  const statuses = useMemo(() => Array.from(new Set(rows.map(getStatusValue).filter(Boolean))), [rows]);
  const columns = useMemo(() => getColumns(rows), [rows]);
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const statusMatch = status === "all" || getStatusValue(row) === status;
      const dateMatch = !date || getDateValue(row).includes(date);
      return rowMatchesSearch(row, search) && statusMatch && dateMatch;
    });
  }, [date, rows, search, status]);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {title ? <h2 className="text-base font-bold text-text-main">{title}</h2> : null}
          <p className="text-sm text-text-muted">{loading ? "Dang tai du lieu Google Sheet..." : `${filteredRows.length} / ${rows.length} dong`}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-3 text-text-soft" size={16} />
            <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
          </div>
          <Select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter status">
            <option value="all">Tat ca trang thai</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
          <Input className="sm:w-[160px]" value={date} onChange={(event) => setDate(event.target.value)} placeholder="Loc ngay" />
          {sheetUrl ? (
            <a href={sheetUrl} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-surface-soft">
              <ExternalLink size={16} /> Sheet
            </a>
          ) : null}
          {onRefresh ? (
            <Button type="button" variant="secondary" onClick={onRefresh}>
              <RefreshCw size={16} /> Refresh
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="p-5">
          <EmptyState title="Khong the tai du lieu Google Sheet" description="Khong the tai du lieu Google Sheet. Vui long kiem tra Apps Script API hoac quyen truy cap." />
        </div>
      ) : null}

      {!error && loading ? (
        <div className="grid gap-3 p-5">
          {[0, 1, 2].map((item) => <div key={item} className="h-12 animate-pulse rounded-lg bg-surface-soft" />)}
        </div>
      ) : null}

      {!error && !loading && rows.length === 0 ? (
        <div className="p-5">
          <EmptyState title="Chua co du lieu" description="Tab Google Sheet nay chua tra ve dong du lieu nao." />
        </div>
      ) : null}

      {!error && !loading && rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-surface-soft text-xs uppercase text-text-soft">
              <tr>
                {columns.map((column) => <th key={column} className="px-5 py-4">{humanizeKey(column)}</th>)}
                <th className="px-5 py-4">Drive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRows.map((row, index) => (
                <tr key={getRowId(row, index)}>
                  {columns.map((column) => {
                    const value = stringifyCell(row[column]);
                    const isStatus = getStatusValue(row) === value && value;
                    const isUrl = value.startsWith("http");
                    return (
                      <td key={column} className="max-w-[320px] px-5 py-4 align-top text-text-muted">
                        {isStatus ? <Badge className={statusClass(value)}>{value}</Badge> : isUrl ? <a className="font-semibold text-primary" href={value} target="_blank" rel="noreferrer">Mo link</a> : value}
                      </td>
                    );
                  })}
                  <td className="px-5 py-4">
                    {Object.values(row).some((value) => stringifyCell(value).includes("drive.google.com")) ? (
                      <a className="font-semibold text-primary" href={Object.values(row).map(stringifyCell).find((value) => value.includes("drive.google.com"))} target="_blank" rel="noreferrer">Mo Drive</a>
                    ) : <span className="text-text-soft">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}
