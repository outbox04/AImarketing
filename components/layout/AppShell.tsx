"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";
import { NavigationFeedbackProvider } from "./NavigationFeedback";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import type { EmployeeProfile } from "@/types/employee";

export function AppShell({ children, currentUser }: { children: ReactNode; currentUser: EmployeeProfile | null }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <NavigationFeedbackProvider>
      {currentUser ? <Sidebar currentUser={currentUser} /> : null}
      {currentUser ? <Topbar currentUser={currentUser} /> : null}
      <main className="px-4 py-6 pb-28 xl:ml-72 xl:px-8 xl:pb-10">{children}</main>
      {currentUser ? <MobileNav currentUser={currentUser} /> : null}
    </NavigationFeedbackProvider>
  );
}
