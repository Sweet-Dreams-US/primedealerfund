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
  ball_in_court: "ours" | "theirs" | null;
  ball_changed_at: string | null;
  last_outbound_at: string | null;
  last_inbound_at: string | null;
};

type CommLog = {
  id: string;
  investor_id: string | null;
  date: string;
  type: string;
  subject: string | null;
  response: string | null;
  next_step: string | null;
  direction: string | null;
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

type Task = {
  id: string;
  investor_id: string | null;
  title: string;
  description: string | null;
  type: string;
  due_date: string;
  completed: boolean;
  completed_at: string | null;
  priority: string;
  created_at: string;
  investors: { id: string; first_name: string; last_name: string | null; email: string | null; category: string } | null;
};

type CalendarEvent = {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: { emailAddress: { name: string; address: string }; status: { response: string } }[];
  isOnlineMeeting: boolean;
  onlineMeeting: { joinUrl: string } | null;
  location: { displayName: string } | null;
  bodyPreview: string;
  webLink: string;
};

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  sequence_group: string | null;
};

const SECTIONS = ["Inbox", "Overview", "Investors", "Communications", "Tasks", "Calendar"] as const;
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

type ColumnKey = "email" | "phone" | "category" | "ballStatus" | "interest" | "invested" | "zoom" | "docs" | "source" | "lastContact" | "nextAction" | "addedDate" | "friendOfRalph";

const ALL_COLUMNS: { key: ColumnKey; label: string; defaultOn: boolean }[] = [
  { key: "email", label: "Email", defaultOn: true },
  { key: "phone", label: "Phone", defaultOn: false },
  { key: "category", label: "Category", defaultOn: true },
  { key: "ballStatus", label: "Ball Status", defaultOn: true },
  { key: "interest", label: "Interest", defaultOn: true },
  { key: "invested", label: "Invested", defaultOn: true },
  { key: "zoom", label: "Zoom", defaultOn: true },
  { key: "docs", label: "Docs", defaultOn: true },
  { key: "source", label: "Source", defaultOn: false },
  { key: "lastContact", label: "Last Contact", defaultOn: false },
  { key: "nextAction", label: "Next Action", defaultOn: true },
  { key: "addedDate", label: "Added Date", defaultOn: false },
  { key: "friendOfRalph", label: "Friend of Ralph", defaultOn: false },
];

const DEFAULT_COLUMNS: Record<ColumnKey, boolean> = Object.fromEntries(ALL_COLUMNS.map((c) => [c.key, c.defaultOn])) as Record<ColumnKey, boolean>;

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

