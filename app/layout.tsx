import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUser } from "@/lib/auth/session";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Marketing AI Assistant",
  description: "Marketing Operations Command Center for a one-person marketing team."
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell currentUser={currentUser}>{children}</AppShell>
      </body>
    </html>
  );
}
