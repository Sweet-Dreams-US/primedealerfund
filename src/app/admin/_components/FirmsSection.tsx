"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Firm,
  OutreachContact,
  Channel,
  FirmType,
  Priority,
  RoleType,
  CHANNELS,
  CHANNEL_LABELS,
  CHANNEL_SHORT,
  CHANNEL_BADGE,
  FIRM_TYPES,
  FIRM_TYPE_LABELS,
  PRIORITIES,
  PRIORITY_LABELS,
  PRIORITY_RANK,
  PRIORITY_BADGE,
  ROLE_TYPES,
  ROLE_TYPE_LABELS,
  CHANNEL_STAGES,
  MANDATE_AREA_OPTIONS,
  fmtAum,
  creatorLabel,
} from "@/lib/outreach";

// ── Firm form ──────────────────────────────────────────────────────────────

type FirmForm = {
  name: string;
  firm_type: FirmType;
  channel: Channel;
  priority: Priority;
  city: string;
  state: string;
  website: string;
  linkedin_url: string;
  founded_year: string;
  aum_usd: string;
  source_of_wealth: string;
  mandate_areas: string;
  recent_activity: string;
  intro_path: string;
  regulatory_note: string;
  notes: string;
};

function emptyForm(): FirmForm {
  return {
    name: "",
    firm_type: "buy_sell_advisor",
    channel: "channel_2_buy_sell",
    priority: "medium",
    city: "",
    state: "",
    website: "",
    linkedin_url: "",
    founded_year: "",
    aum_usd: "",
    source_of_wealth: "",
    mandate_areas: "",
    recent_activity: "",
    intro_path: "",
    regulatory_note: "",
    notes: "",
  };
}

function firmToForm(f: Firm): FirmForm {
  return {
    name: f.name,
    firm_type: f.firm_type,
    channel: f.channel,
    priority: f.priority,
    city: f.city || "",
    state: f.state || "",
    website: f.website || "",
    linkedin_url: f.linkedin_url || "",
    founded_year: f.founded_year ? String(f.founded_year) : "",
    aum_usd: f.aum_usd ? String(f.aum_usd) : "",
    source_of_wealth: f.source_of_wealth || "",
    mandate_areas: (f.mandate_areas || []).join(", "),
    recent_activity: f.recent_activity || "",
    intro_path: f.intro_path || "",
    regulatory_note: f.regulatory_note || "",
    notes: f.notes || "",
  };
}

function formToPayload(form: FirmForm) {
  return {
    name: form.name.trim(),
    firm_type: form.firm_type,
    channel: form.channel,
    priority: form.priority,
    city: form.city.trim() || null,
    state: form.state.trim() || null,
    website: form.website.trim() || null,
    linkedin_url: form.linkedin_url.trim() || null,
    founded_year: form.founded_year ? Number(form.founded_year) : null,
    aum_usd: form.aum_usd ? Number(form.aum_usd) : null,
    source_of_wealth: form.source_of_wealth.trim() || null,
    // The API normalizes a comma-separated string into a text[].
    mandate_areas: form.mandate_areas.trim(),
    recent_activity: form.recent_activity.trim() || null,
    intro_path: form.intro_path.trim() || null,
    regulatory_note: form.regulatory_note.trim() || null,
    notes: form.notes.trim() || null,
  };
}

const inputCls =
  "w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400";
const labelCls = "text-xs text-slate-400 mb-0.5 block";

