// ============================================================================
// Prime Dealer University — 2026 Blog Curriculum (planned chapters).
// Source: .claude/plans/2026-blog-curriculum-may-dec.md
//
// 35 chapters, one per Wednesday, May 6 -> Dec 30, 2026. The admin Analytics
// tab cross-references this plan against the live blogPosts to show which
// chapters are published, scheduled, or still unwritten — so the team can
// pick what to write next.
// ============================================================================

export type PlannedChapter = {
  number: number;
  module: number;
  date: string; // ISO YYYY-MM-DD — the scheduled Wednesday
  title: string;
};

export type BlogModule = {
  number: number;
  name: string;
  range: string; // human-readable date span
};

export const blogModules: BlogModule[] = [
  { number: 1, name: "Industry Foundations", range: "May 6 – Jun 24" },
  { number: 2, name: "Variable Operations Deep Dive", range: "Jul 1 – Jul 29" },
  { number: 3, name: "The Service & Parts Engine", range: "Aug 5 – Aug 26" },
  { number: 4, name: "F&I Deep Dive", range: "Sep 2 – Sep 16" },
  { number: 5, name: "PE Fund Mechanics for Investors", range: "Sep 23 – Oct 28" },
  { number: 6, name: "Operations & Multi-Unit Management", range: "Nov 4 – Nov 25" },
  { number: 7, name: "Risk, Governance & Strategy", range: "Dec 2 – Dec 30" },
];

export const blogPlan: PlannedChapter[] = [
  // Module 1 — Industry Foundations
  { number: 1, module: 1, date: "2026-05-06", title: "Anatomy of a Dealership: The Seven Profit Centers Most Investors Don't See" },
  { number: 2, module: 1, date: "2026-05-13", title: "Reading a Dealership Financial Statement: A Guided Walk Through the NADA Composite" },
  { number: 3, module: 1, date: "2026-05-20", title: "Floor Plan Financing Explained: The Hidden Cost of Holding Inventory" },
  { number: 4, module: 1, date: "2026-05-27", title: "Days Supply, Turn Rate, and Aged Inventory: The Math That Kills Dealership Profit" },
  { number: 5, module: 1, date: "2026-06-03", title: "Inside the OEM Franchise Agreement: What Manufacturers Actually Control" },
  { number: 6, module: 1, date: "2026-06-10", title: "OEM Allocation, Holdback, and Stair-Step Bonuses: How Manufacturers Pay Dealers" },
  { number: 7, module: 1, date: "2026-06-17", title: "The Image Program: When Manufacturers Force a $2 Million Renovation" },
  { number: 8, module: 1, date: "2026-06-24", title: "Dealer Licensing and the Regulatory Maze: FTC Safeguards, ECOA, and Lemon Laws" },
  // Module 2 — Variable Operations Deep Dive
  { number: 9, module: 2, date: "2026-07-01", title: "The Modern Road to the Sale: Inside the Dealership Sales Process" },
  { number: 10, module: 2, date: "2026-07-08", title: "Desking the Deal: How Front-End Gross Profit Is Built" },
  { number: 11, module: 2, date: "2026-07-15", title: "Trade-In Appraisal and the Wholesale Market: vAuto, Black Book, and Manheim" },
  { number: 12, module: 2, date: "2026-07-22", title: "Digital Retailing: How Online Sales Are Reshaping the Showroom" },
  { number: 13, module: 2, date: "2026-07-29", title: "The BDC: Why Lead Response Time Is the #1 Conversion Lever" },
  // Module 3 — The Service & Parts Engine
  { number: 14, module: 3, date: "2026-08-05", title: "Effective Labor Rate vs. Posted Labor Rate: How Service Profit Is Engineered" },
  { number: 15, module: 3, date: "2026-08-12", title: "Technician Pay Plans: Flat Rate, Hourly, or Hybrid?" },
  { number: 16, module: 3, date: "2026-08-19", title: "The Parts Inventory Discipline: Fill Rate, Obsolescence, and Turns" },
  { number: 17, module: 3, date: "2026-08-26", title: "Warranty Administration: The Hidden Reimbursement Most Dealers Leave on the Table" },
  // Module 4 — F&I Deep Dive
  { number: 18, module: 4, date: "2026-09-02", title: "The F&I Menu Deconstructed: How VSC, GAP, and Tire & Wheel Add $1,500 to Every Deal" },
  { number: 19, module: 4, date: "2026-09-09", title: "Reinsurance and DOWCs: How Dealers Build Wealth Inside Their Own Warranties" },
  { number: 20, module: 4, date: "2026-09-16", title: "F&I Compliance: TILA, ECOA, the Red Flags Rule, and AFIP Certification" },
  // Module 5 — PE Fund Mechanics for Investors
  { number: 21, module: 5, date: "2026-09-23", title: "Reg D 506(c) Explained: The Securities Rule That Lets Us Market Publicly" },
  { number: 22, module: 5, date: "2026-09-30", title: "Inside the Private Placement Memorandum: What's in a PPM and Why Each Section Matters" },
  { number: 23, module: 5, date: "2026-10-07", title: "Side Letters and MFN Provisions: How Sophisticated LPs Negotiate Beyond the LPA" },
  { number: 24, module: 5, date: "2026-10-14", title: "Quality of Earnings: How We Verify a Target Dealership's True Earning Power" },
  { number: 25, module: 5, date: "2026-10-21", title: "Senior Debt, Mezzanine, and Floor Plan: How a Dealership Acquisition Is Capitalized" },
  { number: 26, module: 5, date: "2026-10-28", title: "Section 1202 QSBS and the Carry Holding Period: The Tax Efficiency of Dealership Investing" },
  // Module 6 — Operations & Multi-Unit Management
  { number: 27, module: 6, date: "2026-11-04", title: "Multi-Rooftop Management: Centralized Shared Services vs. Local Autonomy" },
  { number: 28, module: 6, date: "2026-11-11", title: "Building a Talent Pipeline: Why Technician Recruiting Is the Real Bottleneck to Scale" },
  { number: 29, module: 6, date: "2026-11-18", title: "KPIs and the Daily Operating Control: How a Multi-Store Group Runs Its Numbers" },
  { number: 30, module: 6, date: "2026-11-25", title: "AI in the Service Drive: Predictive Maintenance and Customer Retention at Scale" },
  // Module 7 — Risk, Governance & Strategy
  { number: 31, module: 7, date: "2026-12-02", title: "Insurance for a Dealership Group: Garage Liability, Dealer Open Lot, Cyber, and EPLI" },
  { number: 32, module: 7, date: "2026-12-09", title: "CSI and JD Power: Why Customer Satisfaction Drives Real OEM Bonuses" },
  { number: 33, module: 7, date: "2026-12-16", title: "The Blue Sky Multiple: How Dealerships Are Valued in M&A" },
  { number: 34, module: 7, date: "2026-12-23", title: "Cybersecurity in Dealerships: The FTC Safeguards Rule and the Real Threats" },
  { number: 35, module: 7, date: "2026-12-30", title: "The Year in Review and the Road to 40: Where Coleman Prime Goes in 2027" },
];
