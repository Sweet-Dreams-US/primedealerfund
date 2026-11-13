"use client";

import { useEffect, useState } from "react";

/**
 * Whether the blog has at least one released post. The nav only shows the Blog
 * link when it does. Most pages on this site are prerendered, so the answer is
 * read from /api/blog/status (which revalidates hourly) rather than baked into
 * the page: the link appears and disappears without a deploy.
 */
const FRESH_MS = 10 * 60 * 1000;
let cached: { value: boolean; at: number } | null = null;
let inflight: Promise<boolean> | null = null;

function load(): Promise<boolean> {
  if (cached && Date.now() - cached.at < FRESH_MS) return Promise.resolve(cached.value);
  if (!inflight) {
    // no-cache: the browser always asks the CDN, so a stale browser copy can never
    // keep the Blog link hidden (or shown) after the release state changes.
    inflight = fetch("/api/blog/status", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { released?: number } | null) => {
        const value = !!j && Number(j.released) > 0;
        if (j) cached = { value, at: Date.now() };
        return value;
      })
      .catch(() => false)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useBlogReleased(): boolean {
  const [released, setReleased] = useState(false);

  useEffect(() => {
    let alive = true;
    load().then((v) => {
      if (alive) setReleased(v);
    });
    return () => {
      alive = false;
    };
  }, []);

  return released;
}
