"use client";

import { useState, useEffect, useMemo } from "react";

type Post = {
  slug: string;
  title: string;
  date: string;
  iso: string | null;
};

type BlogStats = {
  posts: Post[];
  summary: { published: number };
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthLabel(ym: string) {
  if (ym === "Undated") return "Undated";
  const [y, m] = ym.split("-");
  return `${MONTH_NAMES[Number(m) - 1]} ${y}`;
}

function dayLabel(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function AnalyticsSection() {
  const [data, setData] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/admin/blog-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: BlogStats | null) => {
        setData(d);
        if (d) {
          const years = Array.from(
            new Set(d.posts.map((p) => p.iso?.slice(0, 4)).filter(Boolean) as string[])
          )
            .sort()
            .reverse();
          setExpandedYears(new Set(years.slice(0, 2)));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Posts grouped year -> month, newest first.
  const postsByYear = useMemo(() => {
    if (!data) return [];
    const yearMap = new Map<string, Map<string, Post[]>>();
    for (const p of data.posts) {
      const year = p.iso ? p.iso.slice(0, 4) : "Undated";
      const ym = p.iso ? p.iso.slice(0, 7) : "Undated";
      if (!yearMap.has(year)) yearMap.set(year, new Map());
      const mm = yearMap.get(year)!;
      if (!mm.has(ym)) mm.set(ym, []);
      mm.get(ym)!.push(p);
    }
    return Array.from(yearMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([year, mm]) => ({
        year,
        count: Array.from(mm.values()).reduce((s, arr) => s + arr.length, 0),
        months: Array.from(mm.entries())
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([ym, posts]) => ({ ym, posts })),
      }));
  }, [data]);

  function toggleYear(year: string) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <p className="text-sm text-slate-400">Could not load content analytics.</p>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: "Published Posts", value: summary.published, sub: "live on /blog" }].map((m) => (
          <div
            key={m.label}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              {m.label}
            </p>
            <p className="text-2xl font-semibold text-slate-900">{m.value}</p>
            <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Blog release schedule */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Blog Releases</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every article that has been released on /blog. Later posts appear
            here on their release dates.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {postsByYear.map((yg) => {
            const open = expandedYears.has(yg.year);
            return (
              <div key={yg.year}>
                <button
                  onClick={() => toggleYear(yg.year)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Chevron open={open} />
                    <span className="text-sm font-semibold text-slate-900">{yg.year}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {yg.count} {yg.count === 1 ? "article" : "articles"}
                  </span>
                </button>
                {open && (
                  <div className="pb-2">
                    {yg.months.map((mg) => (
                      <div key={mg.ym} className="px-5 pb-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">
                          {monthLabel(mg.ym)}
                        </p>
                        <div className="space-y-1.5">
                          {mg.posts.map((p) => (
                            <div
                              key={p.slug}
                              className="flex items-center gap-3 py-1.5"
                            >
                              <span className="text-xs text-slate-400 w-24 shrink-0">
                                {dayLabel(p.iso)}
                              </span>
                              <a
                                href={`/blog/${p.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-slate-700 hover:text-slate-900 hover:underline flex-1 min-w-0 truncate"
                              >
                                {p.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Traffic note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-slate-700">
              Site traffic &amp; visitor analytics
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Page views, visitor counts, and top pages are tracked by Vercel
              Analytics. View the live traffic dashboard in the Vercel project
              under the Analytics tab. This panel covers content: the blog articles that
              have been released.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
