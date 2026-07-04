"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { InstantLink, useNavigationFeedback } from "./NavigationFeedback";
import { navigationGroups } from "./navigation";

export function Sidebar() {
  const { optimisticPathname } = useNavigationFeedback();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-border bg-white/90 px-4 py-5 backdrop-blur xl:block">
      <InstantLink href="/dashboard" className="mb-7 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-200">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-text-main">Marketing AI</p>
          <p className="text-xs font-medium text-text-muted">Command Center</p>
        </div>
      </InstantLink>
      <nav className="space-y-6 overflow-y-auto pb-6">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-text-soft">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = optimisticPathname === item.href;
                return (
                  <InstantLink
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors duration-150",
                      active ? "bg-primary-soft text-primary" : "text-text-muted hover:bg-surface-soft hover:text-text-main"
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </InstantLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
