"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

/**
 * Table of contents for a post, built from its `##` headings.
 *  - lg and up: a small panel fixed in the top right corner.
 *  - Below lg: a bar fixed to the bottom with the current section and an arrow
 *    that opens the full list. The site's mobile call bar (#mobile-call-bar,
 *    from FloatingCTA) is measured so this bar always stacks above it.
 * Both show reading progress and mark the section being read. Both step aside
 * once the end of the article has scrolled past, so they never sit on the footer.
 */
export default function BlogContents({
  headings,
  targetId,
}: {
  headings: Heading[];
  targetId: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const art = document.getElementById(targetId);
      if (!art) return;
      const r = art.getBoundingClientRect();
      const vh = window.innerHeight;
      const max = r.height - vh;
      const p = max > 0 ? -r.top / max : r.bottom <= vh ? 1 : 0;
      setProgress(Math.min(1, Math.max(0, p)));
      setVisible(r.bottom > vh * 0.45);

      let current: string | null = null;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 150) current = h.id;
      }
      setActiveId(current);

      const bar = document.getElementById("mobile-call-bar");
      setOffset(bar ? bar.offsetHeight : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // the call bar mounts and unmounts as the reader scrolls; keep its height current
    const poll = window.setInterval(onScroll, 400);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(poll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [headings, targetId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  if (headings.length === 0) return null;

  const pct = Math.round(progress * 100);
  const current = headings.find((h) => h.id === activeId);

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Desktop panel */}
      <nav
        aria-label="Table of contents"
        className={`hidden lg:block fixed top-24 right-6 z-30 w-[14.5rem] max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-navy-800/70 bg-white/95 backdrop-blur shadow-lg shadow-black/5 p-4 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-gold-600 font-mono text-[10px] tracking-[0.2em] uppercase">
            In this article
          </p>
          <p className="text-navy-400 font-mono text-[10px] tracking-wider">{pct}%</p>
        </div>
        <div
          className="h-0.5 w-full rounded-full bg-navy-800 mb-3 overflow-hidden"
          role="progressbar"
          aria-label="Reading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div className="h-full bg-gold-400 transition-[width] duration-150" style={{ width: `${pct}%` }} />
        </div>
        <ul className="space-y-0.5">
          {headings.map((h) => {
            const on = h.id === activeId;
            return (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => jump(e, h.id)}
                  aria-current={on ? "true" : undefined}
                  className={`block border-l-2 pl-3 py-1.5 text-sm leading-snug transition-colors duration-200 ${
                    on
                      ? "border-gold-400 text-cream-50 font-medium"
                      : "border-transparent text-navy-400 hover:text-cream-100"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile: backdrop, then the bar (with its list) stacked above the call bar */}
      {open && visible && (
        <div
          className="lg:hidden fixed inset-0 z-[39] bg-black/30"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`lg:hidden fixed inset-x-0 z-[41] transition-[bottom,opacity] duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ bottom: offset }}
      >
        {open && (
          <div
            id="blog-contents-list"
            className="max-h-[55vh] overflow-y-auto rounded-t-2xl border border-b-0 border-navy-800/70 bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.12)] px-4 pt-4 pb-2"
          >
            <p className="text-gold-600 font-mono text-[10px] tracking-[0.2em] uppercase mb-2">
              In this article
            </p>
            <ul>
              {headings.map((h) => {
                const on = h.id === activeId;
                return (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => jump(e, h.id)}
                      aria-current={on ? "true" : undefined}
                      className={`block border-l-2 pl-3 py-2.5 text-[15px] leading-snug ${
                        on
                          ? "border-gold-400 text-cream-50 font-medium"
                          : "border-transparent text-navy-300"
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div
          className="border-t border-navy-800/70 bg-white/95 backdrop-blur shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
          style={offset ? undefined : { paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div
            className="h-0.5 w-full bg-navy-800"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div className="h-full bg-gold-400 transition-[width] duration-150" style={{ width: `${pct}%` }} />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="blog-contents-list"
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left"
          >
            <span className="flex-1 min-w-0">
              <span className="block text-navy-400 font-mono text-[10px] tracking-[0.15em] uppercase leading-none mb-1">
                {pct}% read
              </span>
              <span className="block truncate text-sm font-medium text-cream-50 leading-tight">
                {current ? current.text : "Contents"}
              </span>
            </span>
            <svg
              className={`w-5 h-5 shrink-0 text-gold-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            <span className="sr-only">{open ? "Close contents" : "Open contents"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
