"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Visitor = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  job_title: string | null;
  seniority: string | null;
  linkedin_url: string | null;
  company_name: string | null;
  company_domain: string | null;
  company_industry: string | null;
  company_size: string | null;
  company_revenue: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  first_page: string | null;
  last_page: string | null;
  pages_viewed: string[] | null;
  referrer: string | null;
  visit_duration: number | null;
  visit_count: number;
  identified_at: string | null;
  last_seen_at: string | null;
  status: string;
  reviewed_by: string | null;
  linked_investor_id: string | null;
  notes: string | null;
};

type Summary = { total: number; new: number; thisWeek: number; companies: number };

const STATUSES = ["all", "new", "reviewed", "contacted", "promoted", "dismissed"];

const statusBadge: Record<string, string> = {
  new: "bg-amber-50 text-amber-700 ring-amber-200",
  reviewed: "bg-sky-50 text-sky-700 ring-sky-200",
  contacted: "bg-violet-50 text-violet-700 ring-violet-200",
  promoted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  dismissed: "bg-slate-100 text-slate-500 ring-slate-200",
};

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "—";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fullName(v: Visitor) {
  const n = `${v.first_name || ""} ${v.last_name || ""}`.trim();
  return n || v.email || "Unknown visitor";
}

function location(v: Visitor) {
  return [v.city, v.state, v.country].filter(Boolean).join(", ") || "—";
}

