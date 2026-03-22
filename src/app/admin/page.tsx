"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

const TABS = ["Dashboard", "Investors", "Communications", "Send Email"] as const;
type Tab = (typeof TABS)[number];

const CATEGORIES = [
  "all",
  "Never Responded",
  "Had Zoom - No Commitment",
  "Friend - Possible Investor",
  "Current Investor",
  "New Lead",
];

const categoryColors: Record<string, string> = {
  "Never Responded": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  "Had Zoom - No Commitment": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Friend - Possible Investor": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Current Investor": "bg-green-500/20 text-green-300 border-green-500/30",
  "New Lead": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Dashboard");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [comms, setComms] = useState<CommLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [friendFilter, setFriendFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Email state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null);

  const fetchInvestors = useCallback(async () => {
    const params = new URLSearchParams();
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (search) params.set("search", search);
    if (friendFilter) params.set("friendOfRalph", "true");

    const res = await fetch(`/api/admin/investors?${params}`);
    if (res.ok) setInvestors(await res.json());
  }, [categoryFilter, search, friendFilter]);

  const fetchComms = useCallback(async (investorId?: string) => {
    const params = investorId ? `?investorId=${investorId}` : "";
    const res = await fetch(`/api/admin/communications${params}`);
    if (res.ok) setComms(await res.json());
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  useEffect(() => {
    Promise.all([fetchStats(), fetchInvestors()]).then(() => setLoading(false));
  }, [fetchStats, fetchInvestors]);

  useEffect(() => {
    if (tab === "Communications") fetchComms();
  }, [tab, fetchComms]);

  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === investors.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(investors.map((i) => i.id)));
    }
  }

  async function handleSendEmail() {
    if (!emailSubject || !emailBody || selectedIds.size === 0) return;
    setSending(true);
    setSendResult(null);

    const res = await fetch("/api/admin/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientIds: Array.from(selectedIds),
        subject: emailSubject,
        body: emailBody,
      }),
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
  }

  function handleLogout() {
    document.cookie = "admin_token=; path=/; max-age=0";
    document.cookie = "admin_email=; path=/; max-age=0";
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4a853] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white">
      {/* Header */}
      <header className="bg-[#1a1a2e] border-b border-[#2d2d44] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png"
              alt="Prime Dealer Equity Fund"
              width={120}
              height={48}
              className="h-8 w-auto"
            />
            <span className="text-[#d4a853] font-mono text-xs tracking-wider uppercase border border-[#d4a853]/20 px-2 py-0.5 rounded">
              Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#6b7280] hover:text-white text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-[#1a1a2e]/50 border-b border-[#2d2d44]">
        <div className="max-w-[1600px] mx-auto px-6 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                tab === t
                  ? "text-[#d4a853]"
                  : "text-[#6b7280] hover:text-white"
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4a853]" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* ============ DASHBOARD TAB ============ */}
        {tab === "Dashboard" && stats && (
          <div className="space-y-8">
            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Contacts", value: stats.totalInvestors },
                { label: "Current Investors", value: stats.currentInvestors },
                { label: "Pipeline Value", value: formatCurrency(stats.totalInterest) },
                { label: "Capital Invested", value: formatCurrency(stats.totalInvested) },
                { label: "Zooms Completed", value: stats.zoomsCompleted },
                { label: "Friends of Ralph", value: stats.friendsOfRalph },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl p-5"
                >
                  <p className="text-[#6b7280] text-xs font-mono uppercase tracking-wider mb-2">
                    {m.label}
                  </p>
                  <p className="text-2xl font-bold text-white">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl p-6">
              <h3 className="text-sm font-mono uppercase tracking-wider text-[#9ca3af] mb-4">
                Pipeline by Category
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.categories)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, count]) => {
                    const pct = ((count / stats.totalInvestors) * 100).toFixed(0);
                    return (
                      <div key={cat} className="flex items-center gap-4">
                        <span className="text-sm text-[#9ca3af] w-56 truncate">{cat}</span>
                        <div className="flex-1 h-2 bg-[#2d2d44] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#d4a853] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-white w-16 text-right">
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ============ INVESTORS TAB ============ */}
        {tab === "Investors" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search name, email, notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white placeholder-[#4b5563] focus:border-[#d4a853] focus:outline-none text-sm w-72"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white text-sm focus:border-[#d4a853] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Categories" : c}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-[#9ca3af] cursor-pointer">
                <input
                  type="checkbox"
                  checked={friendFilter}
                  onChange={(e) => setFriendFilter(e.target.checked)}
                  className="accent-[#d4a853]"
                />
                Friends of Ralph
              </label>
              <span className="text-[#6b7280] text-sm ml-auto">
                {investors.length} results
                {selectedIds.size > 0 && (
                  <span className="text-[#d4a853] ml-2">
                    ({selectedIds.size} selected)
                  </span>
                )}
              </span>
              {selectedIds.size > 0 && (
                <button
                  onClick={() => {
                    setTab("Send Email");
                  }}
                  className="px-4 py-2 bg-[#d4a853] text-[#1a1a2e] rounded-lg text-sm font-semibold hover:bg-[#e0b96a] transition-colors"
                >
                  Email Selected ({selectedIds.size})
                </button>
              )}
            </div>

            {/* Table */}
            <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2d2d44] text-[#6b7280] text-xs font-mono uppercase tracking-wider">
                      <th className="p-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === investors.length && investors.length > 0}
                          onChange={selectAll}
                          className="accent-[#d4a853]"
                        />
                      </th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Interest</th>
                      <th className="p-3 text-left">Invested</th>
                      <th className="p-3 text-center">Zoom</th>
                      <th className="p-3 text-center">Docs</th>
                      <th className="p-3 text-left">Next Action</th>
                      <th className="p-3 text-left">Last Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investors.map((inv) => (
                      <>
                        <tr
                          key={inv.id}
                          onClick={() =>
                            setExpandedId(expandedId === inv.id ? null : inv.id)
                          }
                          className={`border-b border-[#2d2d44]/50 hover:bg-[#2d2d44]/20 cursor-pointer transition-colors ${
                            expandedId === inv.id ? "bg-[#2d2d44]/30" : ""
                          }`}
                        >
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.has(inv.id)}
                              onChange={() => toggleSelect(inv.id)}
                              className="accent-[#d4a853]"
                            />
                          </td>
                          <td className="p-3 font-medium text-white whitespace-nowrap">
                            {inv.first_name} {inv.last_name || ""}
                            {inv.friend_of_ralph && (
                              <span className="ml-1.5 text-purple-400 text-xs">
                                (Friend)
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-[#9ca3af]">{inv.email || "—"}</td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 text-xs rounded-full border ${
                                categoryColors[inv.category] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
                              }`}
                            >
                              {inv.category}
                            </span>
                          </td>
                          <td className="p-3 text-[#d4a853] font-mono text-xs">
                            {inv.amount_of_interest > 0
                              ? formatCurrency(inv.amount_of_interest)
                              : "—"}
                          </td>
                          <td className="p-3 text-green-400 font-mono text-xs">
                            {inv.amount_invested > 0
                              ? formatCurrency(inv.amount_invested)
                              : "—"}
                          </td>
                          <td className="p-3 text-center">
                            {inv.zoom_completed ? (
                              <span className="text-green-400">&#10003;</span>
                            ) : inv.zoom_scheduled ? (
                              <span className="text-yellow-400">&#9679;</span>
                            ) : (
                              <span className="text-[#4b5563]">—</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {inv.docs_sent ? (
                              <span className="text-green-400">&#10003;</span>
                            ) : (
                              <span className="text-[#4b5563]">—</span>
                            )}
                          </td>
                          <td className="p-3 text-[#9ca3af] text-xs max-w-[200px] truncate">
                            {inv.next_action || "—"}
                          </td>
                          <td className="p-3 text-[#6b7280] text-xs whitespace-nowrap">
                            {inv.last_contact_date || "—"}
                          </td>
                        </tr>

                        {/* Expanded detail row */}
                        {expandedId === inv.id && (
                          <tr key={`${inv.id}-detail`} className="bg-[#2d2d44]/20">
                            <td colSpan={10} className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#d4a853] mb-2">
                                    Contact Info
                                  </h4>
                                  <p className="text-sm">
                                    <span className="text-[#6b7280]">Phone:</span>{" "}
                                    <span className="text-white">{inv.phone || "—"}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-[#6b7280]">Added:</span>{" "}
                                    <span className="text-white">{inv.added_date || "—"}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-[#6b7280]">Source:</span>{" "}
                                    <span className="text-white">{inv.source}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-[#6b7280]">Email Seq:</span>{" "}
                                    <span className="text-white">#{inv.email_sequence}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-[#6b7280]">Tone:</span>{" "}
                                    <span className="text-white">{inv.preferred_tone || "—"}</span>
                                  </p>
                                </div>
                                <div className="space-y-3">
                                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#d4a853] mb-2">
                                    Status
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {[
                                      { label: "Zoom Scheduled", val: inv.zoom_scheduled },
                                      { label: "Zoom Completed", val: inv.zoom_completed },
                                      { label: "Docs Sent", val: inv.docs_sent },
                                      { label: "Invested", val: inv.invested },
                                      { label: "Friend of Ralph", val: inv.friend_of_ralph },
                                    ].map((s) => (
                                      <span
                                        key={s.label}
                                        className={`px-2 py-1 text-xs rounded border ${
                                          s.val
                                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                                            : "bg-[#2d2d44] text-[#6b7280] border-[#3d3d55]"
                                        }`}
                                      >
                                        {s.label}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="mt-4">
                                    <label className="text-xs text-[#6b7280] block mb-1">
                                      Update Category
                                    </label>
                                    <select
                                      value={inv.category}
                                      onChange={(e) =>
                                        updateInvestor(inv.id, { category: e.target.value } as Partial<Investor>)
                                      }
                                      className="px-3 py-1.5 bg-[#1a1a2e] border border-[#2d2d44] rounded text-white text-sm"
                                    >
                                      {CATEGORIES.filter((c) => c !== "all").map((c) => (
                                        <option key={c} value={c}>
                                          {c}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#d4a853] mb-2">
                                    Notes
                                  </h4>
                                  <p className="text-sm text-[#9ca3af] leading-relaxed whitespace-pre-wrap">
                                    {inv.notes || "No notes"}
                                  </p>
                                  <div className="mt-4">
                                    <p className="text-sm">
                                      <span className="text-[#6b7280]">Next Action:</span>{" "}
                                      <span className="text-white">
                                        {inv.next_action || "—"}
                                      </span>
                                    </p>
                                    <p className="text-sm mt-1">
                                      <span className="text-[#6b7280]">Action Date:</span>{" "}
                                      <span className="text-white">
                                        {inv.next_action_date || "—"}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============ COMMUNICATIONS TAB ============ */}
        {tab === "Communications" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Communication Log</h2>
            <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2d2d44] text-[#6b7280] text-xs font-mono uppercase tracking-wider">
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Investor</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Subject</th>
                      <th className="p-3 text-left">Response</th>
                      <th className="p-3 text-left">Next Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comms.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-[#2d2d44]/50 hover:bg-[#2d2d44]/20"
                      >
                        <td className="p-3 text-[#9ca3af] whitespace-nowrap">{c.date}</td>
                        <td className="p-3 text-white whitespace-nowrap">
                          {c.investors
                            ? `${c.investors.first_name} ${c.investors.last_name || ""}`
                            : "—"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full border ${
                              c.type === "Email"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                : c.type === "Zoom Meeting"
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                : c.type === "Phone Call"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                            }`}
                          >
                            {c.type}
                          </span>
                        </td>
                        <td className="p-3 text-[#9ca3af] max-w-[300px] truncate">
                          {c.subject || "—"}
                        </td>
                        <td className="p-3">
                          <span
                            className={
                              c.response === "Yes"
                                ? "text-green-400"
                                : c.response === "Pending"
                                ? "text-yellow-400"
                                : "text-[#6b7280]"
                            }
                          >
                            {c.response || "—"}
                          </span>
                        </td>
                        <td className="p-3 text-[#9ca3af] max-w-[200px] truncate">
                          {c.next_step || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============ SEND EMAIL TAB ============ */}
        {tab === "Send Email" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Send Email via Resend</h2>
              <p className="text-[#6b7280] text-sm">
                Select investors from the Investors tab, then compose your email here.
                Use {"{{first_name}}"}, {"{{last_name}}"}, {"{{full_name}}"} for personalization.
              </p>
            </div>

            <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-[#9ca3af] text-xs font-mono uppercase tracking-wider mb-2">
                  Recipients ({selectedIds.size} selected)
                </label>
                {selectedIds.size === 0 ? (
                  <p className="text-[#4b5563] text-sm">
                    No recipients selected. Go to the Investors tab and check the contacts you want to email.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {investors
                      .filter((i) => selectedIds.has(i.id))
                      .slice(0, 20)
                      .map((i) => (
                        <span
                          key={i.id}
                          className="px-2 py-1 text-xs bg-[#2d2d44] rounded text-[#9ca3af] border border-[#3d3d55]"
                        >
                          {i.first_name} {i.last_name || ""}{" "}
                          {i.email ? `(${i.email})` : "(no email)"}
                        </span>
                      ))}
                    {selectedIds.size > 20 && (
                      <span className="text-[#6b7280] text-xs">
                        +{selectedIds.size - 20} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#9ca3af] text-xs font-mono uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. Prime Dealer Fund — Q1 2026 Update"
                  className="w-full px-4 py-3 bg-[#0f0f1e] border border-[#2d2d44] rounded-lg text-white placeholder-[#4b5563] focus:border-[#d4a853] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] text-xs font-mono uppercase tracking-wider mb-2">
                  Body (HTML supported)
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={12}
                  placeholder="<p>Hi {{first_name}},</p><p>We wanted to share...</p>"
                  className="w-full px-4 py-3 bg-[#0f0f1e] border border-[#2d2d44] rounded-lg text-white placeholder-[#4b5563] focus:border-[#d4a853] focus:outline-none font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSendEmail}
                  disabled={sending || selectedIds.size === 0 || !emailSubject || !emailBody}
                  className="px-6 py-3 bg-gradient-to-r from-[#d4a853] to-[#b8912a] text-[#1a1a2e] font-semibold rounded-lg hover:from-[#e0b96a] hover:to-[#c9a23b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending
                    ? "Sending..."
                    : `Send to ${selectedIds.size} Recipient${selectedIds.size !== 1 ? "s" : ""}`}
                </button>

                {sendResult && (
                  <p className="text-sm">
                    <span className="text-green-400">{sendResult.sent} sent</span>
                    {sendResult.failed > 0 && (
                      <span className="text-red-400 ml-2">
                        {sendResult.failed} failed
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
