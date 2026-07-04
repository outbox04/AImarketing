"use client";

import { Home, CheckSquare, FileText, Bot, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { InstantLink, useNavigationFeedback } from "./NavigationFeedback";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/content/approval", label: "Duyệt", icon: FileText },
  { href: "/ai-assistant", label: "AI", icon: Bot },
  { href: "/settings", label: "Cài đặt", icon: Settings }
];

export function MobileNav() {
  const { optimisticPathname } = useNavigationFeedback();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-3xl border border-border bg-white p-2 shadow-soft xl:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = optimisticPathname === item.href;
        return (
          <InstantLink
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition-colors duration-150",
              active ? "bg-primary-soft text-primary" : "text-text-muted"
            )}
          >
            <Icon size={18} />
            {item.label}
          </InstantLink>
        );
      })}
    </nav>
  );
}