function daysBetween(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function formatShortDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCalendarTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatCalendarDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
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
  const [draftWebLink, setDraftWebLink] = useState<string | null>(null);
  const [manualRecipients, setManualRecipients] = useState<{ name: string; address: string }[]>([]);
  const [manualEmailInput, setManualEmailInput] = useState("");

  // Detail panel
  const [detailInvestor, setDetailInvestor] = useState<Investor | null>(null);
  const [detailComms, setDetailComms] = useState<CommLog[]>([]);

  // Edit mode
  const [editingNotes, setEditingNotes] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [editingDetail, setEditingDetail] = useState(false);
  const [editDetail, setEditDetail] = useState<Partial<Investor>>({});
  const [addingComm, setAddingComm] = useState(false);
  const [newComm, setNewComm] = useState({ type: "Email", direction: "inbound", subject: "", response: "", next_step: "" });

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

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", due_date: "", priority: "normal", investor_id: "", type: "follow-up" });
  const [addingTask, setAddingTask] = useState(false);
  const [taskDetail, setTaskDetail] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState(false);
  const [editTask, setEditTask] = useState({ title: "", description: "", due_date: "", priority: "normal", investor_id: "", type: "follow-up" });
  const [taskInvestorSearch, setTaskInvestorSearch] = useState("");

  // Calendar state
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Email templates
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("prime_admin_columns");
        if (stored) return JSON.parse(stored);
      } catch { /* ignore */ }
    }
    return DEFAULT_COLUMNS;
  });
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── Helpers ──

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function toggleColumn(key: ColumnKey) {
    setVisibleColumns((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem("prime_admin_columns", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
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

  const fetchTasks = useCallback(async () => {
    setTasksLoading(true);
    try {
      const res = await fetch("/api/admin/tasks?status=all");
      if (res.ok) {
        const data = await res.json();
        // API returns { overdue, today, upcoming, completed } — flatten to array
        const all = [
          ...(data.overdue || []),
          ...(data.today || []),
          ...(data.upcoming || []),
          ...(data.completed || []),
        ];
        setTasks(all);
      }
    } catch { /* ignore */ }
    setTasksLoading(false);
  }, []);

  const fetchCalendarEvents = useCallback(async () => {
    setCalendarLoading(true);
    try {
      const res = await fetch("/api/admin/calendar?days=14");
      if (res.ok) {
        const data = await res.json();
        setCalendarEvents(data.events || data || []);
      }
    } catch { /* ignore */ }
    setCalendarLoading(false);
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/templates");
      if (res.ok) setTemplates(await res.json());
    } catch { /* ignore */ }
  }, []);

  async function handleSyncOutlook() {
    setSyncing(true);
    setSyncToast(null);
    try {
      const res = await fetch("/api/admin/email-sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncToast({ message: data.message || "Sync completed successfully", type: "success" });
        fetchOutlookMessages();
        fetchMailFolders();
        fetchInvestors();
      } else {
        setSyncToast({ message: data.error || "Sync failed", type: "error" });
      }
    } catch {
      setSyncToast({ message: "Network error during sync", type: "error" });
    }
    setSyncing(false);
    setTimeout(() => setSyncToast(null), 5000);
  }

  useEffect(() => {
    Promise.all([fetchStats(), fetchInvestors(), fetchAllInvestors(), fetchTemplates()]).then(() => setLoading(false));
  }, [fetchStats, fetchInvestors, fetchAllInvestors, fetchTemplates]);

  useEffect(() => { if (section === "Communications") fetchComms(); }, [section, fetchComms]);
  useEffect(() => { fetchInvestors(); }, [fetchInvestors]);
  useEffect(() => {
    if (section === "Inbox") {
      fetchOutlookMessages();
      fetchMailFolders();
    }
  }, [section, fetchOutlookMessages, fetchMailFolders]);
  useEffect(() => { if (section === "Tasks") fetchTasks(); }, [section, fetchTasks]);
  useEffect(() => { if (section === "Calendar") fetchCalendarEvents(); }, [section, fetchCalendarEvents]);

  const recipientResults = useMemo(() => {
    if (!recipientSearch.trim()) return [];
    const q = recipientSearch.toLowerCase();
    return allInvestors
      .filter((i) => !selectedIds.has(i.id))
      .filter((i) => `${i.first_name} ${i.last_name || ""}`.toLowerCase().includes(q) || (i.email || "").toLowerCase().includes(q))
      .slice(0, 8);
  }, [recipientSearch, allInvestors, selectedIds]);

  const taskInvestorResults = useMemo(() => {
    if (!taskInvestorSearch.trim()) return [];
    const q = taskInvestorSearch.toLowerCase();
    return allInvestors
      .filter((i) => `${i.first_name} ${i.last_name || ""}`.toLowerCase().includes(q) || (i.email || "").toLowerCase().includes(q))
      .slice(0, 8);
  }, [taskInvestorSearch, allInvestors]);

  // Task categorization
  const tasksByCategory = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    const overdue: Task[] = [];
    const today: Task[] = [];
    const upcoming: Task[] = [];
    tasks.filter((t) => !t.completed).forEach((t) => {
      const due = new Date(t.due_date);
      due.setHours(0, 0, 0, 0);
      if (due < now) overdue.push(t);
      else if (due <= todayEnd) today.push(t);
      else upcoming.push(t);
    });
    return { overdue, today, upcoming };
  }, [tasks]);

  // Overview computed values
  const tasksDueToday = useMemo(() => tasksByCategory.today.length, [tasksByCategory]);
  const actionRequired = useMemo(() => allInvestors.filter((i) => i.ball_in_court === "ours").length, [allInvestors]);
  const staleLeads = useMemo(() => allInvestors.filter((i) => i.ball_in_court === "theirs" && i.ball_changed_at && daysBetween(i.ball_changed_at) > 7).length, [allInvestors]);

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

  function buildBrandedHtml(bodyText: string) {
    const paragraphs = bodyText.split("\n").map((line: string) => line.trim() === "" ? "<br>" : `<p style="margin:0 0 12px 0;">${line}</p>`).join("\n");
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:20px;">
<tr><td><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:0;"><div style="color:#000000;font-size:14px;line-height:1.6;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;">${paragraphs}</div>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
<tr><td style="padding-right:16px;vertical-align:top;">
<img src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png" alt="Prime Dealer Equity Fund" width="100" style="height:auto;display:block;" />
</td><td style="vertical-align:top;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:#000000;">
<strong>Ralph E. Marcuccilli</strong>, Manager<br>Prime Management Partners LLC<br>P: 260.417.6016<br>
<a href="mailto:Ralph@PrimeDealerFund.com" style="color:#0563C1;text-decoration:underline;">Ralph@PrimeDealerFund.com</a>
</td></tr></table></td></tr></table></td></tr></table></body></html>`;
  }

  async function handleSaveAsDraft() {
    if (!emailSubject && !emailBody) return;
    setSavingDraft(true);
    setDraftSaved(false);
    const toRecipients = [
      ...selectedInvestors.filter((i) => i.email).map((i) => ({ name: `${i.first_name} ${i.last_name || ""}`.trim(), address: i.email! })),
      ...manualRecipients,
    ];
    // Send the full branded HTML email as draft (same design as Resend sends)
    const html = buildBrandedHtml(emailBody);
    try {
      const res = await fetch("/api/admin/outlook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-draft",
          subject: emailSubject,
          body: html,
          bodyType: "HTML",
          toRecipients,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDraftSaved(true);
        setDraftWebLink(data.draft?.webLink || null);
        setTimeout(() => { setDraftSaved(false); setDraftWebLink(null); }, 10000);
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

  async function toggleBallInCourt(inv: Investor) {
    const next: "ours" | "theirs" | null = inv.ball_in_court === "ours" ? "theirs" : inv.ball_in_court === "theirs" ? null : "ours";
    await updateInvestor(inv.id, { ball_in_court: next, ball_changed_at: new Date().toISOString() } as Partial<Investor>);
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

  async function handleAddTask() {
    if (!newTask.title.trim() || !newTask.due_date) return;
    setAddingTask(true);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, investor_id: newTask.investor_id || null }),
      });
      if (res.ok) {
        setAddTaskOpen(false);
        setNewTask({ title: "", description: "", due_date: "", priority: "normal", investor_id: "", type: "follow-up" });
        setTaskInvestorSearch("");
        fetchTasks();
      }
    } catch { /* ignore */ }
    setAddingTask(false);
  }

  async function handleCompleteTask(taskId: string) {
    try {
      await fetch("/api/admin/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, completed: true }),
      });
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, completed: true, completed_at: new Date().toISOString() } : t));
      if (taskDetail?.id === taskId) setTaskDetail((prev) => prev ? { ...prev, completed: true, completed_at: new Date().toISOString() } : prev);
    } catch { /* ignore */ }
  }

  async function handleUpdateTask() {
    if (!taskDetail) return;
    try {
      await fetch("/api/admin/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskDetail.id, ...editTask, investor_id: editTask.investor_id || null }),
      });
      setEditingTask(false);
      fetchTasks();
      setTaskDetail(null);
    } catch { /* ignore */ }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await fetch(`/api/admin/tasks?id=${taskId}`, { method: "DELETE" });
      setTaskDetail(null);
      fetchTasks();
    } catch { /* ignore */ }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function openDetail(inv: Investor) { setDetailInvestor(inv); setEditingNotes(false); setEditingDetail(false); fetchComms(inv.id); }
  function closeDetail() { setDetailInvestor(null); setDetailComms([]); setEditingNotes(false); setEditingDetail(false); }
  async function saveNotes() { if (!detailInvestor) return; await updateInvestor(detailInvestor.id, { notes: editNotes }); setEditingNotes(false); }
  function startEditDetail() {
    if (!detailInvestor) return;
    setEditDetail({
      first_name: detailInvestor.first_name,
      last_name: detailInvestor.last_name,
      email: detailInvestor.email,
      phone: detailInvestor.phone,
      source: detailInvestor.source,
      amount_of_interest: detailInvestor.amount_of_interest,
      amount_invested: detailInvestor.amount_invested,
      added_date: detailInvestor.added_date,
      last_contact_date: detailInvestor.last_contact_date,
      next_action: detailInvestor.next_action,
      next_action_date: detailInvestor.next_action_date,
      preferred_tone: detailInvestor.preferred_tone,
      friend_of_ralph: detailInvestor.friend_of_ralph,
      notes: detailInvestor.notes,
    });
    setEditingDetail(true);
  }
  async function saveDetail() {
    if (!detailInvestor) return;
    await updateInvestor(detailInvestor.id, editDetail);
    setEditingDetail(false);
  }
  async function saveCommEntry() {
    if (!detailInvestor || !newComm.subject.trim()) return;
    const today = new Date().toISOString().split("T")[0];
    await fetch("/api/admin/communications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        investor_id: detailInvestor.id,
        date: today,
        type: newComm.type,
        direction: newComm.direction,
        subject: newComm.subject,
        response: newComm.response || null,
        next_step: newComm.next_step || null,
      }),
    });
    // Also update last_contact_date
    await updateInvestor(detailInvestor.id, { last_contact_date: today });
    setNewComm({ type: "Email", direction: "inbound", subject: "", response: "", next_step: "" });
    setAddingComm(false);
    fetchComms(detailInvestor.id);
  }

  function openComposeToMessage(msg: OutlookMessage) {
    setEmailSubject(`Re: ${msg.subject}`);
    setEmailBody("");
    setManualRecipients([{ name: msg.from.emailAddress.name, address: msg.from.emailAddress.address }]);
    setSelectedIds(new Set());
    setSelectedMessage(null);
    setEmailOpen(true);
  }

  function applyTemplate(templateId: string) {
    setSelectedTemplate(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setEmailSubject(tmpl.subject);
      setEmailBody(tmpl.body);
    }
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
      {/* Sync Toast */}
      <AnimatePresence>
        {syncToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${syncToast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}
          >
            {syncToast.message}
          </motion.div>
        )}
      </AnimatePresence>

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
                  {s === "Tasks" && tasksByCategory.overdue.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{tasksByCategory.overdue.length > 9 ? "9+" : tasksByCategory.overdue.length}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSyncOutlook} disabled={syncing} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-40" title="Sync Outlook">
              <svg className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" /></svg>
              {syncing ? "Syncing..." : "Sync"}
            </button>
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
                  <button onClick={() => { handleSyncOutlook(); }} className="ml-auto p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Sync & Refresh">
                    <svg className={`w-4 h-4 ${outlookLoading || syncing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
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

            {/* New action cards row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tasks Due Today</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900">{tasksDueToday}</p>
                <button onClick={() => setSection("Tasks")} className="text-xs text-blue-600 hover:text-blue-800 mt-1">View tasks →</button>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Action Required</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900">{actionRequired}</p>
                <p className="text-xs text-slate-400 mt-1">investors where ball is in our court</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                  </div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Stale Leads</p>
                </div>
                <p className="text-2xl font-semibold text-slate-900">{staleLeads}</p>
                <p className="text-xs text-slate-400 mt-1">waiting &gt;7 days with no response</p>
              </div>
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
              {/* Columns dropdown */}
              <div className="relative">
                <button onClick={() => setColumnsDropdownOpen(!columnsDropdownOpen)} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>
                  Columns
                </button>
                {columnsDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setColumnsDropdownOpen(false)} />
                    <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-2">
                      {ALL_COLUMNS.map((col) => (
                        <label key={col.key} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">
                          <input type="checkbox" checked={visibleColumns[col.key]} onChange={() => toggleColumn(col.key)} className="rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                          <span className="text-sm text-slate-700">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
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
                      {visibleColumns.email && <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>}
                      {visibleColumns.phone && <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>}
                      {visibleColumns.category && <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>}
                      {visibleColumns.ballStatus && <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>}
                      {visibleColumns.interest && <th className="p-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Interest</th>}
                      {visibleColumns.invested && <th className="p-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Invested</th>}
                      {visibleColumns.zoom && <th className="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Zoom</th>}
                      {visibleColumns.docs && <th className="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Docs</th>}
                      {visibleColumns.source && <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>}
                      {visibleColumns.lastContact && <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Contact</th>}
                      {visibleColumns.nextAction && <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Action</th>}
                      {visibleColumns.addedDate && <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Added</th>}
                      {visibleColumns.friendOfRalph && <th className="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">FoR</th>}
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
                        {visibleColumns.email && <td className="p-3 text-slate-500" onClick={() => openDetail(inv)}>{inv.email || <span className="text-slate-300">-</span>}</td>}
                        {visibleColumns.phone && <td className="p-3 text-slate-500" onClick={() => openDetail(inv)}>{inv.phone || <span className="text-slate-300">-</span>}</td>}
                        {visibleColumns.category && <td className="p-3" onClick={() => openDetail(inv)}><span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${categoryBadge[inv.category] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>{inv.category}</span></td>}
                        {visibleColumns.ballStatus && (
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => toggleBallInCourt(inv)} className="flex items-center gap-1.5 text-xs font-medium group/ball" title="Click to toggle">
                              {inv.ball_in_court === "ours" && (
                                <><span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" /><span className="text-orange-600">Our turn</span></>
                              )}
                              {inv.ball_in_court === "theirs" && (
                                <>
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                                  <span className="text-emerald-600">Waiting</span>
                                  {inv.ball_changed_at && daysBetween(inv.ball_changed_at) > 7 && (
                                    <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                  )}
                                </>
                              )}
                              {!inv.ball_in_court && <span className="text-slate-300">-</span>}
                            </button>
                          </td>
                        )}
                        {visibleColumns.interest && <td className="p-3 text-right font-mono text-xs text-slate-600" onClick={() => openDetail(inv)}>{inv.amount_of_interest > 0 ? fmt(inv.amount_of_interest) : "-"}</td>}
                        {visibleColumns.invested && <td className="p-3 text-right font-mono text-xs text-emerald-600" onClick={() => openDetail(inv)}>{inv.amount_invested > 0 ? fmt(inv.amount_invested) : "-"}</td>}
                        {visibleColumns.zoom && <td className="p-3 text-center" onClick={() => openDetail(inv)}>{inv.zoom_completed ? <StatusDot active /> : inv.zoom_scheduled ? <StatusDot active color="amber" /> : <StatusDot active={false} />}</td>}
                        {visibleColumns.docs && <td className="p-3 text-center" onClick={() => openDetail(inv)}><StatusDot active={inv.docs_sent} /></td>}
                        {visibleColumns.source && <td className="p-3 text-slate-500 text-xs" onClick={() => openDetail(inv)}>{inv.source || "-"}</td>}
                        {visibleColumns.lastContact && <td className="p-3 text-slate-500 text-xs" onClick={() => openDetail(inv)}>{inv.last_contact_date || "-"}</td>}
                        {visibleColumns.nextAction && <td className="p-3 text-slate-500 text-xs max-w-[180px] truncate" onClick={() => openDetail(inv)}>{inv.next_action || "-"}</td>}
                        {visibleColumns.addedDate && <td className="p-3 text-slate-500 text-xs" onClick={() => openDetail(inv)}>{inv.added_date || "-"}</td>}
                        {visibleColumns.friendOfRalph && <td className="p-3 text-center" onClick={() => openDetail(inv)}>{inv.friend_of_ralph ? <span className="text-violet-500 text-xs font-medium">Yes</span> : <span className="text-slate-300">-</span>}</td>}
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

        {/* ═══════════ TASKS ═══════════ */}
        {section === "Tasks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
              <div className="flex items-center gap-2">
                <button onClick={fetchTasks} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Refresh">
                  <svg className={`w-4 h-4 ${tasksLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button onClick={() => setAddTaskOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Add Task
                </button>
              </div>
            </div>

            {tasksLoading && tasks.length === 0 ? (
              <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {/* Overdue */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <h3 className="text-sm font-semibold text-red-700">Overdue</h3>
                    <span className="text-xs text-red-400 font-medium">{tasksByCategory.overdue.length}</span>
                  </div>
                  <div className="space-y-2">
                    {tasksByCategory.overdue.map((t) => (
                      <div key={t.id} onClick={() => { setTaskDetail(t); setEditingTask(false); }} className="bg-white border border-red-200 rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked={t.completed} onChange={(e) => { e.stopPropagation(); handleCompleteTask(t.id); }} className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400" onClick={(e) => e.stopPropagation()} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{t.title}</p>
                            {t.investors && <p className="text-xs text-slate-400 mt-0.5">{t.investors.first_name} {t.investors.last_name || ""}</p>}
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-red-500 font-medium">{formatShortDate(t.due_date)}</span>
                              {t.priority !== "normal" && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${t.priority === "urgent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{t.priority}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {tasksByCategory.overdue.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No overdue tasks</p>}
                  </div>
                </div>
                {/* Today */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <h3 className="text-sm font-semibold text-blue-700">Today</h3>
                    <span className="text-xs text-blue-400 font-medium">{tasksByCategory.today.length}</span>
                  </div>
                  <div className="space-y-2">
                    {tasksByCategory.today.map((t) => (
                      <div key={t.id} onClick={() => { setTaskDetail(t); setEditingTask(false); }} className="bg-white border border-blue-200 rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked={t.completed} onChange={(e) => { e.stopPropagation(); handleCompleteTask(t.id); }} className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400" onClick={(e) => e.stopPropagation()} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{t.title}</p>
                            {t.investors && <p className="text-xs text-slate-400 mt-0.5">{t.investors.first_name} {t.investors.last_name || ""}</p>}
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-blue-500 font-medium">Today</span>
                              {t.priority !== "normal" && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${t.priority === "urgent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{t.priority}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {tasksByCategory.today.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No tasks for today</p>}
                  </div>
                </div>
                {/* Upcoming */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <h3 className="text-sm font-semibold text-slate-600">Upcoming</h3>
                    <span className="text-xs text-slate-400 font-medium">{tasksByCategory.upcoming.length}</span>
                  </div>
                  <div className="space-y-2">
                    {tasksByCategory.upcoming.map((t) => (
                      <div key={t.id} onClick={() => { setTaskDetail(t); setEditingTask(false); }} className="bg-white border border-slate-200 rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked={t.completed} onChange={(e) => { e.stopPropagation(); handleCompleteTask(t.id); }} className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400" onClick={(e) => e.stopPropagation()} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{t.title}</p>
                            {t.investors && <p className="text-xs text-slate-400 mt-0.5">{t.investors.first_name} {t.investors.last_name || ""}</p>}
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-slate-500 font-medium">{formatShortDate(t.due_date)}</span>
                              {t.priority !== "normal" && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${t.priority === "urgent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{t.priority}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {tasksByCategory.upcoming.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No upcoming tasks</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ CALENDAR ═══════════ */}
        {section === "Calendar" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Calendar — Next 14 Days</h2>
              <button onClick={fetchCalendarEvents} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Refresh">
                <svg className={`w-4 h-4 ${calendarLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            {calendarLoading && calendarEvents.length === 0 ? (
              <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>
            ) : calendarEvents.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                <p className="text-sm text-slate-400">No events in the next 14 days</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const grouped: Record<string, CalendarEvent[]> = {};
                  calendarEvents.forEach((evt) => {
                    const dateKey = new Date(evt.start.dateTime).toDateString();
                    if (!grouped[dateKey]) grouped[dateKey] = [];
                    grouped[dateKey].push(evt);
                  });
                  return Object.entries(grouped).map(([dateKey, events]) => (
                    <div key={dateKey}>
                      <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                        {formatCalendarDate(events[0].start.dateTime)}
                      </h3>
                      <div className="space-y-2">
                        {events.map((evt) => (
                          <div key={evt.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-slate-900">{evt.subject}</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                  {formatCalendarTime(evt.start.dateTime)} — {formatCalendarTime(evt.end.dateTime)}
                                  {evt.location?.displayName && <span className="ml-2">· {evt.location.displayName}</span>}
                                </p>
                                {evt.attendees && evt.attendees.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {evt.attendees.slice(0, 5).map((a, i) => (
                                      <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded-full border ${a.status?.response === "accepted" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : a.status?.response === "declined" ? "bg-red-50 text-red-600 border-red-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                                        {a.emailAddress.name || a.emailAddress.address}
                                      </span>
                                    ))}
                                    {evt.attendees.length > 5 && <span className="text-[10px] text-slate-400">+{evt.attendees.length - 5} more</span>}
                                  </div>
                                )}
                                {evt.bodyPreview && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{evt.bodyPreview}</p>}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {evt.isOnlineMeeting && evt.onlineMeeting?.joinUrl && (
                                  <a href={evt.onlineMeeting.joinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    Join
                                  </a>
                                )}
                                {evt.webLink && (
                                  <a href={evt.webLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Open in Outlook">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
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
                <div className="flex items-center gap-2">
                  {!editingDetail ? (
                    <button onClick={startEditDetail} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Edit</button>
                  ) : (
                    <>
                      <button onClick={() => setEditingDetail(false)} className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-md transition-colors">Cancel</button>
                      <button onClick={saveDetail} className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors">Save All</button>
                    </>
                  )}
                  <button onClick={closeDetail} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Ball in Court status */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ball in Court</p>
                    <button onClick={() => toggleBallInCourt(detailInvestor)} className="text-xs text-slate-400 hover:text-slate-600 underline">Toggle</button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {detailInvestor.ball_in_court === "ours" && (
                      <><span className="w-3 h-3 rounded-full bg-orange-400" /><span className="text-sm font-medium text-orange-700">Our turn — we need to act</span></>
                    )}
                    {detailInvestor.ball_in_court === "theirs" && (
                      <>
                        <span className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-sm font-medium text-emerald-700">Waiting on them</span>
                        {detailInvestor.ball_changed_at && daysBetween(detailInvestor.ball_changed_at) > 7 && (
                          <span className="text-xs text-amber-600 font-medium ml-1">(stale — {daysBetween(detailInvestor.ball_changed_at)}d)</span>
                        )}
                      </>
                    )}
                    {!detailInvestor.ball_in_court && <span className="text-sm text-slate-400">Not set</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div><p className="text-[10px] text-slate-400 uppercase">Last Sent</p><p className="text-xs text-slate-700">{formatShortDate(detailInvestor.last_outbound_at) || "-"}</p></div>
                    <div><p className="text-[10px] text-slate-400 uppercase">Last Received</p><p className="text-xs text-slate-700">{formatShortDate(detailInvestor.last_inbound_at) || "-"}</p></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${categoryBadge[detailInvestor.category] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>{detailInvestor.category}</span>
                  {detailInvestor.friend_of_ralph && <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200">Friend of Ralph</span>}
                  {detailInvestor.invested && <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">Invested</span>}
                </div>
                {editingDetail ? (
                  <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Edit Contact Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-slate-400 mb-0.5 block">First Name</label><input type="text" value={editDetail.first_name || ""} onChange={(e) => setEditDetail((p) => ({ ...p, first_name: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Last Name</label><input type="text" value={editDetail.last_name || ""} onChange={(e) => setEditDetail((p) => ({ ...p, last_name: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Email</label><input type="email" value={editDetail.email || ""} onChange={(e) => setEditDetail((p) => ({ ...p, email: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Phone</label><input type="text" value={editDetail.phone || ""} onChange={(e) => setEditDetail((p) => ({ ...p, phone: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Source</label>
                        <select value={editDetail.source || ""} onChange={(e) => setEditDetail((p) => ({ ...p, source: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                          {["Admin Added", "Referral", "LinkedIn", "Apollo", "Website", "Podcast", "Event", "Other"].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Preferred Tone</label><input type="text" value={editDetail.preferred_tone || ""} onChange={(e) => setEditDetail((p) => ({ ...p, preferred_tone: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Interest Amount ($)</label><input type="number" value={editDetail.amount_of_interest || 0} onChange={(e) => setEditDetail((p) => ({ ...p, amount_of_interest: Number(e.target.value) }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Invested Amount ($)</label><input type="number" value={editDetail.amount_invested || 0} onChange={(e) => setEditDetail((p) => ({ ...p, amount_invested: Number(e.target.value) }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Last Contact Date</label><input type="date" value={editDetail.last_contact_date || ""} onChange={(e) => setEditDetail((p) => ({ ...p, last_contact_date: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Added Date</label><input type="date" value={editDetail.added_date || ""} onChange={(e) => setEditDetail((p) => ({ ...p, added_date: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Next Action</label><input type="text" value={editDetail.next_action || ""} onChange={(e) => setEditDetail((p) => ({ ...p, next_action: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                      <div><label className="text-xs text-slate-400 mb-0.5 block">Next Action Date</label><input type="date" value={editDetail.next_action_date || ""} onChange={(e) => setEditDetail((p) => ({ ...p, next_action_date: e.target.value }))} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" /></div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-0.5 block">Notes</label>
                      <textarea value={editDetail.notes || ""} onChange={(e) => setEditDetail((p) => ({ ...p, notes: e.target.value }))} rows={4} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="edit-friend" checked={editDetail.friend_of_ralph || false} onChange={(e) => setEditDetail((p) => ({ ...p, friend_of_ralph: e.target.checked }))} className="rounded border-slate-300" />
                      <label htmlFor="edit-friend" className="text-sm text-slate-700">Friend of Ralph</label>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {[{ label: "Phone", value: detailInvestor.phone }, { label: "Source", value: detailInvestor.source }, { label: "Interest", value: detailInvestor.amount_of_interest > 0 ? fmt(detailInvestor.amount_of_interest) : null }, { label: "Invested", value: detailInvestor.amount_invested > 0 ? fmt(detailInvestor.amount_invested) : null }, { label: "Added", value: detailInvestor.added_date }, { label: "Last Contact", value: detailInvestor.last_contact_date }, { label: "Email Sequence", value: `#${detailInvestor.email_sequence}` }, { label: "Preferred Tone", value: detailInvestor.preferred_tone }].map((f) => (
                      <div key={f.label}><p className="text-xs text-slate-400 mb-0.5">{f.label}</p><p className="text-sm text-slate-900">{f.value || "-"}</p></div>
                    ))}
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Progress</p>
                  <div className="flex items-center gap-2">
                    {[{ label: "Zoom Sched.", done: detailInvestor.zoom_scheduled, key: "zoom_scheduled" }, { label: "Zoom Done", done: detailInvestor.zoom_completed, key: "zoom_completed" }, { label: "Docs Sent", done: detailInvestor.docs_sent, key: "docs_sent" }, { label: "Invested", done: detailInvestor.invested, key: "invested" }].map((step) => (
                      <button key={step.key} onClick={() => updateInvestor(detailInvestor.id, { [step.key]: !step.done } as Partial<Investor>)} className={`flex-1 text-center py-1.5 text-xs font-medium rounded-md border transition-colors ${step.done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`}>{step.label}</button>
                    ))}
                  </div>
                </div>
                {!editingDetail && (
                  <>
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
                  </>
                )}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Communication History</p>
                    {!addingComm ? (
                      <button onClick={() => setAddingComm(true)} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Entry
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => { setAddingComm(false); setNewComm({ type: "Email", direction: "inbound", subject: "", response: "", next_step: "" }); }} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                        <button onClick={saveCommEntry} className="text-xs text-slate-900 font-medium hover:text-slate-700">Save</button>
                      </div>
                    )}
                  </div>
                  {addingComm && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase block mb-0.5">Type</label>
                          <select value={newComm.type} onChange={(e) => setNewComm((p) => ({ ...p, type: e.target.value }))} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                            <option value="Email">Email</option>
                            <option value="Phone Call">Phone Call</option>
                            <option value="Zoom Meeting">Zoom Meeting</option>
                            <option value="Text Message">Text Message</option>
                            <option value="In Person">In Person</option>
                            <option value="Note">Note</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase block mb-0.5">Direction</label>
                          <select value={newComm.direction} onChange={(e) => setNewComm((p) => ({ ...p, direction: e.target.value }))} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                            <option value="inbound">Inbound (from them)</option>
                            <option value="outbound">Outbound (from us)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase block mb-0.5">Subject / Summary</label>
                        <input type="text" value={newComm.subject} onChange={(e) => setNewComm((p) => ({ ...p, subject: e.target.value }))} placeholder="e.g. Replied to intro email, interested in learning more" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase block mb-0.5">Response / Details (optional)</label>
                        <textarea value={newComm.response} onChange={(e) => setNewComm((p) => ({ ...p, response: e.target.value }))} rows={2} placeholder="Additional details about the interaction..." className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase block mb-0.5">Next Step (optional)</label>
                        <input type="text" value={newComm.next_step} onChange={(e) => setNewComm((p) => ({ ...p, next_step: e.target.value }))} placeholder="e.g. Schedule Zoom call next week" className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                      </div>
                    </div>
                  )}
                  {detailComms.length === 0 && !addingComm ? <p className="text-sm text-slate-400">No communications logged</p> : (
                    <div className="space-y-3">
                      {detailComms.slice(0, 10).map((c) => (
                        <div key={c.id} className="flex items-start gap-3 text-sm">
                          <div className="mt-1 shrink-0">
                            {c.direction === "outbound" ? (
                              <span className="text-orange-500 font-bold text-xs" title="Outbound">↑</span>
                            ) : c.direction === "inbound" ? (
                              <span className="text-emerald-500 font-bold text-xs" title="Inbound">↓</span>
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-0.5" />
                            )}
                          </div>
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

                {/* Body with template picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</label>
                    <span className="text-[10px] text-slate-400">Variables: {"{{first_name}}"} {"{{last_name}}"} {"{{full_name}}"}</span>
                  </div>
                  {templates.length > 0 && (
                    <div className="mb-2">
                      <select value={selectedTemplate} onChange={(e) => applyTemplate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                        <option value="">Load a template...</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}{t.sequence_group ? ` (${t.sequence_group})` : ""}</option>
                        ))}
                      </select>
                    </div>
                  )}
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
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-800">Draft saved to Ralph&apos;s Outlook with full branding</p>
                        {draftWebLink && (
                          <a href={draftWebLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                            Open in Outlook
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-slate-400">From: Ralph@PrimeDealerFund.com · {totalRecipientCount} recipient{totalRecipientCount !== 1 ? "s" : ""}</p>
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

      {/* ═══════════ ADD TASK MODAL ═══════════ */}
      <AnimatePresence>
        {addTaskOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/30 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddTaskOpen(false)} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">Add Task</h2>
                  <button onClick={() => setAddTaskOpen(false)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Title *</label>
                    <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Follow up with investor" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
                    <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Due Date *</label>
                      <input type="date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Priority</label>
                      <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Type</label>
                      <select value={newTask.type} onChange={(e) => setNewTask({ ...newTask, type: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                        <option value="follow-up">Follow Up</option>
                        <option value="call">Call</option>
                        <option value="email">Email</option>
                        <option value="meeting">Meeting</option>
                        <option value="document">Document</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Linked Investor</label>
                      <div className="relative">
                        <input type="text" value={taskInvestorSearch || (newTask.investor_id ? allInvestors.find(i => i.id === newTask.investor_id)?.first_name || "" : "")} onChange={(e) => { setTaskInvestorSearch(e.target.value); if (!e.target.value) setNewTask({ ...newTask, investor_id: "" }); }} placeholder="Search investor..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                        {taskInvestorSearch && taskInvestorResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                            {taskInvestorResults.map((inv) => (
                              <button key={inv.id} onClick={() => { setNewTask({ ...newTask, investor_id: inv.id }); setTaskInvestorSearch(`${inv.first_name} ${inv.last_name || ""}`); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm text-slate-700">{inv.first_name} {inv.last_name || ""}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                  <button onClick={() => setAddTaskOpen(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                  <button onClick={handleAddTask} disabled={!newTask.title.trim() || !newTask.due_date || addingTask} className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed">{addingTask ? "Adding..." : "Add Task"}</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ TASK DETAIL SLIDE-OVER ═══════════ */}
      <AnimatePresence>
        {taskDetail && (
          <>
            <motion.div className="fixed inset-0 bg-black/20 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTaskDetail(null)} />
            <motion.div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-slate-200 z-50 overflow-y-auto shadow-xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-base font-semibold text-slate-900">Task Details</h2>
                <button onClick={() => setTaskDetail(null)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="p-6 space-y-5">
                {!editingTask ? (
                  <>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" checked={taskDetail.completed} onChange={() => handleCompleteTask(taskDetail.id)} className="mt-1 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                      <div>
                        <h3 className={`text-lg font-semibold ${taskDetail.completed ? "text-slate-400 line-through" : "text-slate-900"}`}>{taskDetail.title}</h3>
                        {taskDetail.description && <p className="text-sm text-slate-600 mt-1">{taskDetail.description}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-xs text-slate-400 mb-0.5">Due Date</p><p className="text-sm text-slate-900">{formatShortDate(taskDetail.due_date)}</p></div>
                      <div><p className="text-xs text-slate-400 mb-0.5">Priority</p><p className="text-sm"><span className={`px-2 py-0.5 text-xs font-medium rounded ${taskDetail.priority === "urgent" ? "bg-red-100 text-red-700" : taskDetail.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{taskDetail.priority}</span></p></div>
                      <div><p className="text-xs text-slate-400 mb-0.5">Type</p><p className="text-sm text-slate-900">{taskDetail.type}</p></div>
                      <div><p className="text-xs text-slate-400 mb-0.5">Status</p><p className="text-sm text-slate-900">{taskDetail.completed ? "Completed" : "Open"}</p></div>
                    </div>
                    {taskDetail.investors && (
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Linked Investor</p>
                        <button onClick={() => { const inv = allInvestors.find(i => i.id === taskDetail.investors?.id); if (inv) { setTaskDetail(null); openDetail(inv); } }} className="text-sm text-blue-600 hover:text-blue-800">{taskDetail.investors.first_name} {taskDetail.investors.last_name || ""}</button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                      <button onClick={() => { setEditingTask(true); setEditTask({ title: taskDetail.title, description: taskDetail.description || "", due_date: taskDetail.due_date, priority: taskDetail.priority, investor_id: taskDetail.investor_id || "", type: taskDetail.type }); }} className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50">Edit</button>
                      <button onClick={() => { if (confirm("Delete this task?")) handleDeleteTask(taskDetail.id); }} className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50">Delete</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Title</label>
                      <input type="text" value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
                      <textarea value={editTask.description} onChange={(e) => setEditTask({ ...editTask, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Due Date</label>
                        <input type="date" value={editTask.due_date} onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Priority</label>
                        <select value={editTask.priority} onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400">
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                      <button onClick={() => setEditingTask(false)} className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                      <button onClick={handleUpdateTask} className="px-4 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800">Save Changes</button>
                    </div>
                  </>
                )}
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
