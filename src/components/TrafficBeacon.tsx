"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * First-party visit beacon. Generates a stable per-browser id (localStorage)
 * and pings /api/track on each public page view, so the admin can compare
 * total site traffic against the LeadPipe-identified subset. Admin pages are
 * skipped so our own usage isn't counted. Fully fire-and-forget.
 */
export default function TrafficBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    try {
      let vid = localStorage.getItem("pdf_vid");
      if (!vid) {
        vid =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem("pdf_vid", vid);
      }
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor_id: vid, path: pathname }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
