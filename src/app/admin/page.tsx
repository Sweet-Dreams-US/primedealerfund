"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Investor = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  friend_of_ralph: boolean;
  category: string;
  last_contact_date: string | null;
  next_action: string | null;
  next_action_date: string | null;
  amount_of_interest: number;
  amount_invested: number;
  zoom_scheduled: boolean;
  zoom_completed: boolean;
  docs_sent: boolean;
  invested: boolean;
  notes: string | null;
  email_sequence: number;
  preferred_tone: string | null;
  added_date: string | null;
  source: string;
};

type CommLog = {
  id: string;
  investor_id: string | null;
  date: string;
  type: string;
  subject: string | null;
  response: string | null;
  next_step: string | null;
  investors: { first_name: string; last_name: string | null; email: string | null } | null;
};

type Stats = {
  totalInvestors: number;
  categories: Record<string, number>;
  totalInterest: number;
  totalInvested: number;
  currentInvestors: number;
  zoomsCompleted: number;
  friendsOfRalph: number;
  newFormCount: number;
};

const SECTIONS = ["Overview", "Investors", "Communications"] as const;
type Section = (typeof SECTIONS)[number];

const CATEGORIES = [
  "all",
  "Never Responded",
  "Had Zoom - No Commitment",
  "Friend - Possible Investor",
  "Current Investor",
  "New Lead",
];

const categoryBadge: Record<string, string> = {
  "Never Responded": "bg-slate-100 text-slate-600 ring-slate-200",
  "Had Zoom - No Commitment": "bg-sky-50 text-sky-700 ring-sky-200",
  "Friend - Possible Investor": "bg-violet-50 text-violet-700 ring-violet-200",
  "Current Investor": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "New Lead": "bg-amber-50 text-amber-700 ring-amber-200",
};

