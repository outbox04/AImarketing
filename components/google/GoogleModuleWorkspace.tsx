"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GoogleDataTable } from "@/components/google/GoogleDataTable";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import type { SheetModule } from "@/lib/google/sheet-modules";
import { MODULE_SHEET_URLS } from "@/lib/google/sheet-tabs";
import type { GoogleRow } from "@/lib/google/table-utils";

type TabConfig = {
  label: string;
  tab: string;
};

type GoogleModuleWorkspaceProps = {
  module: SheetModule;
  title: string;
  description: string;
  tabs: readonly TabConfig[];
};

export function GoogleModuleWorkspace({ module, title, description, tabs }: GoogleModuleWorkspaceProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.tab ?? "");
  const [rowsByTab, setRowsByTab] = useState<Record<string, GoogleRow[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeLabel = useMemo(() => tabs.find((item) => item.tab === activeTab)?.label ?? activeTab, [activeTab, tabs]);

  const load = useCallback(async () => {
    if (!activeTab) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/google/rows?module=${module}&tab=${activeTab}`, { cache: "no-store" });
      const payload = (await response.json()) as { success: boolean; data: GoogleRow[]; message?: string };
      if (!response.ok || !payload.success) throw new Error(payload.message ?? `Could not load ${module} / ${activeTab}`);
      setRowsByTab((current) => ({ ...current, [activeTab]: Array.isArray(payload.data) ? payload.data : [] }));
    } catch (error) {
      setError(error instanceof Error ? error.message : `Could not load ${module} / ${activeTab}`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, module]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = rowsByTab[activeTab] ?? [];

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        eyebrow={`${module} / Google Sheet`}
        title={title}
        description={description}
        actions={
          <Button variant="secondary" onClick={load} disabled={loading}>
            <RefreshCw size={17} /> Refresh
          </Button>
        }
      />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${activeTab === item.tab ? "border-primary bg-primary-soft text-primary" : "border-border bg-white text-text-muted"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <GoogleDataTable rows={rows} title={`${module} / ${activeLabel}`} loading={loading} error={error} sheetUrl={MODULE_SHEET_URLS[module]} onRefresh={load} />
    </div>
  );
}
