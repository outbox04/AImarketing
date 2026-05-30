"use client";

import { RefreshCw, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GoogleDataTable } from "@/components/google/GoogleDataTable";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { MODULE_SHEET_URLS, REPORT_TABS } from "@/lib/google/sheet-tabs";
import type { GoogleRow } from "@/lib/google/table-utils";

const tabs = [
  { label: "Ngay", tab: "REPORT_DAILY" },
  { label: "Tuan", tab: "REPORT_WEEKLY" },
  { label: "Thang", tab: "REPORT_MONTHLY" },
  { label: "Nam", tab: "REPORT_YEARLY" }
] as const;

export function GoogleReports() {
  const [activeTab, setActiveTab] = useState<(typeof REPORT_TABS)[number]>("REPORT_DAILY");
  const [rows, setRows] = useState<GoogleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/google/rows?module=MAIN&tab=${activeTab}`, { cache: "no-store" });
      const payload = (await response.json()) as { success: boolean; data: GoogleRow[]; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message ?? "Could not load report");
      setRows(Array.isArray(payload.data) ? payload.data : []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not load report");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const postAction = async (url: string, body?: Record<string, unknown>) => {
    setActionMessage("Dang xu ly...");
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body ?? {})
    });
    const payload = (await response.json()) as { success: boolean; message?: string };
    setActionMessage(payload.success ? "Hoan thanh." : payload.message ?? "Thao tac that bai.");
    if (payload.success) void load();
  };

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="MAIN / Reports"
        title="Reports"
        description="Bao cao ngay, tuan, thang, nam tu Google Sheet MAIN. Telegram report dung Apps Script, khong goi AI mac dinh."
        actions={
          <>
            <Button variant="secondary" onClick={() => postAction("/api/google/report/sync-daily")}>
              <RefreshCw size={17} /> Sync bao cao ngay
            </Button>
            <Button variant="secondary" onClick={() => postAction("/api/google/report/send-daily")}>
              <Send size={17} /> Gui Telegram Report
            </Button>
            <Button variant="primary" onClick={() => postAction("/api/google/report/send-daily", { force: true })}>
              <Send size={17} /> Gui lai Telegram Report
            </Button>
          </>
        }
      />
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${activeTab === item.tab ? "border-primary bg-primary-soft text-primary" : "border-border bg-white text-text-muted"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {actionMessage ? <p className="mb-3 text-sm font-semibold text-text-muted">{actionMessage}</p> : null}
      <GoogleDataTable rows={rows} title={`MAIN / ${activeTab}`} loading={loading} error={error} sheetUrl={MODULE_SHEET_URLS.MAIN} onRefresh={load} />
    </div>
  );
}
