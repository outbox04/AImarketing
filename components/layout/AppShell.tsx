import type { ReactNode } from "react";
import { MobileNav } from "./MobileNav";
import { NavigationFeedbackProvider } from "./NavigationFeedback";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <NavigationFeedbackProvider>
      <Sidebar />
      <Topbar />
      <main className="px-4 py-6 pb-28 xl:ml-72 xl:px-8 xl:pb-10">{children}</main>
      <MobileNav />
    </NavigationFeedbackProvider>
  );
}
