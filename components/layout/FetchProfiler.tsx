"use client";

import { useEffect } from "react";

export default function FetchProfiler() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const debug = () => localStorage.getItem("debugDelay") === "1";
    const orig = window.fetch;

    window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
      try {
        const start = debug() && typeof performance !== "undefined" ? performance.now() : null;
        const res = await orig.call(this, input as any, init as any);
        if (start) {
          const dur = performance.now() - start;
          try {
            const url = typeof input === "string" ? input : (input as Request).url;
            console.log(`[debug-fetch] ${url} -> ${dur.toFixed(1)} ms`, { input, init, status: res.status });
          } catch (e) {
            console.log(`[debug-fetch] fetch -> ${dur.toFixed(1)} ms`, { status: res.status });
          }
        }
        return res;
      } catch (err) {
        if (typeof performance !== "undefined" && debug()) console.error("[debug-fetch] error", err);
        throw err;
      }
    };

    return () => {
      window.fetch = orig;
    };
  }, []);

  return null;
}
