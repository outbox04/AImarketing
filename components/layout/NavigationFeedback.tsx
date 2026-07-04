"use client";

import { createContext, type MouseEvent, type ReactNode, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type NavigationFeedbackContextValue = {
  optimisticPathname: string;
  isNavigating: boolean;
  navigate: (href: string) => void;
  prefetch: (href: string) => void;
};

const NavigationFeedbackContext = createContext<NavigationFeedbackContextValue | null>(null);

function normalizePathname(href: string) {
  if (!href.startsWith("/")) return href;
  return href.split("#")[0].split("?")[0] || "/";
}

export function NavigationFeedbackProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  useEffect(() => {
    if (!pendingHref) return;
    const timer = window.setTimeout(() => setPendingHref(null), 3000);
    return () => window.clearTimeout(timer);
  }, [pendingHref]);

  const value = useMemo<NavigationFeedbackContextValue>(
    () => ({
      optimisticPathname: normalizePathname(pendingHref ?? pathname),
      isNavigating: Boolean(pendingHref) || isPending,
      navigate: (href) => {
        if (!href.startsWith("/") || normalizePathname(href) === pathname) return;
        setPendingHref(href);
        startTransition(() => router.push(href));
      },
      prefetch: (href) => {
        if (href.startsWith("/")) router.prefetch(href);
      }
    }),
    [isPending, pathname, pendingHref, router]
  );

  return (
    <NavigationFeedbackContext.Provider value={value}>
      {value.isNavigating ? <div className="fixed inset-x-0 top-0 z-[70] h-0.5 overflow-hidden bg-primary/10"><div className="h-full w-1/2 animate-[nav-progress_900ms_ease-in-out_infinite] bg-primary" /></div> : null}
      {children}
    </NavigationFeedbackContext.Provider>
  );
}

export function useNavigationFeedback() {
  const context = useContext(NavigationFeedbackContext);
  if (!context) {
    throw new Error("useNavigationFeedback must be used inside NavigationFeedbackProvider");
  }
  return context;
}

type InstantLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

export function InstantLink({ href, className, children, "aria-label": ariaLabel }: InstantLinkProps) {
  const { navigate, prefetch } = useNavigationFeedback();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (!href.startsWith("/")) return;
    event.preventDefault();
    navigate(href);
  }

  return (
    <a
      aria-label={ariaLabel}
      className={cn("cursor-pointer", className)}
      href={href}
      onClick={handleClick}
      onFocus={() => prefetch(href)}
      onMouseEnter={() => prefetch(href)}
      onTouchStart={() => prefetch(href)}
    >
      {children}
    </a>
  );
}
