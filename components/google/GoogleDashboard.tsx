"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getStatusValue, findValue, stringifyCell } from "@/lib/google/table-utils";
import type { GoogleRow } from "@/lib/google/table-utils";

type ApiState = {
  loading: boolean;
  error: string;
  dailyWork: GoogleRow[];
  overview: GoogleRow[];
  reportDaily: GoogleRow[];
};

const initialState: ApiState = {
  loading: true,
  error: "",
  dailyWork: [],
  overview: [],
  reportDaily: []
};

async function fetchRows(tab: string) {
  const response = await fetch(`/api/google/rows?module=MAIN&tab=${tab}`, { cache: "no-store" });
  const payload = (await response.json()) as { success: boolean; data: GoogleRow[]; message?: string };
  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? `Could not load ${tab}`);
  }
  return Array.isArray(payload.data) ? payload.data : [];
}

function includesAny(value: string, keywords: string[]) {
  const normalized = value.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function countRows(rows: GoogleRow[], keywords: string[]) {
  return rows.filter((row) => includesAny(getStatusValue(row), keywords)).length;
}

function sumField(rows: GoogleRow[], candidates: string[]) {
  return rows.reduce((total, row) => {
    const value = findValue(row, candidates).replace(/[^\d.-]/g, "");
    const parsed = Number(value);
    return total + (Number.isFinite(parsed) ? parsed : 0);
  }, 0);
}

function firstMatching(rows: GoogleRow[], keywords: string[], candidates: string[]) {
  const row = rows.find((item) => includesAny(getStatusValue(item), keywords));
  if (!row) return "";
  return findValue(row, candidates) || Object.values(row).map(stringifyCell).find(Boolean) || "";
}

function metricCards(state: ApiState) {
  const work = state.dailyWork;
  const overview = state.overview;
  const report = state.reportDaily;

  return [
    { label: "Tong cong viec hom nay", value: work.length },
    { label: "Cong viec hoan thanh", value: countRows(work, ["done", "hoan", "xong"]) },
    { label: "Cong viec dang xu ly", value: countRows(work, ["dang", "progress", "processing"]) },
    { label: "Cong viec tre", value: countRows(work, ["tre", "late", "overdue"]) },
    { label: "Content cho duyet", value: countRows(overview, ["cho duyet", "pending"]) },
    { label: "Content da dang", value: countRows(overview, ["da dang", "posted", "published"]) },
    { label: "Video KPI", value: sumField(report, ["video kpi", "kpi video", "video_kpi"]) || countRows(overview, ["video"]) },
    { label: "Video hoan thanh", value: countRows(overview, ["video hoan", "video done"]) },
    { label: "Video tre", value: countRows(overview, ["video tre", "video late"]) },
    { label: "Ads dang chay", value: countRows(overview, ["ads", "running", "dang chay"]) },
    { label: "Chi phi Ads", value: sumField(report, ["chi phi ads", "ad spend", "spend", "ads_cost"]).toLocaleString("vi-VN") },
    { label: "Doanh so Ads", value: sumField(report, ["doanh so ads", "revenue ads", "ads_revenue"]).toLocaleString("vi-VN") },
    { label: "Tong Lead moi", value: sumField(report, ["lead moi", "new leads", "total lead"]) || countRows(overview, ["lead"]) },
    { label: "Lead chat luong", value: sumField(report, ["lead chat luong", "qualified lead"]) || countRows(overview, ["qualified", "nong"]) },
    { label: "Event dang chay", value: countRows(overview, ["event", "running", "dang chay"]) },
    { label: "Event can xu ly", value: countRows(overview, ["event can", "event risk", "event tre"]) }
  ];
}

export function GoogleDashboard() {
  const [state, setState] = useState<ApiState>(initialState);

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [dailyWork, overview, reportDaily] = await Promise.all([
        fetchRows("DAILY_WORK"),
        fetchRows("WORK_OVERVIEW"),
        fetchRows("REPORT_DAILY")
      ]);
      setState({ loading: false, error: "", dailyWork, overview, reportDaily });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : "Could not load dashboard"
      }));
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 30_000);
    return () => window.clearInterval(timer);
  }, [load]);

  const cards = useMemo(() => metricCards(state), [state]);
  const lateTask = firstMatching(state.dailyWork, ["tre", "late", "overdue"], ["ten cong viec", "task", "title", "name"]);
  const lateReason = firstMatching(state.dailyWork, ["tre", "late", "overdue"], ["ly do tre", "reason", "blocker"]);
  const lateAction = firstMatching(state.dailyWork, ["tre", "late", "overdue"], ["huong xu ly", "action", "solution"]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">MAIN / DAILY_WORK / WORK_OVERVIEW / REPORT_DAILY</p>
          <h1 className="mt-1 text-2xl font-bold tracking-normal text-text-main md:text-3xl">Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted md:text-base">Du lieu doc truc tiep qua Next.js API routes, polling moi 30 giay.</p>
        </div>
        <Button variant="secondary" onClick={load} disabled={state.loading}>
          <RefreshCw size={17} /> Refresh
        </Button>
      </div>

      {state.error ? (
        <EmptyState title="Khong the tai du lieu Google Sheet" description="Khong the tai du lieu Google Sheet. Vui long kiem tra Apps Script API hoac quyen truy cap." />
      ) : null}

      {!state.error && state.loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-card bg-surface-soft" />)}
        </div>
      ) : null}

      {!state.error && !state.loading && state.dailyWork.length + state.overview.length + state.reportDaily.length === 0 ? (
        <EmptyState title="Chua co du lieu dashboard" description="MAIN / DAILY_WORK, WORK_OVERVIEW va REPORT_DAILY dang rong." />
      ) : null}

      {!state.error && !state.loading ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <Card key={card.label}>
                <p className="text-sm font-semibold text-text-muted">{card.label}</p>
                <p className="mt-3 text-3xl font-bold text-text-main">{card.value}</p>
              </Card>
            ))}
          </div>
          <Card>
            <h2 className="text-base font-bold text-text-main">Cong viec tre can xu ly</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div><p className="text-xs font-semibold uppercase text-text-soft">Ten cong viec tre</p><p className="mt-1 font-semibold text-text-main">{lateTask || "-"}</p></div>
              <div><p className="text-xs font-semibold uppercase text-text-soft">Ly do tre</p><p className="mt-1 font-semibold text-text-main">{lateReason || "-"}</p></div>
              <div><p className="text-xs font-semibold uppercase text-text-soft">Huong xu ly</p><p className="mt-1 font-semibold text-text-main">{lateAction || "-"}</p></div>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
