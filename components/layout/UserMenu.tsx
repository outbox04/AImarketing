"use client";

import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { permissionLabel } from "@/lib/auth/access";
import { departmentLabel } from "@/lib/auth/users";
import type { EmployeeProfile } from "@/types/employee";

export function UserMenu({ user }: { user: EmployeeProfile }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-2 py-1.5 shadow-sm">
      <div className="hidden items-center gap-2 px-1 md:flex">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary-soft text-primary">
          <UserRound size={16} />
        </div>
        <div className="leading-tight">
          <p className="text-xs font-bold text-text-main">{user.fullName}</p>
          <p className="text-[11px] font-semibold text-text-muted">{user.position} · {departmentLabel(user.department)}</p>
          <p className="max-w-56 truncate text-[11px] font-semibold text-text-soft">{user.accessLevel === "FULL" ? "Toan quyen" : user.permissions.map(permissionLabel).join(", ")}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" aria-label="Đăng xuất" onClick={logout}>
        <LogOut size={16} />
      </Button>
    </div>
  );
}
