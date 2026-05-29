"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckSquare, FileText, Bot, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/content/approval", label: "Duyệt", icon: FileText },
  { href: "/ai-assistant", label: "AI", icon: Bot },
  { href: "/settings", label: "Cài đặt", icon: Settings }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-3xl border border-border bg-white p-2 shadow-soft xl:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold",
              active ? "bg-primary-soft text-primary" : "text-text-muted"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