const commTypeBadge: Record<string, string> = {
  Email: "bg-sky-50 text-sky-700",
  "Zoom Meeting": "bg-violet-50 text-violet-700",
  "Phone Call": "bg-emerald-50 text-emerald-700",
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function StatusDot({ active, color = "emerald" }: { active: boolean; color?: string }) {
  if (!active) return <span className="text-slate-300">-</span>;
  const colors: Record<string, string> = {
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[color]}`} />;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("Overview");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [allInvestors, setAllInvestors] = useState<Investor[]>([]);
  const [comms, setComms] = useState<CommLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [friendFilter, setFriendFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Email composer
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipientDropdown, setRecipientDropdown] = useState(false);
  const recipientInputRef = useRef<HTMLInputElement>(null);

  // Detail panel
  const [detailInvestor, setDetailInvestor] = useState<Investor | null>(null);
  const [detailComms, setDetailComms] = useState<CommLog[]>([]);

  // Edit mode
  const [editingNotes, setEditingNotes] = useState(false);
  const [editNotes, setEditNotes] = useState("");

  const fetchInvestors = useCallback(async () => {
    const params = new URLSearchParams();
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (search) params.set("search", search);
    if (friendFilter) params.set("friendOfRalph", "true");
    const res = await fetch(`/api/admin/investors?${params}`);
    if (res.ok) setInvestors(await res.json());
  }, [categoryFilter, search, friendFilter]);

  const fetchAllInvestors = useCallback(async () => {
    const res = await fetch("/api/admin/investors");
    if (res.ok) setAllInvestors(await res.json());
  }, []);

  const fetchComms = useCallback(async (investorId?: string) => {
    const params = investorId ? `?investorId=${investorId}` : "";
    const res = await fetch(`/api/admin/communications${params}`);
    if (res.ok) {
      const data = await res.json();
      if (investorId) setDetailComms(data);
      else setComms(data);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  useEffect(() => {
    Promise.all([fetchStats(), fetchInvestors(), fetchAllInvestors()]).then(() => setLoading(false));
  }, [fetchStats, fetchInvestors, fetchAllInvestors]);

  useEffect(() => {
    if (section === "Communications") fetchComms();
  }, [section, fetchComms]);

  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors]);

  // Recipient search results
  const recipientResults = useMemo(() => {
    if (!recipientSearch.trim()) return [];
    const q = recipientSearch.toLowerCase();
    return allInvestors
      .filter((i) => !selectedIds.has(i.id))
      .filter((i) => {
        const name = `${i.first_name} ${i.last_name || ""}`.toLowerCase();
        return name.includes(q) || (i.email || "").toLowerCase().includes(q);
      })
      .slice(0, 8);
  }, [recipientSearch, allInvestors, selectedIds]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === investors.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(investors.map((i) => i.id)));
  }

  function addRecipient(id: string) {
    setSelectedIds((prev) => new Set(prev).add(id));
    setRecipientSearch("");
    setRecipientDropdown(false);
    recipientInputRef.current?.focus();
  }

  function addAllByCategory(cat: string) {
    const ids = allInvestors.filter((i) => i.category === cat && i.email).map((i) => i.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }

  async function handleSendEmail() {
    if (!emailSubject || !emailBody || selectedIds.size === 0) return;
    setSending(true);
    setSendResult(null);
    const res = await fetch("/api/admin/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientIds: Array.from(selectedIds), subject: emailSubject, body: emailBody }),
    });
    if (res.ok) {
      const result = await res.json();
      setSendResult(result);
      setEmailSubject("");
      setEmailBody("");
      setSelectedIds(new Set());
    }
    setSending(false);
  }

  async function updateInvestor(id: string, updates: Partial<Investor>) {
    await fetch("/api/admin/investors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchInvestors();
    if (detailInvestor?.id === id) {
      setDetailInvestor((prev) => prev ? { ...prev, ...updates } : prev);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function openDetail(inv: Investor) {
    setDetailInvestor(inv);
    setEditingNotes(false);
    fetchComms(inv.id);
  }

  function closeDetail() {
    setDetailInvestor(null);
    setDetailComms([]);
    setEditingNotes(false);
  }

  async function saveNotes() {
    if (!detailInvestor) return;
    await updateInvestor(detailInvestor.id, { notes: editNotes });
    setEditingNotes(false);
  }

  const selectedInvestors = allInvestors.filter((i) => selectedIds.has(i.id));
  const hasEmailRecipients = selectedInvestors.some((i) => i.email);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png"
                alt="Prime Dealer Equity Fund"
                width={120}
                height={48}
                className="h-7 w-auto"
              />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </div>
            <nav className="flex items-center gap-1 ml-4">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    section === s
                      ? "bg-slate-900 text-white font-medium"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEmailOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Compose{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
            </button>
            <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-6">
        {/* ═══════════ OVERVIEW ═══════════ */}
        {section === "Overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Contacts", value: stats.totalInvestors, sub: `${stats.friendsOfRalph} friends of Ralph` },
                { label: "Current Investors", value: stats.currentInvestors, sub: "committed capital" },
                { label: "Pipeline Value", value: fmt(stats.totalInterest), sub: "total interest expressed" },
                { label: "Capital Invested", value: fmt(stats.totalInvested), sub: "capital received" },
                { label: "Zooms Completed", value: stats.zoomsCompleted, sub: "meetings held" },
                { label: "New Submissions", value: stats.newFormCount, sub: "form submissions" },
              ].map((m) => (
                <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{m.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{m.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pipeline breakdown */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Pipeline by Category</h3>
                <div className="space-y-3">
                  {Object.entries(stats.categories)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, count]) => {
                      const pct = Math.round((count / stats.totalInvestors) * 100);
                      return (
                        <div key={cat} className="group">
                          <div className="flex items-center justify-between mb-1">
                            <button
                              onClick={() => { setCategoryFilter(cat); setSection("Investors"); }}
                              className="text-sm text-slate-600 hover:text-slate-900 transition-colors text-left"
                            >
                              {cat}
                            </button>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => { addAllByCategory(cat); setEmailOpen(true); }}
                                className="text-xs text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Email all
                              </button>
                              <span className="text-sm font-medium text-slate-900">{count}</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-slate-900 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "New Email", action: () => setEmailOpen(true), desc: "Pick recipients & compose", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
                    { label: "View Investors", action: () => { setCategoryFilter("all"); setSection("Investors"); }, desc: "Full contact list", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
                    { label: "Activity Log", action: () => setSection("Communications"), desc: "Recent communications", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
                    { label: "New Leads", action: () => { setCategoryFilter("New Lead"); setSection("Investors"); }, desc: "Uncontacted leads", icon: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" },
                  ].map((a) => (
                    <button
                      key={a.label}
                      onClick={a.action}
                      className="text-left p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group flex items-start gap-3"
                    >
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={a.icon} />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{a.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ INVESTORS ═══════════ */}
        {section === "Investors" && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={friendFilter}
                  onChange={(e) => setFriendFilter(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                Friends of Ralph
              </label>
              <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
                <span>{investors.length} contacts</span>
                {selectedIds.size > 0 && (
                  <>
                    <span className="font-medium text-slate-900">{selectedIds.size} selected</span>
                    <button onClick={() => setSelectedIds(new Set())} className="text-slate-400 hover:text-slate-600">Clear</button>
                    <button
                      onClick={() => setEmailOpen(true)}
                      className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800"
                    >
                      Email selected
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="p-3 text-left w-10">
                        <input type="checkbox" checked={selectedIds.size === investors.length && investors.length > 0} onChange={selectAll} className="rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                      </th>
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="p-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Interest</th>
                      <th className="p-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Invested</th>
                      <th className="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Zoom</th>
                      <th className="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Docs</th>
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investors.map((inv) => (
                      <tr
                        key={inv.id}
                        className={`border-b border-slate-100 transition-colors cursor-pointer ${selectedIds.has(inv.id) ? "bg-slate-50" : "hover:bg-slate-50/50"}`}
                      >
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={selectedIds.has(inv.id)} onChange={() => toggleSelect(inv.id)} className="rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                        </td>
                        <td className="p-3" onClick={() => openDetail(inv)}>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                              {inv.first_name[0]}{(inv.last_name || "")[0] || ""}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{inv.first_name} {inv.last_name || ""}</p>
                              {inv.friend_of_ralph && <p className="text-[10px] text-violet-500 font-medium">Friend of Ralph</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-500" onClick={() => openDetail(inv)}>{inv.email || <span className="text-slate-300">-</span>}</td>
                        <td className="p-3" onClick={() => openDetail(inv)}>
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${categoryBadge[inv.category] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>{inv.category}</span>
                        </td>
                        <td className="p-3 text-right font-mono text-xs text-slate-600" onClick={() => openDetail(inv)}>{inv.amount_of_interest > 0 ? fmt(inv.amount_of_interest) : "-"}</td>
                        <td className="p-3 text-right font-mono text-xs text-emerald-600" onClick={() => openDetail(inv)}>{inv.amount_invested > 0 ? fmt(inv.amount_invested) : "-"}</td>
                        <td className="p-3 text-center" onClick={() => openDetail(inv)}>
                          {inv.zoom_completed ? <StatusDot active /> : inv.zoom_scheduled ? <StatusDot active color="amber" /> : <StatusDot active={false} />}
                        </td>
                        <td className="p-3 text-center" onClick={() => openDetail(inv)}><StatusDot active={inv.docs_sent} /></td>
                        <td className="p-3 text-slate-500 text-xs max-w-[180px] truncate" onClick={() => openDetail(inv)}>{inv.next_action || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ COMMUNICATIONS ═══════════ */}
        {section === "Communications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Communication Log</h2>
              <span className="text-sm text-slate-400">{comms.length} entries</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Investor</th>
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Response</th>
                      <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comms.map((c) => (
                      <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 text-slate-500 whitespace-nowrap">{c.date}</td>
                        <td className="p-3 text-slate-900 font-medium whitespace-nowrap">{c.investors ? `${c.investors.first_name} ${c.investors.last_name || ""}` : "-"}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${commTypeBadge[c.type] || "bg-slate-50 text-slate-600"}`}>{c.type}</span></td>
                        <td className="p-3 text-slate-600 max-w-[300px] truncate">{c.subject || "-"}</td>
                        <td className="p-3"><span className={`text-sm font-medium ${c.response === "Yes" ? "text-emerald-600" : c.response === "Pending" ? "text-amber-600" : "text-slate-400"}`}>{c.response || "-"}</span></td>
                        <td className="p-3 text-slate-500 max-w-[200px] truncate">{c.next_step || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═══════════ INVESTOR DETAIL SLIDE-OVER ═══════════ */}
      <AnimatePresence>
        {detailInvestor && (
          <>
            <motion.div className="fixed inset-0 bg-black/20 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDetail} />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-200 z-50 overflow-y-auto shadow-xl"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                    {detailInvestor.first_name[0]}{(detailInvestor.last_name || "")[0] || ""}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{detailInvestor.first_name} {detailInvestor.last_name || ""}</h2>
                    <p className="text-xs text-slate-400">{detailInvestor.email || "No email"}</p>
                  </div>
                </div>
                <button onClick={closeDetail} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${categoryBadge[detailInvestor.category] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>{detailInvestor.category}</span>
                  {detailInvestor.friend_of_ralph && <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200">Friend of Ralph</span>}
                  {detailInvestor.invested && <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">Invested</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Phone", value: detailInvestor.phone },
                    { label: "Source", value: detailInvestor.source },
                    { label: "Interest", value: detailInvestor.amount_of_interest > 0 ? fmt(detailInvestor.amount_of_interest) : null },
                    { label: "Invested", value: detailInvestor.amount_invested > 0 ? fmt(detailInvestor.amount_invested) : null },
                    { label: "Added", value: detailInvestor.added_date },
                    { label: "Last Contact", value: detailInvestor.last_contact_date },
                    { label: "Email Sequence", value: `#${detailInvestor.email_sequence}` },
                    { label: "Preferred Tone", value: detailInvestor.preferred_tone },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                      <p className="text-sm text-slate-900">{f.value || "-"}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Progress</p>
                  <div className="flex items-center gap-2">
                    {[
                      { label: "Zoom Sched.", done: detailInvestor.zoom_scheduled, key: "zoom_scheduled" },
                      { label: "Zoom Done", done: detailInvestor.zoom_completed, key: "zoom_completed" },
                      { label: "Docs Sent", done: detailInvestor.docs_sent, key: "docs_sent" },
                      { label: "Invested", done: detailInvestor.invested, key: "invested" },
                    ].map((step) => (
                      <button
                        key={step.key}
                        onClick={() => updateInvestor(detailInvestor.id, { [step.key]: !step.done } as Partial<Investor>)}
                        className={`flex-1 text-center py-1.5 text-xs font-medium rounded-md border transition-colors ${
                          step.done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</p>
                  <select
                    value={detailInvestor.category}
                    onChange={(e) => updateInvestor(detailInvestor.id, { category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    {CATEGORIES.filter((c) => c !== "all").map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Next Action</p>
                  <p className="text-sm text-slate-900">{detailInvestor.next_action || "-"}</p>
                  {detailInvestor.next_action_date && <p className="text-xs text-slate-400 mt-1">Due: {detailInvestor.next_action_date}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</p>
                    {!editingNotes ? (
                      <button onClick={() => { setEditingNotes(true); setEditNotes(detailInvestor.notes || ""); }} className="text-xs text-slate-400 hover:text-slate-600">Edit</button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setEditingNotes(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                        <button onClick={saveNotes} className="text-xs text-slate-900 font-medium hover:text-slate-700">Save</button>
                      </div>
                    )}
                  </div>
                  {editingNotes ? (
                    <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={4} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" />
                  ) : (
                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{detailInvestor.notes || "No notes yet"}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Communication History</p>
                  {detailComms.length === 0 ? (
                    <p className="text-sm text-slate-400">No communications logged</p>
                  ) : (
                    <div className="space-y-3">
                      {detailComms.slice(0, 10).map((c) => (
                        <div key={c.id} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">{c.date}</span>
                              <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${commTypeBadge[c.type] || "bg-slate-50 text-slate-500"}`}>{c.type}</span>
                            </div>
                            <p className="text-slate-700 mt-0.5">{c.subject || "-"}</p>
                            {c.response && <p className="text-xs text-slate-400 mt-0.5">Response: {c.response}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {detailInvestor.email && (
                  <button
                    onClick={() => { setSelectedIds(new Set([detailInvestor.id])); setEmailOpen(true); closeDetail(); }}
                    className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Send Email to {detailInvestor.first_name}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ EMAIL COMPOSER SLIDE-OVER ═══════════ */}
      <AnimatePresence>
        {emailOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/20 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setEmailOpen(false); setSendResult(null); }} />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white border-l border-slate-200 z-50 shadow-xl flex flex-col"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-base font-semibold text-slate-900">Compose Email</h2>
                <button onClick={() => { setEmailOpen(false); setSendResult(null); }} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Recipient picker */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">To</label>

                  {/* Selected recipients */}
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-slate-50 rounded-t-lg border border-slate-200 border-b-0">
                    {selectedInvestors.map((i) => (
                      <span
                        key={i.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md border ${
                          i.email ? "bg-white text-slate-700 border-slate-200" : "bg-red-50 text-red-500 border-red-200 line-through"
                        }`}
                      >
                        {i.first_name} {i.last_name || ""}
                        {!i.email && <span className="text-[10px] no-underline">(no email)</span>}
                        <button onClick={() => toggleSelect(i.id)} className="ml-0.5 text-slate-400 hover:text-slate-600">&times;</button>
                      </span>
                    ))}
                    {selectedIds.size === 0 && <span className="text-xs text-slate-400 py-0.5">No recipients yet — search below to add</span>}
                  </div>

                  {/* Search to add */}
                  <div className="relative">
                    <input
                      ref={recipientInputRef}
                      type="text"
                      value={recipientSearch}
                      onChange={(e) => { setRecipientSearch(e.target.value); setRecipientDropdown(true); }}
                      onFocus={() => setRecipientDropdown(true)}
                      placeholder="Type a name or email to add..."
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-b-lg text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />

                    {/* Dropdown results */}
                    {recipientDropdown && recipientSearch.trim() && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        {recipientResults.length === 0 ? (
                          <div className="px-3 py-4 text-sm text-slate-400 text-center">No matches found</div>
                        ) : (
                          recipientResults.map((inv) => (
                            <button
                              key={inv.id}
                              onClick={() => addRecipient(inv.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
                            >
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                                {inv.first_name[0]}{(inv.last_name || "")[0] || ""}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900">{inv.first_name} {inv.last_name || ""}</p>
                                <p className="text-xs text-slate-400 truncate">{inv.email || "No email"} · {inv.category}</p>
                              </div>
                              {!inv.email && <span className="text-[10px] text-red-400 shrink-0">No email</span>}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick add by category */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Quick add:</span>
                    {CATEGORIES.filter((c) => c !== "all").map((cat) => (
                      <button
                        key={cat}
                        onClick={() => addAllByCategory(cat)}
                        className="text-[11px] text-slate-500 hover:text-slate-700 px-2 py-0.5 rounded border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                    <button
                      onClick={() => { const all = allInvestors.filter(i => i.email).map(i => i.id); setSelectedIds(new Set(all)); }}
                      className="text-[11px] text-slate-900 font-medium hover:text-slate-700 px-2 py-0.5 rounded border border-slate-300 hover:border-slate-400 transition-colors"
                    >
                      All with email
                    </button>
                  </div>

                  {!hasEmailRecipients && selectedIds.size > 0 && (
                    <p className="text-xs text-red-500 mt-1">None of the selected contacts have email addresses.</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Prime Dealer Fund — Quarterly Update"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
                  />
                </div>

                {/* Body */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Body</label>
                    <span className="text-[10px] text-slate-400">
                      Variables: {"{{first_name}}"} {"{{last_name}}"} {"{{full_name}}"}
                    </span>
                  </div>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={14}
                    placeholder={"Hi {{first_name}},\n\nI wanted to reach out regarding..."}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm resize-none"
                  />
                </div>

                {/* Send result */}
                <AnimatePresence>
                  {sendResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`p-4 rounded-lg border ${sendResult.failed === 0 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}
                    >
                      <p className="text-sm font-medium text-slate-900">
                        {sendResult.sent} email{sendResult.sent !== 1 ? "s" : ""} sent successfully
                        {sendResult.failed > 0 && <span className="text-red-600 ml-2">{sendResult.failed} failed</span>}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  From: invest@primedealerfund.com · {selectedInvestors.filter(i => i.email).length} valid recipients
                </p>
                <button
                  onClick={handleSendEmail}
                  disabled={sending || !hasEmailRecipients || !emailSubject || !emailBody}
                  className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
