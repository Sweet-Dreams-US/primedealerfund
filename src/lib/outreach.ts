// ============================================================================
// Outreach domain types & labels — Channels 2 (buy-sell advisors) and 3
// (family offices). Single source of truth shared by the admin Firms and
// Pipeline sections. The string unions here mirror the Postgres CHECK
// constraints in the outreach_channels migration — keep them in sync.
// ============================================================================

export type Channel =
  | "channel_1_industry"
  | "channel_2_buy_sell"
  | "channel_3_family_office";

export type FirmType =
  | "buy_sell_advisor"
  | "cpa_dealer_practice"
  | "dealer_law_firm"
  | "wealth_advisor"
  | "family_office_sfo"
  | "family_office_mfo"
  | "peer_network"
  | "dealer_group"
  | "industry_association"
  | "other";

export type Priority = "top" | "high" | "medium" | "low" | "watch";

export type RoleType = "investor" | "conduit" | "both";

export type Firm = {
  id: string;
  name: string;
  firm_type: FirmType;
  channel: Channel;
  city: string | null;
  state: string | null;
  country: string | null;
  website: string | null;
  linkedin_url: string | null;
  hq_address: string | null;
  founded_year: number | null;
  aum_usd: number | null;
  source_of_wealth: string | null;
  mandate_areas: string[] | null;
  recent_activity: string | null;
  priority: Priority;
  regulatory_note: string | null;
  intro_path: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Embedded contact count from PostgREST: investors(count)
  contacts?: { count: number }[];
};

// A contact (investors row) as used by the outreach views. The investors
// table has many more columns — this is the subset the Firms / Pipeline
// sections read.
export type OutreachContact = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  linkedin_url: string | null;
  category: string;
  channel: Channel | null;
  role_type: RoleType | null;
  priority: Priority | null;
  firm_id: string | null;
  regulatory_note: string | null;
  notes: string | null;
  amount_of_interest: number;
  ball_in_court: "ours" | "theirs" | null;
  ball_changed_at: string | null;
  last_outbound_at: string | null;
  last_inbound_at: string | null;
  firm?: { id: string; name: string; channel: Channel; firm_type: FirmType; priority: Priority } | null;
};

export const CHANNELS: Channel[] = [
  "channel_1_industry",
  "channel_2_buy_sell",
  "channel_3_family_office",
];

export const CHANNEL_LABELS: Record<Channel, string> = {
  channel_1_industry: "Channel 1 — Industry Network",
  channel_2_buy_sell: "Channel 2 — Buy-Sell Advisors",
  channel_3_family_office: "Channel 3 — Family Offices",
};

export const CHANNEL_SHORT: Record<Channel, string> = {
  channel_1_industry: "Industry",
  channel_2_buy_sell: "Buy-Sell",
  channel_3_family_office: "Family Office",
};

export const CHANNEL_BADGE: Record<Channel, string> = {
  channel_1_industry: "bg-slate-100 text-slate-600 ring-slate-200",
  channel_2_buy_sell: "bg-sky-50 text-sky-700 ring-sky-200",
  channel_3_family_office: "bg-violet-50 text-violet-700 ring-violet-200",
};

export const FIRM_TYPES: FirmType[] = [
  "buy_sell_advisor",
  "cpa_dealer_practice",
  "dealer_law_firm",
  "wealth_advisor",
  "family_office_sfo",
  "family_office_mfo",
  "peer_network",
  "dealer_group",
  "industry_association",
  "other",
];

export const FIRM_TYPE_LABELS: Record<FirmType, string> = {
  buy_sell_advisor: "Buy-Sell Advisor",
  cpa_dealer_practice: "CPA / Dealer Practice",
  dealer_law_firm: "Dealer Law Firm",
  wealth_advisor: "Wealth Advisor",
  family_office_sfo: "Single-Family Office",
  family_office_mfo: "Multi-Family Office",
  peer_network: "Peer Network",
  dealer_group: "Dealer Group",
  industry_association: "Industry Association",
  other: "Other",
};

export const PRIORITIES: Priority[] = ["top", "high", "medium", "low", "watch"];

export const PRIORITY_LABELS: Record<Priority, string> = {
  top: "Top",
  high: "High",
  medium: "Medium",
  low: "Low",
  watch: "Watch",
};

export const PRIORITY_RANK: Record<Priority, number> = {
  top: 0,
  high: 1,
  medium: 2,
  low: 3,
  watch: 4,
};

export const PRIORITY_BADGE: Record<Priority, string> = {
  top: "bg-rose-50 text-rose-700 ring-rose-200",
  high: "bg-amber-50 text-amber-700 ring-amber-200",
  medium: "bg-sky-50 text-sky-700 ring-sky-200",
  low: "bg-slate-50 text-slate-600 ring-slate-200",
  watch: "bg-slate-50 text-slate-400 ring-slate-200",
};

export const ROLE_TYPES: RoleType[] = ["investor", "conduit", "both"];

export const ROLE_TYPE_LABELS: Record<RoleType, string> = {
  investor: "Investor",
  conduit: "Conduit (introducer)",
  both: "Investor + Conduit",
};

// Pipeline stages per channel. These values are stored in investors.category
// and are all permitted by the widened investors_category_check constraint.
export const CHANNEL_STAGES: Record<Channel, string[]> = {
  channel_1_industry: [
    "New Lead",
    "Had Zoom - No Commitment",
    "Friend - Possible Investor",
    "Current Investor",
    "Never Responded",
  ],
  channel_2_buy_sell: [
    "Identified",
    "First Touch",
    "Introductory Call",
    "Active Conduit",
    "Cold",
  ],
  channel_3_family_office: [
    "Identified",
    "First Touch",
    "Discovery Call",
    "Diligence",
    "IC Review",
    "Committed",
    "Wired",
    "Pass",
  ],
};

// Common family-office mandate tags (free-form, but these are the defaults).
export const MANDATE_AREA_OPTIONS = [
  "pe_direct",
  "re",
  "vc",
  "emerging_manager",
  "co_invest",
];

/** Format a USD amount-under-management figure compactly. */
export function fmtAum(n: number | null | undefined): string {
  if (!n || n <= 0) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

/** Whole days since an ISO timestamp, or null when the input is empty. */
export function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / 86_400_000);
}
