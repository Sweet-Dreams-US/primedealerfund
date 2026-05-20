"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  OutreachContact,
  Channel,
  CHANNELS,
  CHANNEL_LABELS,
  CHANNEL_SHORT,
  CHANNEL_STAGES,
  PRIORITY_BADGE,
  PRIORITY_LABELS,
  daysSince,
} from "@/lib/outreach";

// Stage column accent colors, cycled across a channel's stages.
const COLUMN_ACCENTS = [
  "border-t-slate-300",
  "border-t-sky-300",
  "border-t-violet-300",
  "border-t-amber-300",
  "border-t-emerald-300",
  "border-t-rose-300",
  "border-t-indigo-300",
  "border-t-teal-300",
];

function ballDot(ball: OutreachContact["ball_in_court"]) {
  if (ball === "ours") return "bg-orange-400";
  if (ball === "theirs") return "bg-emerald-400";
  return "bg-slate-200";
}

export default function PipelineSection() {
  const [channel, setChannel] = useState<Channel>("channel_2_buy_sell");
  const [contacts, setContacts] = useState<OutreachContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/investors?channel=${channel}`);
    if (res.ok) setContacts(await res.json());
    else setContacts([]);
    setLoading(false);
  }, [channel]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const stages = CHANNEL_STAGES[channel];

  // Bucket contacts by their category. Anything whose category isn't a known
  // stage for this channel lands in an "Unsorted" bucket so it's never lost.
  const { byStage, unsorted } = useMemo(() => {
    const map: Record<string, OutreachContact[]> = {};
    stages.forEach((s) => {
      map[s] = [];
    });
    const orphans: OutreachContact[] = [];
    contacts.forEach((c) => {
      if (map[c.category]) map[c.category].push(c);
      else orphans.push(c);
    });
    return { byStage: map, unsorted: orphans };
  }, [contacts, stages]);

  async function moveStage(contact: OutreachContact, newCategory: string) {
    if (newCategory === contact.category) return;
    // Optimistic update — revert on failure.
    const prev = contacts;
    setContacts((cur) =>
      cur.map((c) => (c.id === contact.id ? { ...c, category: newCategory } : c))
    );
    try {
      const res = await fetch("/api/admin/investors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contact.id, category: newCategory }),
      });
      if (!res.ok) setContacts(prev);
    } catch {
      setContacts(prev);
    }
  }

  const renderCard = (c: OutreachContact) => {
    const lastTouch = daysSince(c.last_outbound_at);
    const stale = c.ball_in_court === "ours" && lastTouch !== null && lastTouch > 14;
    return (
      <div
        key={c.id}
        className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow transition-shadow"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {c.first_name} {c.last_name || ""}
            </p>
            {c.title && (
              <p className="text-[11px] text-slate-500 truncate">{c.title}</p>
            )}
            {c.firm?.name && (
              <p className="text-[11px] text-slate-400 truncate">
                {c.firm.name}
              </p>
            )}
          </div>
          {c.priority && (
            <span
              className={`shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded-full ring-1 ring-inset ${PRIORITY_BADGE[c.priority]}`}
            >
              {PRIORITY_LABELS[c.priority]}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${ballDot(c.ball_in_court)}`}
            title={
              c.ball_in_court === "ours"
                ? "Our turn"
                : c.ball_in_court === "theirs"
                ? "Waiting on them"
                : "No status"
            }
          />
          <span className="text-[10px] text-slate-400">
            {lastTouch === null
              ? "Not contacted"
              : lastTouch === 0
              ? "Touched today"
              : `${lastTouch}d since outreach`}
          </span>
          {stale && (
            <span className="text-[10px] font-semibold text-amber-600">
              · stale
            </span>
          )}
        </div>

        {c.role_type && c.role_type !== "investor" && (
          <p className="text-[10px] text-violet-600 font-medium mt-1">
            {c.role_type === "conduit" ? "Conduit" : "Investor + Conduit"}
          </p>
        )}

        <select
          value={c.category}
          onChange={(e) => moveStage(c, e.target.value)}
          className="mt-2 w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
        >
          {/* Known stages for this channel, plus the contact's current
              category if it falls outside them, so the value always matches. */}
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          {!stages.includes(c.category) && (
            <option value={c.category}>{c.category} (current)</option>
          )}
        </select>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Channel tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {CHANNELS.map((ch) => (
          <button
            key={ch}
            onClick={() => setChannel(ch)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              channel === ch
                ? "bg-slate-900 text-white font-medium"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {CHANNEL_LABELS[ch]}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-500">
          {contacts.length} contacts
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-min">
            {stages.map((stage, i) => (
              <div key={stage} className="w-64 shrink-0">
                <div
                  className={`bg-slate-50 border border-slate-200 border-t-2 ${
                    COLUMN_ACCENTS[i % COLUMN_ACCENTS.length]
                  } rounded-t-lg px-3 py-2 flex items-center justify-between`}
                >
                  <span className="text-xs font-semibold text-slate-700">
                    {stage}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {byStage[stage].length}
                  </span>
                </div>
                <div className="bg-slate-50/50 border border-t-0 border-slate-200 rounded-b-lg p-2 space-y-2 min-h-[120px]">
                  {byStage[stage].length === 0 ? (
                    <p className="text-[11px] text-slate-300 text-center py-4">
                      Empty
                    </p>
                  ) : (
                    byStage[stage].map(renderCard)
                  )}
                </div>
              </div>
            ))}

            {/* Unsorted — contacts on a category outside this channel's stages */}
            {unsorted.length > 0 && (
              <div className="w-64 shrink-0">
                <div className="bg-amber-50 border border-amber-200 border-t-2 border-t-amber-300 rounded-t-lg px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-800">
                    Unsorted
                  </span>
                  <span className="text-xs font-medium text-amber-500">
                    {unsorted.length}
                  </span>
                </div>
                <div className="bg-amber-50/40 border border-t-0 border-amber-200 rounded-b-lg p-2 space-y-2 min-h-[120px]">
                  {unsorted.map(renderCard)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && contacts.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-sm text-slate-400">
            No {CHANNEL_SHORT[channel]} contacts yet. Add firms and contacts in
            the Firms tab, or set a contact&apos;s channel in the Investors tab.
          </p>
        </div>
      )}
    </div>
  );
}
