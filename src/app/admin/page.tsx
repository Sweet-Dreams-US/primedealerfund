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
  created_at?: string;
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

type OutlookMessage = {
  id: string;
  subject: string;
  bodyPreview: string;
  body: { contentType: string; content: string };
  from: { emailAddress: { name: string; address: string } };
  toRecipients: { emailAddress: { name: string; address: string } }[];
  ccRecipients: { emailAddress: { name: string; address: string } }[];
  receivedDateTime: string;
  sentDateTime: string;
  isRead: boolean;
  isDraft: boolean;
  hasAttachments: boolean;
  importance: string;
  flag: { flagStatus: string };
  conversationId: string;
  webLink: string;
};

type MailFolders = {
  inbox: { total: number; unread: number };
  drafts: { total: number };
  sentItems: { total: number };
};

const SECTIONS = ["Inbox", "Overview", "Investors", "Communications"] as const;
type Section = (typeof SECTIONS)[number];

const CATEGORIES = ["all", "Never Responded", "Had Zoom - No Commitment", "Friend - Possible Investor", "Current Investor", "New Lead"];

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
  const c: Record<string, string> = { emerald: "bg-emerald-400", amber: "bg-amber-400" };
  return <span className={`inline-block w-2 h-2 rounded-full ${c[color]}`} />;
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("Inbox");
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
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; error?: string } | null>(null);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipientDropdown, setRecipientDropdown] = useState(false);
  const recipientInputRef = useRef<HTMLInputElement>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [manualRecipients, setManualRecipients] = useState<{ name: string; address: string }[]>([]);
  const [manualEmailInput, setManualEmailInput] = useState("");

  // Detail panel
  const [detailInvestor, setDetailInvestor] = useState<Investor | null>(null);
  const [detailComms, setDetailComms] = useState<CommLog[]>([]);

  // Edit mode
  const [editingNotes, setEditingNotes] = useState(false);
  const [editNotes, setEditNotes] = useState("");

  // Add contact modal
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    first_name: "", last_name: "", email: "", phone: "", category: "New Lead",
    notes: "", source: "Admin Added", friend_of_ralph: false, amount_of_interest: 0,
  });
  const [addingContact, setAddingContact] = useState(false);

  // Settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Outlook inbox state
  const [outlookMessages, setOutlookMessages] = useState<OutlookMessage[]>([]);
  const [outlookFolder, setOutlookFolder] = useState<"inbox" | "drafts" | "sent">("inbox");
  const [outlookSearch, setOutlookSearch] = useState("");
  const [outlookLoading, setOutlookLoading] = useState(false);
  const [outlookError, setOutlookError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<OutlookMessage | null>(null);
  const [mailFolders, setMailFolders] = useState<MailFolders | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  // ── Helpers ──

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── Handlers ──

  async function handleChangePassword() {
    if (newPassword.length < 8) { setPasswordMsg({ type: "error", text: "Password must be at least 8 characters" }); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg({ type: "error", text: "Passwords do not match" }); return; }
    setChangingPassword(true);
    setPasswordMsg(null);
    const res = await fetch("/api/admin/auth/update-password", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: newPassword }),
    });
    if (res.ok) {
      setPasswordMsg({ type: "success", text: "Password updated successfully" });
      setNewPassword(""); setConfirmPassword("");
    } else {
      const data = await res.json();
      setPasswordMsg({ type: "error", text: data.error || "Failed to update password" });
    }
    setChangingPassword(false);
  }

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
      if (investorId) setDetailComms(data); else setComms(data);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  const fetchOutlookMessages = useCallback(async (folder?: string, searchQuery?: string) => {
    setOutlookLoading(true);
    setOutlookError(null);
    try {
      const f = folder || outlookFolder;
      const action = f === "drafts" ? "drafts" : f === "sent" ? "sent" : "inbox";
      const params = new URLSearchParams({ action, top: "30" });
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/outlook?${params}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load emails");
      }
      const data = await res.json();
      setOutlookMessages(data.messages || []);
    } catch (err) {
      setOutlookError(err instanceof Error ? err.message : "Failed to load emails");
      setOutlookMessages([]);
    }
    setOutlookLoading(false);
  }, [outlookFolder]);

  const fetchMailFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/outlook?action=folders");
      if (res.ok) setMailFolders(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    Promise.all([fetchStats(), fetchInvestors(), fetchAllInvestors()]).then(() => setLoading(false));
  }, [fetchStats, fetchInvestors, fetchAllInvestors]);

  useEffect(() => { if (section === "Communications") fetchComms(); }, [section, fetchComms]);
  useEffect(() => { fetchInvestors(); }, [fetchInvestors]);
  useEffect(() => {
    if (section === "Inbox") {
      fetchOutlookMessages();
      fetchMailFolders();
    }
  }, [section, fetchOutlookMessages, fetchMailFolders]);

  const recipientResults = useMemo(() => {
    if (!recipientSearch.trim()) return [];
    const q = recipientSearch.toLowerCase();
    return allInvestors
      .filter((i) => !selectedIds.has(i.id))
      .filter((i) => `${i.first_name} ${i.last_name || ""}`.toLowerCase().includes(q) || (i.email || "").toLowerCase().includes(q))
      .slice(0, 8);
  }, [recipientSearch, allInvestors, selectedIds]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
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
    setSelectedIds((prev) => { const n = new Set(prev); ids.forEach((id) => n.add(id)); return n; });
  }
  function addManualRecipient() {
    const email = (recipientSearch.trim() || manualEmailInput.trim());
    if (!email || !isValidEmail(email)) return;
    if (!manualRecipients.find((r) => r.address.toLowerCase() === email.toLowerCase())) {
      setManualRecipients((prev) => [...prev, { name: email.split("@")[0], address: email }]);
    }
    setRecipientSearch("");
    setManualEmailInput("");
    setRecipientDropdown(false);
    recipientInputRef.current?.focus();
  }
  function removeManualRecipient(address: string) {
    setManualRecipients((prev) => prev.filter((r) => r.address !== address));
  }

  async function handleSendEmail() {
    if (!emailSubject || !emailBody) return;
    const hasInvestorRecipients = selectedInvestors.some((i) => i.email);
    const hasManualRecipients = manualRecipients.length > 0;
    if (!hasInvestorRecipients && !hasManualRecipients) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientIds: Array.from(selectedIds),
          manualRecipients,
          subject: emailSubject,
          body: emailBody,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setSendResult(result);
        if (result.sent > 0) {
          setEmailSubject(""); setEmailBody(""); setSelectedIds(new Set()); setManualRecipients([]);
        }
      } else {
        setSendResult({ sent: 0, failed: 0, error: result.error || "Failed to send emails" });
      }
    } catch (err) {
      setSendResult({ sent: 0, failed: 0, error: `Network error: ${err instanceof Error ? err.message : String(err)}` });
    }
    setSending(false);
  }

  async function handleSaveAsDraft() {
    if (!emailSubject && !emailBody) return;
    setSavingDraft(true);
    setDraftSaved(false);
    const toRecipients = [
      ...selectedInvestors.filter((i) => i.email).map((i) => ({ name: `${i.first_name} ${i.last_name || ""}`.trim(), address: i.email! })),
      ...manualRecipients,
    ];
    try {
      const res = await fetch("/api/admin/outlook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-draft",
          subject: emailSubject,
          body: emailBody,
          bodyType: "Text",
          toRecipients,
        }),
      });
      if (res.ok) {
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 3000);
      }
    } catch { /* ignore */ }
    setSavingDraft(false);
  }

  async function handleMarkRead(msg: OutlookMessage, isRead: boolean) {
    try {
      await fetch("/api/admin/outlook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-read", messageId: msg.id, isRead }),
      });
      setOutlookMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, isRead } : m));
      if (selectedMessage?.id === msg.id) setSelectedMessage({ ...selectedMessage, isRead });
      fetchMailFolders();
    } catch { /* ignore */ }
  }

  async function handleReply() {
    if (!selectedMessage || !replyText.trim()) return;
    setReplying(true);
    try {
      await fetch("/api/admin/outlook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", messageId: selectedMessage.id, comment: replyText }),
      });
      setReplyText("");
      setReplyOpen(false);
      fetchOutlookMessages();
    } catch { /* ignore */ }
    setReplying(false);
  }

  async function updateInvestor(id: string, updates: Partial<Investor>) {
    await fetch("/api/admin/investors", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...updates }) });
    fetchInvestors(); fetchAllInvestors();
    if (detailInvestor?.id === id) setDetailInvestor((prev) => prev ? { ...prev, ...updates } : prev);
  }

  async function handleAddContact() {
    if (!newContact.first_name.trim()) return;
    setAddingContact(true);
    const res = await fetch("/api/admin/investors", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newContact),
    });
    if (res.ok) {
      setAddContactOpen(false);
      setNewContact({ first_name: "", last_name: "", email: "", phone: "", category: "New Lead", notes: "", source: "Admin Added", friend_of_ralph: false, amount_of_interest: 0 });
      fetchInvestors(); fetchAllInvestors(); fetchStats();
    }
    setAddingContact(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function openDetail(inv: Investor) { setDetailInvestor(inv); setEditingNotes(false); fetchComms(inv.id); }
  function closeDetail() { setDetailInvestor(null); setDetailComms([]); setEditingNotes(false); }
  async function saveNotes() { if (!detailInvestor) return; await updateInvestor(detailInvestor.id, { notes: editNotes }); setEditingNotes(false); }

  function openComposeToMessage(msg: OutlookMessage) {
    setEmailSubject(`Re: ${msg.subject}`);
    setEmailBody("");
    setManualRecipients([{ name: msg.from.emailAddress.name, address: msg.from.emailAddress.address }]);
    setSelectedIds(new Set());
    setSelectedMessage(null);
    setEmailOpen(true);
  }

  const selectedInvestors = allInvestors.filter((i) => selectedIds.has(i.id));
  const hasEmailRecipients = selectedInvestors.some((i) => i.email) || manualRecipients.length > 0;
  const totalRecipientCount = selectedInvestors.filter((i) => i.email).length + manualRecipients.length;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png" alt="Prime Dealer Equity Fund" width={120} height={48} className="h-7 w-auto" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">Admin</span>
            </div>
            <nav className="flex items-center gap-1 ml-4">
              {SECTIONS.map((s) => (
                <button key={s} onClick={() => setSection(s)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors relative ${section === s ? "bg-slate-900 text-white font-medium" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                >
                  {s}
                  {s === "Inbox" && mailFolders && mailFolders.inbox.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{mailFolders.inbox.unread > 9 ? "9+" : mailFolders.inbox.unread}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setAddContactOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Contact
            </button>
            <button onClick={() => { setEmailOpen(true); setSendResult(null); setDraftSaved(false); }} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              Compose{totalRecipientCount > 0 ? ` (${totalRecipientCount})` : ""}
            </button>
            <button onClick={() => setSettingsOpen(true)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-6">

        {/* ═══════════ INBOX — Outlook Integration ═══════════ */}
        {section === "Inbox" && (
          <div className="flex gap-6 h-[calc(100vh-8rem)]">
            {/* Left: Message list */}
            <div className="w-[420px] flex flex-col shrink-0">
              {/* Folder tabs + search */}
              <div className="bg-white border border-slate-200 rounded-t-xl px-4 pt-4 pb-3 space-y-3">
                <div className="flex items-center gap-1">
                  {([
                    { key: "inbox" as const, label: "Inbox", count: mailFolders?.inbox.unread },
                    { key: "sent" as const, label: "Sent", count: undefined },
                    { key: "drafts" as const, label: "Drafts", count: mailFolders?.drafts.total },
                  ]).map((tab) => (
                    <button key={tab.key} onClick={() => { setOutlookFolder(tab.key); setSelectedMessage(null); fetchOutlookMessages(tab.key); }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors relative ${outlookFolder === tab.key ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                      {tab.label}
                      {tab.count && tab.count > 0 && (
                        <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${outlookFolder === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>{tab.count}</span>
                      )}
                    </button>
                  ))}
                  <button onClick={() => { fetchOutlookMessages(); fetchMailFolders(); }} className="ml-auto p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Refresh">
                    <svg className={`w-4 h-4 ${outlookLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                </div>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" placeholder="Search emails..." value={outlookSearch}
                    onChange={(e) => setOutlookSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") fetchOutlookMessages(undefined, outlookSearch); }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                </div>
              </div>

              {/* Message list */}
              <div className="flex-1 bg-white border-x border-b border-slate-200 rounded-b-xl overflow-y-auto">
                {outlookLoading && outlookMessages.length === 0 && (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {outlookError && (
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-red-50 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    </div>
                    <p className="text-sm text-red-600 font-medium mb-1">Could not load emails</p>
                    <p className="text-xs text-slate-400 mb-3">{outlookError}</p>
                    <button onClick={() => fetchOutlookMessages()} className="text-xs text-slate-600 hover:text-slate-900 underline">Try again</button>
                  </div>
                )}
                {!outlookLoading && !outlookError && outlookMessages.length === 0 && (
                  <div className="p-6 text-center text-sm text-slate-400">No emails in this folder</div>
                )}
                {outlookMessages.map((msg) => (
                  <button key={msg.id} onClick={() => { setSelectedMessage(msg); setReplyOpen(false); setReplyText(""); if (!msg.isRead) handleMarkRead(msg, true); }}
                    className={`w-full text-left px-4 py-3 border-b border-slate-100 transition-colors ${selectedMessage?.id === msg.id ? "bg-slate-50 border-l-2 border-l-slate-900" : "hover:bg-slate-50/50 border-l-2 border-l-transparent"} ${!msg.isRead ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                        <span className={`text-sm truncate ${!msg.isRead ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
                          {outlookFolder === "sent" ? (msg.toRecipients?.[0]?.emailAddress?.name || msg.toRecipients?.[0]?.emailAddress?.address || "Unknown") : (msg.from?.emailAddress?.name || msg.from?.emailAddress?.address || "Unknown")}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{timeAgo(msg.receivedDateTime || msg.sentDateTime)}</span>
                    </div>
                    <p className={`text-xs mb-0.5 truncate ${!msg.isRead ? "text-slate-900 font-medium" : "text-slate-600"}`}>{msg.subject || "(no subject)"}</p>
                    <p className="text-[11px] text-slate-400 truncate">{msg.bodyPreview}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {msg.hasAttachments && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        </span>
                      )}
                      {msg.importance === "high" && (
                        <span className="text-[10px] text-red-500 font-medium">!</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Message detail */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              {!selectedMessage ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <p className="text-sm">Select an email to read</p>
                </div>
              ) : (
                <>
                  {/* Message header */}
                  <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-lg font-semibold text-slate-900 leading-snug">{selectedMessage.subject || "(no subject)"}</h2>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleMarkRead(selectedMessage, !selectedMessage.isRead)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title={selectedMessage.isRead ? "Mark unread" : "Mark read"}>
                          <svg className="w-4 h-4" fill={selectedMessage.isRead ? "none" : "currentColor"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                        </button>
                        {selectedMessage.webLink && (
                          <a href={selectedMessage.webLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Open in Outlook">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                        {(selectedMessage.from?.emailAddress?.name || "?")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{selectedMessage.from?.emailAddress?.name}</p>
                        <p className="text-xs text-slate-400">{selectedMessage.from?.emailAddress?.address}</p>
                      </div>
                      <p className="text-xs text-slate-400">{formatDate(selectedMessage.receivedDateTime || selectedMessage.sentDateTime)}</p>
                    </div>
                    {selectedMessage.toRecipients?.length > 0 && (
                      <p className="text-xs text-slate-400 mt-2">
                        To: {selectedMessage.toRecipients.map((r) => r.emailAddress.name || r.emailAddress.address).join(", ")}
                        {selectedMessage.ccRecipients?.length > 0 && <> · CC: {selectedMessage.ccRecipients.map((r) => r.emailAddress.name || r.emailAddress.address).join(", ")}</>}
                      </p>
                    )}
                  </div>

                  {/* Message body */}
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {selectedMessage.body?.contentType === "html" || selectedMessage.body?.contentType === "HTML" ? (
                      <div className="prose prose-sm max-w-none text-slate-700 [&_img]:max-w-full [&_a]:text-blue-600" dangerouslySetInnerHTML={{ __html: selectedMessage.body.content }} />
                    ) : (
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{selectedMessage.body?.content || selectedMessage.bodyPreview}</pre>
                    )}
                  </div>

                  {/* Reply bar */}
                  <div className="border-t border-slate-200 px-6 py-3">
                    {!replyOpen ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setReplyOpen(true)} className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                          Reply
                        </button>
                        <button onClick={() => openComposeToMessage(selectedMessage)} className="flex items-center gap-1.5 px-3 py-2 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                          Compose New
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} placeholder="Type your reply..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" autoFocus />
                        <div className="flex items-center justify-between">
                          <button onClick={() => { setReplyOpen(false); setReplyText(""); }} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                          <button onClick={handleReply} disabled={replying || !replyText.trim()} className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            {replying ? "Sending..." : "Send Reply"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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
                { label: "Unread Emails", value: mailFolders?.inbox.unread ?? "-", sub: "in Ralph's inbox" },
              ].map((m) => (
                <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{m.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{m.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Pipeline by Category</h3>
              <div className="space-y-3">
                {Object.entries(stats.categories).sort(([, a], [, b]) => b - a).map(([cat, count]) => {
                  const pct = Math.round((count / stats.totalInvestors) * 100);
                  return (
                    <div key={cat} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <button onClick={() => { setCategoryFilter(cat); setSection("Investors"); }} className="text-sm text-slate-600 hover:text-slate-900 transition-colors text-left">{cat}</button>
                        <div className="flex items-center gap-3">
                          <button onClick={() => { addAllByCategory(cat); setEmailOpen(true); }} className="text-xs text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">Email all</button>
                          <span className="text-sm font-medium text-slate-900">{count}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-slate-900 rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ INVESTORS ═══════════ */}
        {section === "Investors" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search by name, email, notes..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm" />
              </div>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>))}
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer select-none">
                <input type="checkbox" checked={friendFilter} onChange={(e) => setFriendFilter(e.target.checked)} className="rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                Friends of Ralph
              </label>
              <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
                <span>{investors.length} contacts</span>
                {selectedIds.size > 0 && (
                  <>
                    <span className="font-medium text-slate-900">{selectedIds.size} selected</span>
                    <button onClick={() => setSelectedIds(new Set())} className="text-slate-400 hover:text-slate-600">Clear</button>
                    <button onClick={() => setEmailOpen(true)} className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800">Email selected</button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="p-3 text-left w-10"><input type="checkbox" checked={selectedIds.size === investors.length && investors.length > 0} onChange={selectAll} className="rounded border-slate-300 text-slate-900 focus:ring-slate-400" /></th>
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
                      <tr key={inv.id} className={`border-b border-slate-100 transition-colors cursor-pointer ${selectedIds.has(inv.id) ? "bg-slate-50" : "hover:bg-slate-50/50"}`}>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.has(inv.id)} onChange={() => toggleSelect(inv.id)} className="rounded border-slate-300 text-slate-900 focus:ring-slate-400" /></td>
                        <td className="p-3" onClick={() => openDetail(inv)}>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">{inv.first_name[0]}{(inv.last_name || "")[0] || ""}</div>
                            <div>
                              <p className="font-medium text-slate-900">{inv.first_name} {inv.last_name || ""}</p>
                              {inv.friend_of_ralph && <p className="text-[10px] text-violet-500 font-medium">Friend of Ralph</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-500" onClick={() => openDetail(inv)}>{inv.email || <span className="text-slate-300">-</span>}</td>
                        <td className="p-3" onClick={() => openDetail(inv)}><span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${categoryBadge[inv.category] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>{inv.category}</span></td>
                        <td className="p-3 text-right font-mono text-xs text-slate-600" onClick={() => openDetail(inv)}>{inv.amount_of_interest > 0 ? fmt(inv.amount_of_interest) : "-"}</td>
                        <td className="p-3 text-right font-mono text-xs text-emerald-600" onClick={() => openDetail(inv)}>{inv.amount_invested > 0 ? fmt(inv.amount_invested) : "-"}</td>
                        <td className="p-3 text-center" onClick={() => openDetail(inv)}>{inv.zoom_completed ? <StatusDot active /> : inv.zoom_scheduled ? <StatusDot active color="amber" /> : <StatusDot active={false} />}</td>
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
            <motion.div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-200 z-50 overflow-y-auto shadow-xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">{detailInvestor.first_name[0]}{(detailInvestor.last_name || "")[0] || ""}</div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{detailInvestor.first_name} {detailInvestor.last_name || ""}</h2>
                    <p className="text-xs text-slate-400">{detailInvestor.email || "No email"}</p>
                  </div>
                </div>
                <button onClick={closeDetail} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${categoryBadge[detailInvestor.category] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>{detailInvestor.category}</span>
                  {detailInvestor.friend_of_ralph && <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200">Friend of Ralph</span>}
                  {detailInvestor.invested && <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">Invested</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[{ label: "Phone", value: detailInvestor.phone }, { label: "Source", value: detailInvestor.source }, { label: "Interest", value: detailInvestor.amount_of_interest > 0 ? fmt(detailInvestor.amount_of_interest) : null }, { label: "Invested", value: detailInvestor.amount_invested > 0 ? fmt(detailInvestor.amount_invested) : null }, { label: "Added", value: detailInvestor.added_date }, { label: "Last Contact", value: detailInvestor.last_contact_date }, { label: "Email Sequence", value: `#${detailInvestor.email_sequence}` }, { label: "Preferred Tone", value: detailInvestor.preferred_tone }].map((f) => (
                    <div key={f.label}><p className="text-xs text-slate-400 mb-0.5">{f.label}</p><p className="text-sm text-slate-900">{f.value || "-"}</p></div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Progress</p>
                  <div className="flex items-center gap-2">
                    {[{ label: "Zoom Sched.", done: detailInvestor.zoom_scheduled, key: "zoom_scheduled" }, { label: "Zoom Done", done: detailInvestor.zoom_completed, key: "zoom_completed" }, { label: "Docs Sent", done: detailInvestor.docs_sent, key: "docs_sent" }, { label: "Invested", done: detailInvestor.invested, key: "invested" }].map((step) => (
                      <button key={step.key} onClick={() => updateInvestor(detailInvestor.id, { [step.key]: !step.done } as Partial<Investor>)} className={`flex-1 text-center py-1.5 text-xs font-medium rounded-md border transition-colors ${step.done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`}>{step.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</p>
                  <select value={detailInvestor.category} onChange={(e) => updateInvestor(detailInvestor.id, { category: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
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
                    {!editingNotes ? <button onClick={() => { setEditingNotes(true); setEditNotes(detailInvestor.notes || ""); }} className="text-xs text-slate-400 hover:text-slate-600">Edit</button> : <div className="flex gap-2"><button onClick={() => setEditingNotes(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button><button onClick={saveNotes} className="text-xs text-slate-900 font-medium hover:text-slate-700">Save</button></div>}
                  </div>
                  {editingNotes ? <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={4} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" /> : <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{detailInvestor.notes || "No notes yet"}</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Communication History</p>
                  {detailComms.length === 0 ? <p className="text-sm text-slate-400">No communications logged</p> : (
                    <div className="space-y-3">
                      {detailComms.slice(0, 10).map((c) => (
                        <div key={c.id} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2"><span className="text-xs text-slate-400">{c.date}</span><span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${commTypeBadge[c.type] || "bg-slate-50 text-slate-500"}`}>{c.type}</span></div>
                            <p className="text-slate-700 mt-0.5">{c.subject || "-"}</p>
                            {c.response && <p className="text-xs text-slate-400 mt-0.5">Response: {c.response}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {detailInvestor.email && (
                  <button onClick={() => { setSelectedIds(new Set([detailInvestor.id])); setEmailOpen(true); closeDetail(); }} className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">Send Email to {detailInvestor.first_name}</button>
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
            <motion.div className="fixed inset-0 bg-black/20 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setEmailOpen(false); setSendResult(null); setDraftSaved(false); }} />
            <motion.div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white border-l border-slate-200 z-50 shadow-xl flex flex-col" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-base font-semibold text-slate-900">Compose Email</h2>
                <button onClick={() => { setEmailOpen(false); setSendResult(null); setDraftSaved(false); }} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Recipients from CRM */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">To — CRM Contacts</label>
                  <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-50 rounded-t-lg border border-slate-200 border-b-0">
                    {selectedInvestors.map((i) => (
                      <span key={i.id} className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md border ${i.email ? "bg-white text-slate-700 border-slate-200" : "bg-red-50 text-red-500 border-red-200 line-through"}`}>
                        {i.first_name} {i.last_name || ""}{!i.email && <span className="text-[10px] no-underline">(no email)</span>}
                        <button onClick={() => toggleSelect(i.id)} className="ml-0.5 text-slate-400 hover:text-slate-600">&times;</button>
                      </span>
                    ))}
                    {manualRecipients.map((r) => (
                      <span key={r.address} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md border bg-blue-50 text-blue-700 border-blue-200">
                        {r.address}
                        <button onClick={() => removeManualRecipient(r.address)} className="ml-0.5 text-blue-400 hover:text-blue-600">&times;</button>
                      </span>
                    ))}
                    {selectedIds.size === 0 && manualRecipients.length === 0 && <span className="text-xs text-slate-400 py-0.5">Search below to add recipients, or type an email address</span>}
                  </div>
                  <div className="relative">
                    <input ref={recipientInputRef} type="text" value={recipientSearch} onChange={(e) => { setRecipientSearch(e.target.value); setRecipientDropdown(true); }} onFocus={() => setRecipientDropdown(true)} onKeyDown={(e) => { if (e.key === "Enter" && recipientSearch.trim() && isValidEmail(recipientSearch.trim())) { e.preventDefault(); addManualRecipient(); } }} placeholder="Type a name or email to add..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-b-lg text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    {recipientDropdown && recipientSearch.trim() && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        {recipientResults.length === 0 && !isValidEmail(recipientSearch.trim()) && (
                          <div className="px-3 py-4 text-sm text-slate-400 text-center">No matches found — type a full email to add an external recipient</div>
                        )}
                        {recipientResults.map((inv) => (
                          <button key={inv.id} onClick={() => addRecipient(inv.id)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">{inv.first_name[0]}{(inv.last_name || "")[0] || ""}</div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900">{inv.first_name} {inv.last_name || ""}</p><p className="text-xs text-slate-400 truncate">{inv.email || "No email"} · {inv.category}</p></div>
                          </button>
                        ))}
                        {isValidEmail(recipientSearch.trim()) && !manualRecipients.some((r) => r.address.toLowerCase() === recipientSearch.trim().toLowerCase()) && !allInvestors.some((i) => i.email?.toLowerCase() === recipientSearch.trim().toLowerCase()) && (
                          <button onClick={() => addManualRecipient()} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left border-t border-slate-100">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600 shrink-0">+</div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-blue-700">Add external recipient</p><p className="text-xs text-slate-400 truncate">{recipientSearch.trim()}</p></div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Quick add:</span>
                    {CATEGORIES.filter((c) => c !== "all").map((cat) => (
                      <button key={cat} onClick={() => addAllByCategory(cat)} className="text-[11px] text-slate-500 hover:text-slate-700 px-2 py-0.5 rounded border border-slate-200 hover:border-slate-300 transition-colors">{cat}</button>
                    ))}
                    <button onClick={() => { const all = allInvestors.filter(i => i.email).map(i => i.id); setSelectedIds(new Set(all)); }} className="text-[11px] text-slate-900 font-medium hover:text-slate-700 px-2 py-0.5 rounded border border-slate-300 hover:border-slate-400 transition-colors">All with email</button>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Subject</label>
                  <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="e.g. Prime Dealer Fund — Quarterly Update" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm" />
                </div>

                {/* Body */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</label>
                    <span className="text-[10px] text-slate-400">Variables: {"{{first_name}}"} {"{{last_name}}"} {"{{full_name}}"}</span>
                  </div>
                  <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={14} placeholder={"Hi {{first_name}},\n\nI wanted to reach out regarding our fund's latest acquisition opportunity...\n\nWould love to schedule a call to discuss further."} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm resize-none" />
                  <p className="text-[10px] text-slate-400 mt-1">Sending via Resend uses Prime branding + Ralph&apos;s signature. Saving as Outlook draft creates a plain draft in Ralph&apos;s mailbox.</p>
                </div>

                <AnimatePresence>
                  {sendResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-4 rounded-lg border ${sendResult.error && sendResult.sent === 0 ? "bg-red-50 border-red-200" : sendResult.failed === 0 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                      {sendResult.error && sendResult.sent === 0 ? (
                        <p className="text-sm font-medium text-red-700">{sendResult.error}</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-slate-900">{sendResult.sent} email{sendResult.sent !== 1 ? "s" : ""} sent successfully{sendResult.failed > 0 && <span className="text-red-600 ml-2">{sendResult.failed} failed</span>}</p>
                          {sendResult.error && <p className="text-xs text-red-500 mt-1">{sendResult.error}</p>}
                        </>
                      )}
                    </motion.div>
                  )}
                  {draftSaved && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                      <p className="text-sm font-medium text-blue-800">Draft saved to Ralph&apos;s Outlook</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-slate-400">From: ralph@primedealerfund.com · {totalRecipientCount} recipient{totalRecipientCount !== 1 ? "s" : ""}</p>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveAsDraft} disabled={savingDraft || (!emailSubject && !emailBody)} className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {savingDraft ? "Saving..." : "Save to Outlook Drafts"}
                  </button>
                  <button onClick={handleSendEmail} disabled={sending || !hasEmailRecipients || !emailSubject || !emailBody} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {sending ? "Sending..." : "Send via Resend"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ ADD CONTACT MODAL ═══════════ */}
      <AnimatePresence>
        {addContactOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/30 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddContactOpen(false)} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">Add Contact</h2>
                  <button onClick={() => setAddContactOpen(false)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">First Name *</label>
                      <input type="text" value={newContact.first_name} onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Last Name</label>
                      <input type="text" value={newContact.last_name} onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                      <input type="email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Phone</label>
                      <input type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
                      <select value={newContact.category} onChange={(e) => setNewContact({ ...newContact, category: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                        {CATEGORIES.filter((c) => c !== "all").map((c) => (<option key={c} value={c}>{c}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Source</label>
                      <select value={newContact.source} onChange={(e) => setNewContact({ ...newContact, source: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                        {["Admin Added", "Referral", "LinkedIn", "Apollo", "Website", "Podcast", "Event", "Other"].map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Amount of Interest ($)</label>
                    <input type="number" value={newContact.amount_of_interest || ""} onChange={(e) => setNewContact({ ...newContact, amount_of_interest: parseInt(e.target.value) || 0 })} placeholder="0" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" checked={newContact.friend_of_ralph} onChange={(e) => setNewContact({ ...newContact, friend_of_ralph: e.target.checked })} className="rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                    Friend of Ralph
                  </label>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Notes</label>
                    <textarea value={newContact.notes} onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                  <button onClick={() => setAddContactOpen(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                  <button onClick={handleAddContact} disabled={!newContact.first_name.trim() || addingContact} className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed">{addingContact ? "Adding..." : "Add Contact"}</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ SETTINGS MODAL ═══════════ */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/30 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSettingsOpen(false); setPasswordMsg(null); }} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">Account Settings</h2>
                  <button onClick={() => { setSettingsOpen(false); setPasswordMsg(null); }} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Change Password</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                      </div>
                      {passwordMsg && (
                        <p className={`text-xs ${passwordMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>{passwordMsg.text}</p>
                      )}
                      <button onClick={handleChangePassword} disabled={changingPassword || !newPassword} className="w-full py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed">{changingPassword ? "Updating..." : "Update Password"}</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