/** Shared firm field grid — used by both the Add modal and Edit mode. */
function FirmFields({
  form,
  setForm,
}: {
  form: FirmForm;
  setForm: (updater: (prev: FirmForm) => FirmForm) => void;
}) {
  const set = <K extends keyof FirmForm>(key: K, value: FirmForm[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="space-y-3">
      <div>
        <label className={labelCls}>Firm Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Kerrigan Advisors"
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Channel *</label>
          <select
            value={form.channel}
            onChange={(e) => set("channel", e.target.value as Channel)}
            className={inputCls}
          >
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {CHANNEL_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Firm Type *</label>
          <select
            value={form.firm_type}
            onChange={(e) => set("firm_type", e.target.value as FirmType)}
            className={inputCls}
          >
            {FIRM_TYPES.map((t) => (
              <option key={t} value={t}>
                {FIRM_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Priority</label>
          <select
            value={form.priority}
            onChange={(e) => set("priority", e.target.value as Priority)}
            className={inputCls}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>State</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            placeholder="2-letter"
            maxLength={2}
            className={inputCls}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Website</label>
          <input
            type="text"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>LinkedIn URL</label>
          <input
            type="text"
            value={form.linkedin_url}
            onChange={(e) => set("linkedin_url", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Founded Year</label>
          <input
            type="number"
            value={form.founded_year}
            onChange={(e) => set("founded_year", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>AUM (USD) — family offices</label>
          <input
            type="number"
            value={form.aum_usd}
            onChange={(e) => set("aum_usd", e.target.value)}
            placeholder="e.g. 500000000"
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Source of Wealth</label>
        <input
          type="text"
          value={form.source_of_wealth}
          onChange={(e) => set("source_of_wealth", e.target.value)}
          placeholder='e.g. "Auto distribution (Toyota)"'
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>
          Mandate Areas{" "}
          <span className="text-slate-300">
            (comma-separated — e.g. {MANDATE_AREA_OPTIONS.join(", ")})
          </span>
        </label>
        <input
          type="text"
          value={form.mandate_areas}
          onChange={(e) => set("mandate_areas", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Recent Activity (last 12 months)</label>
        <textarea
          value={form.recent_activity}
          onChange={(e) => set("recent_activity", e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>
      <div>
        <label className={labelCls}>Intro Path (warm-intro plan)</label>
        <textarea
          value={form.intro_path}
          onChange={(e) => set("intro_path", e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-amber-600 mb-0.5 block">
          Regulatory Note (Section 15 / broker-dealer caveat)
        </label>
        <textarea
          value={form.regulatory_note}
          onChange={(e) => set("regulatory_note", e.target.value)}
          rows={2}
          placeholder="Compensation-structure caveat for this firm — confirm with counsel before any fee conversation."
          className={`${inputCls} resize-none`}
        />
      </div>
      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>
    </div>
  );
}

// ── Add-contact-to-firm form ────────────────────────────────────────────────

type ContactForm = {
  first_name: string;
  last_name: string;
  email: string;
  title: string;
  role_type: RoleType;
  category: string;
};

function emptyContactForm(channel: Channel): ContactForm {
  return {
    first_name: "",
    last_name: "",
    email: "",
    title: "",
    role_type: "investor",
    category: CHANNEL_STAGES[channel][0],
  };
}

// ── Main section ────────────────────────────────────────────────────────────

export default function FirmsSection() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Detail slide-over
  const [detailFirm, setDetailFirm] = useState<Firm | null>(null);
  const [contacts, setContacts] = useState<OutreachContact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<FirmForm>(emptyForm());
  const [saving, setSaving] = useState(false);

  // Add-contact inline form
  const [addingContact, setAddingContact] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>(
    emptyContactForm("channel_2_buy_sell")
  );
  const [savingContact, setSavingContact] = useState(false);

  // Add-firm modal
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<FirmForm>(emptyForm());
  const [addError, setAddError] = useState<string | null>(null);

  const fetchFirms = useCallback(async () => {
    const params = new URLSearchParams();
    if (channelFilter !== "all") params.set("channel", channelFilter);
    if (typeFilter !== "all") params.set("firm_type", typeFilter);
    if (priorityFilter !== "all") params.set("priority", priorityFilter);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/admin/firms?${params}`);
    if (res.ok) setFirms(await res.json());
    setLoading(false);
  }, [channelFilter, typeFilter, priorityFilter, search]);

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  // Firms sorted by priority rank, then name — surfaces the top targets first.
  const sortedFirms = useMemo(() => {
    return [...firms].sort((a, b) => {
      const r = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      return r !== 0 ? r : a.name.localeCompare(b.name);
    });
  }, [firms]);

  function contactCount(f: Firm): number {
    return f.contacts?.[0]?.count ?? 0;
  }

  async function fetchContacts(firmId: string) {
    setContactsLoading(true);
    const res = await fetch(`/api/admin/investors?firm_id=${firmId}`);
    if (res.ok) setContacts(await res.json());
    else setContacts([]);
    setContactsLoading(false);
  }

  function openFirm(f: Firm) {
    setDetailFirm(f);
    setEditing(false);
    setAddingContact(false);
    setContacts([]);
    fetchContacts(f.id);
  }

  function closeFirm() {
    setDetailFirm(null);
    setContacts([]);
    setEditing(false);
    setAddingContact(false);
  }

  async function handleCreate() {
    if (!addForm.name.trim()) {
      setAddError("Firm name is required");
      return;
    }
    setSaving(true);
    setAddError(null);
    try {
      const res = await fetch("/api/admin/firms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToPayload(addForm)),
      });
      if (res.ok) {
        setAddOpen(false);
        setAddForm(emptyForm());
        fetchFirms();
      } else {
        const err = await res.json().catch(() => ({ error: "Failed to create firm" }));
        setAddError(err.error || "Failed to create firm");
      }
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Network error");
    }
    setSaving(false);
  }

  async function handleUpdate() {
    if (!detailFirm) return;
    if (!editForm.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/firms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: detailFirm.id, ...formToPayload(editForm) }),
      });
      if (res.ok) {
        const updated: Firm = await res.json();
        // Preserve the embedded contact count from the list fetch.
        setDetailFirm({ ...updated, contacts: detailFirm.contacts });
        setEditing(false);
        fetchFirms();
      }
    } catch {
      /* ignore — surfaced by leaving edit mode open */
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!detailFirm) return;
    const ok = window.confirm(
      `Delete ${detailFirm.name}?\n\nLinked contacts are kept — they are simply unlinked from this firm.`
    );
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/firms?id=${detailFirm.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        closeFirm();
        fetchFirms();
      }
    } catch {
      /* ignore */
    }
    setSaving(false);
  }

  async function handleAddContact() {
    if (!detailFirm || !contactForm.first_name.trim()) return;
    setSavingContact(true);
    try {
      const res = await fetch("/api/admin/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: contactForm.first_name.trim(),
          last_name: contactForm.last_name.trim() || null,
          email: contactForm.email.trim() || null,
          title: contactForm.title.trim() || null,
          role_type: contactForm.role_type,
          category: contactForm.category,
          channel: detailFirm.channel,
          firm_id: detailFirm.id,
          priority: detailFirm.priority,
          source: "Admin Added",
        }),
      });
      if (res.ok) {
        setAddingContact(false);
        setContactForm(emptyContactForm(detailFirm.channel));
        fetchContacts(detailFirm.id);
        fetchFirms();
      }
    } catch {
      /* ignore */
    }
    setSavingContact(false);
  }

  return (
    <div className="space-y-4">
      {/* Header + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search firms by name, city, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
          />
        </div>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
        >
          <option value="all">All Channels</option>
          {CHANNELS.map((c) => (
            <option key={c} value={c}>
              {CHANNEL_LABELS[c]}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
        >
          <option value="all">All Types</option>
          {FIRM_TYPES.map((t) => (
            <option key={t} value={t}>
              {FIRM_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
        >
          <option value="all">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-slate-500">{firms.length} firms</span>
          <button
            onClick={() => {
              setAddForm(emptyForm());
              setAddError(null);
              setAddOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Firm
          </button>
        </div>
      </div>

      {/* Firm table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : firms.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">
            No firms yet. Add advisory firms and family offices here, then link
            contacts to each.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Firm
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="p-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Contacts
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    AUM
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFirms.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => openFirm(f)}
                    className="border-b border-slate-100 transition-colors cursor-pointer hover:bg-slate-50/50"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{f.name}</p>
                        {creatorLabel(f.created_by) === "Cowork" && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200">
                            Cowork
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {FIRM_TYPE_LABELS[f.firm_type]}
                      </p>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${CHANNEL_BADGE[f.channel]}`}
                      >
                        {CHANNEL_SHORT[f.channel]}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${PRIORITY_BADGE[f.priority]}`}
                      >
                        {PRIORITY_LABELS[f.priority]}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-xs">
                      {[f.city, f.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="p-3 text-right font-mono text-xs text-slate-600">
                      {contactCount(f)}
                    </td>
                    <td className="p-3 text-slate-500 text-xs">
                      {fmtAum(f.aum_usd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Firm detail slide-over ── */}
      <AnimatePresence>
        {detailFirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeFirm}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-200 z-50 overflow-y-auto shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-900 truncate">
                    {detailFirm.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {FIRM_TYPE_LABELS[detailFirm.firm_type]} ·{" "}
                    {CHANNEL_SHORT[detailFirm.channel]}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!editing ? (
                    <button
                      onClick={() => {
                        setEditForm(firmToForm(detailFirm));
                        setEditing(true);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-40"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={closeFirm}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {editing ? (
                  <FirmFields form={editForm} setForm={setEditForm} />
                ) : (
                  <>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${CHANNEL_BADGE[detailFirm.channel]}`}
                      >
                        {CHANNEL_LABELS[detailFirm.channel]}
                      </span>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${PRIORITY_BADGE[detailFirm.priority]}`}
                      >
                        {PRIORITY_LABELS[detailFirm.priority]} priority
                      </span>
                    </div>

                    {/* Regulatory note — compliance caveat, surfaced prominently */}
                    {detailFirm.regulatory_note && (
                      <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                        <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
                          Regulatory Note · Section 15
                        </p>
                        <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">
                          {detailFirm.regulatory_note}
                        </p>
                      </div>
                    )}

                    {/* Facts grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Location",
                          value:
                            [detailFirm.city, detailFirm.state]
                              .filter(Boolean)
                              .join(", ") || null,
                        },
                        { label: "Founded", value: detailFirm.founded_year },
                        { label: "AUM", value: fmtAum(detailFirm.aum_usd) },
                        {
                          label: "Source of Wealth",
                          value: detailFirm.source_of_wealth,
                        },
                        {
                          label: "Added By",
                          value: creatorLabel(detailFirm.created_by),
                        },
                      ].map((fact) => (
                        <div key={fact.label}>
                          <p className="text-xs text-slate-400 mb-0.5">
                            {fact.label}
                          </p>
                          <p className="text-sm text-slate-900">
                            {fact.value || "—"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Links */}
                    {(detailFirm.website || detailFirm.linkedin_url) && (
                      <div className="flex flex-wrap gap-3">
                        {detailFirm.website && (
                          <a
                            href={
                              detailFirm.website.startsWith("http")
                                ? detailFirm.website
                                : `https://${detailFirm.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Website ↗
                          </a>
                        )}
                        {detailFirm.linkedin_url && (
                          <a
                            href={detailFirm.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            LinkedIn ↗
                          </a>
                        )}
                      </div>
                    )}

                    {/* Mandate areas */}
                    {detailFirm.mandate_areas &&
                      detailFirm.mandate_areas.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Mandate Areas
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {detailFirm.mandate_areas.map((m) => (
                              <span
                                key={m}
                                className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Text blocks */}
                    {detailFirm.intro_path && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Intro Path
                        </p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {detailFirm.intro_path}
                        </p>
                      </div>
                    )}
                    {detailFirm.recent_activity && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Recent Activity
                        </p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {detailFirm.recent_activity}
                        </p>
                      </div>
                    )}
                    {detailFirm.notes && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Notes
                        </p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {detailFirm.notes}
                        </p>
                      </div>
                    )}

                    {/* Contacts */}
                    <div className="border-t border-slate-100 pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Contacts ({contacts.length})
                        </p>
                        {!addingContact && (
                          <button
                            onClick={() => {
                              setContactForm(
                                emptyContactForm(detailFirm.channel)
                              );
                              setAddingContact(true);
                            }}
                            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Add Contact
                          </button>
                        )}
                      </div>

                      {addingContact && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="First name *"
                              value={contactForm.first_name}
                              onChange={(e) =>
                                setContactForm((p) => ({
                                  ...p,
                                  first_name: e.target.value,
                                }))
                              }
                              className={inputCls}
                            />
                            <input
                              type="text"
                              placeholder="Last name"
                              value={contactForm.last_name}
                              onChange={(e) =>
                                setContactForm((p) => ({
                                  ...p,
                                  last_name: e.target.value,
                                }))
                              }
                              className={inputCls}
                            />
                          </div>
                          <input
                            type="email"
                            placeholder="Email"
                            value={contactForm.email}
                            onChange={(e) =>
                              setContactForm((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                            className={inputCls}
                          />
                          <input
                            type="text"
                            placeholder="Title — e.g. Managing Director, CIO"
                            value={contactForm.title}
                            onChange={(e) =>
                              setContactForm((p) => ({
                                ...p,
                                title: e.target.value,
                              }))
                            }
                            className={inputCls}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={contactForm.role_type}
                              onChange={(e) =>
                                setContactForm((p) => ({
                                  ...p,
                                  role_type: e.target.value as RoleType,
                                }))
                              }
                              className={inputCls}
                            >
                              {ROLE_TYPES.map((r) => (
                                <option key={r} value={r}>
                                  {ROLE_TYPE_LABELS[r]}
                                </option>
                              ))}
                            </select>
                            <select
                              value={contactForm.category}
                              onChange={(e) =>
                                setContactForm((p) => ({
                                  ...p,
                                  category: e.target.value,
                                }))
                              }
                              className={inputCls}
                            >
                              {CHANNEL_STAGES[detailFirm.channel].map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => setAddingContact(false)}
                              className="text-xs text-slate-400 hover:text-slate-600"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleAddContact}
                              disabled={
                                savingContact ||
                                !contactForm.first_name.trim()
                              }
                              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 disabled:opacity-40 transition-colors"
                            >
                              {savingContact ? "Adding..." : "Add"}
                            </button>
                          </div>
                        </div>
                      )}

                      {contactsLoading ? (
                        <p className="text-xs text-slate-400 py-2">
                          Loading contacts...
                        </p>
                      ) : contacts.length === 0 ? (
                        <p className="text-xs text-slate-400 py-2">
                          No contacts linked to this firm yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {contacts.map((c) => (
                            <div
                              key={c.id}
                              className="flex items-start justify-between gap-3 border border-slate-200 rounded-lg p-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900">
                                  {c.first_name} {c.last_name || ""}
                                </p>
                                {c.title && (
                                  <p className="text-xs text-slate-500">
                                    {c.title}
                                  </p>
                                )}
                                {c.email && (
                                  <p className="text-xs text-slate-400 truncate">
                                    {c.email}
                                  </p>
                                )}
                                {creatorLabel(c.created_by) === "Cowork" && (
                                  <p className="text-[10px] font-medium text-violet-600 mt-0.5">
                                    Added by Cowork
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600">
                                  {c.category}
                                </span>
                                {c.role_type && c.role_type !== "investor" && (
                                  <span className="text-[10px] text-violet-600 font-medium">
                                    {ROLE_TYPE_LABELS[c.role_type]}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Delete */}
                    <div className="border-t border-slate-100 pt-4 flex justify-end">
                      <button
                        onClick={handleDelete}
                        disabled={saving}
                        className="text-xs text-slate-400 hover:text-red-600 underline transition-colors disabled:opacity-40"
                      >
                        Delete firm
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Add-firm modal ── */}
      <AnimatePresence>
        {addOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
                initial={{ scale: 0.96, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 10 }}
              >
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Add Firm
                  </h2>
                  <button
                    onClick={() => setAddOpen(false)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <FirmFields form={addForm} setForm={setAddForm} />
                  {addError && (
                    <p className="text-xs text-red-600 mt-3">{addError}</p>
                  )}
                  <div className="flex items-center justify-end gap-2 mt-5">
                    <button
                      onClick={() => setAddOpen(false)}
                      className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreate}
                      disabled={saving || !addForm.name.trim()}
                      className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
                    >
                      {saving ? "Creating..." : "Create Firm"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