export default function VisitorsSection() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Visitor | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [addingLead, setAddingLead] = useState(false);

  const fetchVisitors = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/admin/visitors?${params}`);
    if (res.ok) {
      const data = await res.json();
      setVisitors(data.visitors || []);
      setSummary(data.summary || null);
    }
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  async function patchVisitor(id: string, updates: Partial<Visitor>) {
    const res = await fetch("/api/admin/visitors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) {
      const updated = await res.json();
      setVisitors((prev) => prev.map((v) => (v.id === id ? { ...v, ...updated } : v)));
      if (detail?.id === id) setDetail((prev) => (prev ? { ...prev, ...updated } : prev));
      fetchVisitors();
    }
  }

  async function handleAddLead(v: Visitor) {
    setAddingLead(true);
    try {
      const res = await fetch("/api/admin/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_lead", id: v.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setDetail((prev) =>
          prev ? { ...prev, status: "promoted", linked_investor_id: data.investorId } : prev
        );
        fetchVisitors();
      } else {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        alert(err.error || "Could not add as lead");
      }
    } catch (e) {
      alert(`Network error: ${e instanceof Error ? e.message : "try again"}`);
    }
    setAddingLead(false);
  }

  function openDetail(v: Visitor) {
    setDetail(v);
    setNotesDraft(v.notes || "");
  }

  async function saveNotes() {
    if (!detail) return;
    setSavingNotes(true);
    await patchVisitor(detail.id, { notes: notesDraft });
    setSavingNotes(false);
  }

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Identified Visitors", value: summary?.total ?? "—", sub: "all time" },
          { label: "New / Unreviewed", value: summary?.new ?? "—", sub: "need triage" },
          { label: "Active This Week", value: summary?.thisWeek ?? "—", sub: "last 7 days" },
          { label: "Companies", value: summary?.companies ?? "—", sub: "distinct orgs" },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-2xl font-semibold text-slate-900">{m.value}</p>
            <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search name, email, company, title..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
          {STATUSES.map((s) => (<option key={s} value={s}>{s === "all" ? "All Statuses" : s[0].toUpperCase() + s.slice(1)}</option>))}
        </select>
        <span className="ml-auto text-sm text-slate-500">{visitors.length} shown</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>
      ) : visitors.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">No identified visitors yet. Once the LeadPipe pixel is live and the webhook is connected, resolved visitors will appear here for review.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Visitor</th>
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Pages</th>
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Seen</th>
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr key={v.id} onClick={() => openDetail(v)} className="border-b border-slate-100 cursor-pointer hover:bg-slate-50/50 transition-colors">
                    <td className="p-3">
                      <p className="font-medium text-slate-900">{fullName(v)}</p>
                      <p className="text-xs text-slate-400">{v.company_name || v.email || "—"}</p>
                    </td>
                    <td className="p-3 text-slate-500 text-xs max-w-[180px] truncate">{v.job_title || "—"}</td>
                    <td className="p-3 text-slate-500 text-xs">{location(v)}</td>
                    <td className="p-3 text-center font-mono text-xs text-slate-600">{Array.isArray(v.pages_viewed) ? v.pages_viewed.length : "—"}</td>
                    <td className="p-3 text-slate-500 text-xs whitespace-nowrap">{timeAgo(v.last_seen_at)}</td>
                    <td className="p-3"><span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${statusBadge[v.status] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail slide-over */}
      <AnimatePresence>
        {detail && (
          <>
            <motion.div className="fixed inset-0 bg-black/20 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)} />
            <motion.div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-200 z-50 overflow-y-auto shadow-xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-900 truncate">{fullName(detail)}</h2>
                  <p className="text-xs text-slate-400">{detail.job_title ? `${detail.job_title} · ` : ""}{detail.company_name || "—"}</p>
                </div>
                <button onClick={() => setDetail(null)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${statusBadge[detail.status] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>{detail.status}</span>
                  {detail.visit_count > 1 && <span className="text-xs text-slate-400">{detail.visit_count} visits</span>}
                  {detail.linked_investor_id && <span className="text-[10px] font-medium text-emerald-600">In CRM</span>}
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Email", value: detail.email },
                    { label: "Phone", value: detail.phone },
                    { label: "Seniority", value: detail.seniority },
                    { label: "Location", value: location(detail) },
                    { label: "Industry", value: detail.company_industry },
                    { label: "Company Size", value: detail.company_size },
                  ].map((f) => (
                    <div key={f.label}><p className="text-xs text-slate-400 mb-0.5">{f.label}</p><p className="text-sm text-slate-900 break-words">{f.value || "—"}</p></div>
                  ))}
                </div>

                {(detail.linkedin_url || detail.company_domain) && (
                  <div className="flex flex-wrap gap-3">
                    {detail.linkedin_url && <a href={detail.linkedin_url.startsWith("http") ? detail.linkedin_url : `https://${detail.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 underline">LinkedIn ↗</a>}
                    {detail.company_domain && <a href={`https://${detail.company_domain.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 underline">Company site ↗</a>}
                  </div>
                )}

                {/* Behavior */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">On-Site Activity</p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div><p className="text-xs text-slate-400 mb-0.5">First Identified</p><p className="text-sm text-slate-900">{timeAgo(detail.identified_at)}</p></div>
                    <div><p className="text-xs text-slate-400 mb-0.5">Referrer</p><p className="text-sm text-slate-900 break-words">{detail.referrer || "—"}</p></div>
                  </div>
                  {Array.isArray(detail.pages_viewed) && detail.pages_viewed.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Pages viewed ({detail.pages_viewed.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.pages_viewed.map((p, i) => (<span key={i} className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-100 text-slate-600">{p}</span>))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Review</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["new", "reviewed", "contacted", "dismissed"].map((s) => (
                      <button key={s} onClick={() => patchVisitor(detail.id, { status: s })} className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${detail.status === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>{s[0].toUpperCase() + s.slice(1)}</button>
                    ))}
                  </div>
                  {detail.linked_investor_id ? (
                    <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700 font-medium">Added to the CRM as a lead.</div>
                  ) : (
                    <button onClick={() => handleAddLead(detail)} disabled={addingLead} className="w-full px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 disabled:opacity-40 transition-colors">{addingLead ? "Adding…" : "Add as Lead (create CRM contact)"}</button>
                  )}
                </div>

                {/* Notes */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</p>
                    <button onClick={saveNotes} disabled={savingNotes} className="text-xs text-slate-900 font-medium hover:text-slate-700 disabled:opacity-40">{savingNotes ? "Saving…" : "Save"}</button>
                  </div>
                  <textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={4} placeholder="Research notes, who they might be, fit assessment…" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" />
                  {detail.reviewed_by && <p className="text-[10px] text-slate-400 mt-1">Last reviewed by {detail.reviewed_by.split("@")[0]}</p>}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
