import type { BlogPost } from "./blog-types";

/**
 * Modules 2–5 (Chapters 9–24) — Variable Operations, Service & Parts, F&I,
 * and PE Fund Mechanics. One chapter per Wednesday, Jul 1 -> Oct 14, 2026.
 * Ordered newest-first so the latest chapter is featured on /insights.
 */
export const julOct2026Posts: BlogPost[] = [
  {
    slug: "quality-of-earnings-dealership-acquisition-diligence",
    category: "Fund Mechanics",
    title:
      "Quality of Earnings: How We Verify a Target Dealership's True Earning Power",
    subtitle:
      "A dealership's reported profit is the starting point of diligence, not the answer. A quality of earnings analysis rebuilds earnings from the ground up — and in dealerships, the adjustments are unusually specific.",
    author: "Ralph Marcuccilli",
    authorRole: "Managing Partner — Prime Dealer Equity Fund",
    date: "October 14, 2026",
    readTime: "12 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawSticker.webp",
      alt: "Window sticker on a vehicle at Nissan of Warsaw",
      caption:
        "Window sticker on a vehicle at Nissan of Warsaw, a Coleman Automotive dealership. The price on the sticker is rarely the whole story, and neither is the bottom line on a seller's financial statement. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Dealership acquisitions are priced on earnings, so the earnings figure has to be right. A quality of earnings analysis normalizes owner compensation, related-party rent, LIFO, factory incentive timing, F&I chargeback reserves, and floor plan costs to reveal what a store actually earns. This chapter walks through each adjustment with illustrative examples.",
    content: [
      {
        type: "paragraph",
        text: "When a dealership changes hands, the price for the business — the goodwill, often called \"blue sky\" — is typically expressed as a multiple of the store's adjusted pre-tax earnings. That makes the earnings number the single most consequential figure in the transaction. If a buyer overstates earnings by $500,000 and applies, for example, a 5x multiple, it has overpaid by $2.5 million before the keys change hands.",
      },
      {
        type: "paragraph",
        text: "The problem is that the earnings figure a seller presents is almost never the figure a buyer should use. Privately owned dealerships are run to serve their owners, not to produce clean financial statements for outside investors. Owner compensation, family payroll, personal expenses, related-party real estate, tax-driven inventory accounting, and the timing of manufacturer payments can all move reported profit materially in either direction. A quality of earnings analysis — QoE — is the discipline of sorting through those items to arrive at a defensible, repeatable earnings figure.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through what a QoE is, the adjustments that are specific to franchised dealerships, and how Coleman Prime approaches earnings verification as part of acquisition diligence. The figures throughout are illustrative examples, not data from any actual transaction.",
      },
      { type: "subheading", text: "What a Quality of Earnings Analysis Is — and Isn't" },
      {
        type: "paragraph",
        text: "A QoE is not an audit. An audit tests whether financial statements are fairly presented under accounting standards. A QoE asks a different question: what are the sustainable, recurring earnings of this business under new ownership? It starts with reported results — usually the trailing twelve months and the two or three prior years — and works through a series of documented adjustments to reach normalized, or adjusted, earnings.",
      },
      {
        type: "paragraph",
        text: "Dealerships provide unusually rich source material for this work. Every franchised store submits a monthly financial statement to its manufacturer in a standardized format, as we covered in our chapter on reading the NADA-style dealer financial statement. Those statements break out each department's gross profit and expenses in detail. A QoE reconciles them to the store's general ledger, its tax returns, and its bank activity — a \"proof of cash\" — and then adjusts for items that won't continue, or will look different, after the sale.",
      },
      { type: "subheading", text: "Owner Compensation and Personal Expenses" },
      {
        type: "paragraph",
        text: "The most common adjustments involve the owner. A dealer principal may draw a salary far above or below what a hired general manager would earn. Family members may be on payroll at above-market pay, or working without pay at all. The store may carry vehicles, insurance, travel, club memberships, or other expenses that serve the owner personally. Each of these needs to be identified and replaced with the cost the business will actually bear under new ownership.",
      },
      {
        type: "paragraph",
        text: "Consider an illustrative example. An owner pays himself $900,000 a year, and his two adult children are on payroll at $150,000 each in roles a buyer would fill for $90,000 each. Under new ownership, a general manager might cost $400,000 including a performance plan. The normalization adds back $500,000 on the owner's compensation and $120,000 on the family roles, raising adjusted earnings by $620,000. The adjustment can just as easily run the other way: an owner who draws no salary and works sixty hours a week is subsidizing the store's profitability, and a QoE must deduct the cost of replacing that labor.",
      },
      { type: "subheading", text: "Related-Party Rent and the Real Estate Question" },
      {
        type: "paragraph",
        text: "Many dealer principals own their store's real estate in a separate entity and lease it to the dealership. The rent is set by the owner, often for tax or estate-planning reasons rather than market reasons. A store paying itself $1.2 million a year on a property with a market rent of $800,000 shows earnings $400,000 lower than its operations justify. A store paying $300,000 on the same property is overstating its earning power by $500,000.",
      },
      {
        type: "paragraph",
        text: "A QoE normalizes rent to the terms that will actually apply after closing. If the buyer is acquiring the real estate, rent may be replaced with the carrying cost of ownership. If the buyer will lease from the seller, the new lease rate becomes the benchmark — which is why the lease negotiation and the earnings analysis have to happen together. Either way, the adjustment is grounded in an independent view of market rent, not the seller's historical number.",
      },
      {
        type: "callout-numbers",
        title: "Illustrative Normalization: A Single-Store QoE",
        lines: [
          "Reported pre-tax earnings: $2,400,000",
          "Owner and family compensation normalized to market: +$620,000",
          "Related-party rent normalized to market (above-market rent removed): +$400,000",
          "Prior-year stair-step bonus recorded in the current period: −$350,000",
          "F&I chargeback reserve increased to match cancellation experience: −$180,000",
          "Illustrative adjusted pre-tax earnings: $2,890,000 — all figures hypothetical",
        ],
        link: {
          text: "See how Coleman Prime underwrites acquisitions",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "LIFO Inventory Accounting" },
      {
        type: "paragraph",
        text: "Many dealerships use the last-in, first-out (LIFO) inventory method for tax purposes. When vehicle costs rise, LIFO charges the most recent, higher costs against revenue, lowering taxable income. The difference between inventory valued at LIFO and at current cost accumulates on the balance sheet as the LIFO reserve, and the year-over-year change in that reserve flows through cost of sales.",
      },
      {
        type: "paragraph",
        text: "For a QoE, LIFO creates two issues. First, changes in the LIFO reserve can swing reported earnings by hundreds of thousands of dollars in a year — sharply in an inflationary period, and in reverse when inventory levels fall and older, lower-cost layers are liquidated. Analysts typically remove the LIFO effect to look at earnings on a consistent, current-cost basis. Second, in an asset sale, the seller generally faces recapture of the accumulated LIFO reserve as taxable income, which can affect how a seller approaches price and deal structure. Inventory itself is usually purchased separately at closing at an agreed cost basis, so the QoE and the purchase agreement need to treat it consistently.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/ServiceDepartment.jpg",
        alt: "Service department at Nissan of Elgin",
        caption:
          "Service department at Nissan of Elgin, a Coleman Automotive dealership in Illinois. Department-level financial detail is the raw material for a dealership quality of earnings analysis. Photo: Sweet Dreams US LLC",
      },
      { type: "subheading", text: "Factory Incentive Timing" },
      {
        type: "paragraph",
        text: "As we covered in our chapter on OEM allocation, holdback, and stair-step bonuses, a meaningful share of a store's new-vehicle profit can come from manufacturer programs rather than from the deal itself. Those programs create timing problems. Stair-step and volume bonuses may be earned in one month or quarter and paid in another. Some dealers record incentives when cash arrives rather than when earned. Programs are frequently changed or discontinued, and one-time payments — a launch bonus, a facility-related program, a special settlement — may not recur. A QoE matches incentives to the period in which they were earned, separates recurring program income from one-time items, and asks whether the trailing twelve months reflect the programs that will actually be in place going forward. It also tests incentive receivables: claims that have been recorded but not yet paid by the manufacturer, and any exposure to chargeback if a manufacturer audit disallows a claim.",
      },
      { type: "subheading", text: "F&I Chargeback Reserves" },
      {
        type: "paragraph",
        text: "When a customer buys a vehicle service contract, GAP coverage, or other product, the dealer typically recognizes its commission at the time of sale. If the customer later pays off the loan early, trades the vehicle, or cancels the product, a pro-rata share of that commission is charged back to the dealer. Lenders can also charge back finance reserve on loans that pay off or default early.",
      },
      {
        type: "paragraph",
        text: "Well-run stores accrue a reserve for future chargebacks based on their actual cancellation experience. Many smaller stores under-reserve or don't reserve at all, booking chargebacks only as they hit. That overstates current earnings, especially in a store whose F&I volume has grown. A QoE analyzes historical cancellation rates by product and term and sets the reserve accordingly. Where a store participates in a dealer-owned reinsurance company or similar structure, as we covered in our chapter on reinsurance and DOWCs, the QoE also determines what income belongs to the dealership, what belongs to the owner outside the store, and what will transfer in the sale.",
      },
      { type: "subheading", text: "Floor Plan and Other Dealership-Specific Items" },
      {
        type: "paragraph",
        text: "In most businesses, interest is a financing cost that sits below operating earnings. In a dealership, floor plan interest is treated as an operating expense, because inventory financing is part of how the store does business — one reason dealership earnings are usually discussed on a pre-tax basis rather than as EBITDA. A QoE normalizes floor plan cost for the interest-rate environment and inventory levels a buyer expects, nets it against any manufacturer floor plan assistance, and checks that historical inventory levels reflected normal operations rather than shortages or overstock.",
      },
      {
        type: "paragraph",
        text: "Other dealership items include used-vehicle inventory valuation (are aged units carried above their realistic wholesale value?), policy and goodwill expenses, manufacturer warranty audit exposure, demonstrator expense, and the normalization of unusually strong or weak periods. The years immediately following the 2021–2022 inventory shortage are a well-known example: per-unit vehicle grosses across the industry were elevated relative to historical norms, and a buyer who capitalized those margins as permanent would have overpaid. A QoE asks which earnings level is genuinely repeatable. Fixed operations deserve the same scrutiny. Service and parts earnings are usually the most stable part of a dealership's profit, but a QoE still tests them: whether customer-pay labor is growing or flat, whether warranty volume reflects a temporary recall campaign, whether internal reconditioning charges between departments are priced consistently, and whether technician staffing supports the hours being billed. A store whose fixed operations depend on one or two veteran technicians has a different risk profile than its income statement alone suggests.",
      },
      { type: "subheading", text: "From QoE to Price and Structure" },
      {
        type: "paragraph",
        text: "The output of a QoE is not just a number. It is a documented bridge from reported to adjusted earnings, with each adjustment supported by evidence and categorized by confidence. Some adjustments are certain — an owner's salary will end at closing. Others depend on judgment — what incentive programs will look like next year. That distinction matters in negotiation: buyers and sellers often agree on the certain adjustments and spend most of their time on the judgment calls. The QoE also informs deal structure. Findings may lead to price adjustments, specific indemnities, escrows or holdbacks for identified exposures such as warranty audits or chargeback liabilities, or a decision to walk away. As we described in an earlier post about a deal we declined, the most valuable outcome of diligence is sometimes the transaction that does not happen.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime treats earnings verification as a core diligence workstream on every acquisition we evaluate, working with independent accounting advisors alongside our own operating team.",
          "Adjustments are built department by department from the manufacturer financial statements, reconciled to the general ledger, tax returns, and bank activity, and reviewed by operators who have run franchised stores.",
          "Owner compensation, related-party rent, LIFO, incentive timing, F&I reserves, and floor plan are normalized to how the store would operate under Coleman Automotive Group, so the investment decision rests on repeatable earnings rather than reported ones.",
        ],
        link: {
          text: "Learn how Coleman Prime evaluates acquisitions",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "reading-dealership-financial-statement-nada-composite",
      "walked-away-from-deal",
    ],
  },

  {
    slug: "side-letters-mfn-provisions-lp-negotiation",
    category: "Fund Mechanics",
    title:
      "Side Letters and MFN Provisions: How Sophisticated LPs Negotiate Beyond the LPA",
    subtitle:
      "In institutional private equity, the limited partnership agreement is rarely the whole deal. Side letters and most-favored-nation clauses are how large investors tailor their terms — and how the industry has tried to keep that process fair.",
    author: "Ralph Marcuccilli",
    authorRole: "Managing Partner — Prime Dealer Equity Fund",
    date: "October 7, 2026",
    readTime: "10 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Streetsboro/streetsborofrontofstore.webp",
      alt: "Front of the Streetsboro dealership in Ohio",
      caption:
        "Storefront at the Streetsboro, Ohio store, a Coleman Automotive dealership. Like a franchise agreement with its addenda, a fund's core contract is often supplemented by investor-specific agreements. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Side letters are separate agreements between a fund manager and an individual investor that modify or supplement the fund's governing documents. MFN clauses let investors elect terms granted to others. This chapter explains what side letters typically contain, how MFN elections work, the ILPA principles behind transparency, and where SEC regulation stands after the 2024 court decision vacating the private fund adviser rules.",
    content: [
      {
        type: "paragraph",
        text: "In the previous chapter, we described the limited partnership agreement as the document that controls a fund's economics and governance. In institutional private equity, that is true — but it is not always the complete picture. Alongside the LPA, many funds enter into side letters: separate agreements between the fund (or its general partner) and a specific investor that add to, clarify, or modify how the LPA applies to that investor.",
      },
      {
        type: "paragraph",
        text: "Side letters are a routine feature of large institutional funds, where pension plans, endowments, sovereign wealth funds, and insurance companies each bring their own legal, regulatory, and policy constraints. They are also a source of legitimate concern for other investors, because a term granted to one limited partner may affect the others. The industry's answers to that concern — most-favored-nation provisions, disclosure norms, and regulatory scrutiny — are worth understanding for any investor evaluating a private fund.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through what side letters typically cover, how MFN clauses work in practice, the guidance published by the Institutional Limited Partners Association, and the recent history of SEC rulemaking on preferential treatment. It describes industry practice in general and is not a description of any term offered by the Fund. It is general education, not legal advice; the Fund's actual terms are governed solely by its offering documents.",
      },
      { type: "subheading", text: "What a Side Letter Is — and Why They Exist" },
      {
        type: "paragraph",
        text: "A side letter is a contract. It is typically signed at the time an investor subscribes and sits alongside the subscription agreement and LPA. The LPA itself usually authorizes the general partner to enter into side letters and provides that their terms will govern for the investor that receives them, notwithstanding contrary LPA provisions. That authorization is important: a side letter can change how the fund treats one investor without amending the agreement that binds everyone.",
      },
      {
        type: "paragraph",
        text: "Side letters exist mostly because investors are not uniform. A public pension fund may be subject to state open-records laws that require special handling of confidential information. A tax-exempt investor may need assurances about how the fund will manage exposure to unrelated business taxable income. An investor subject to ERISA may need commitments about plan-asset status. A foreign sovereign may need to preserve immunity. A university endowment may have a policy excluding certain industries. None of those needs can be addressed efficiently in a single LPA that governs everyone, so they are handled investor by investor.",
      },
      { type: "subheading", text: "What Side Letters Typically Contain" },
      {
        type: "paragraph",
        text: "Industry practice groups side letter terms into a few broad categories. The first, and most common, are regulatory and legal accommodations — provisions that let an investor comply with laws and policies that apply to it. These include confidentiality carve-outs for public disclosure obligations, tax-related covenants, sanctions and anti-corruption representations, and excuse rights that allow an investor to opt out of specific investments that would violate its policies.",
      },
      {
        type: "paragraph",
        text: "The second category is information and reporting rights: more frequent or more detailed reporting, specific data for the investor's own regulatory filings, access to portfolio-level information, or the right to meet with the manager periodically. The third covers governance — for example, a seat on the limited partner advisory committee (LPAC), consent rights over transfers to affiliates, or notice of key personnel changes. The fourth is economic: management fee discounts or offsets, often tied to commitment size or to participation in a first close, and rights to be offered co-investment opportunities. Economic terms draw the most attention because they directly affect how returns are shared across the investor base.",
      },
      {
        type: "paragraph",
        text: "Even terms that look administrative can matter to other investors. An excuse right, for example, means that when one investor sits out a particular deal, the remaining investors fund a larger share of it and carry more concentration in that position. Enhanced information rights can give one investor an earlier or fuller view of portfolio developments than others receive — a meaningful asymmetry if the fund offers any liquidity or transfer opportunities. A fee discount for one investor does not usually raise the fees others pay, but it does change the sponsor's economics and, in some structures, how aligned the sponsor is with different groups of investors. This is why the industry discussion focuses less on whether side letters should exist and more on whether other investors can see what has been granted.",
      },
      {
        type: "callout-numbers",
        title: "Common Side Letter Provisions in Institutional Funds",
        lines: [
          "Regulatory accommodations — public-records confidentiality, ERISA, tax, sanctions, sovereign immunity",
          "Excuse rights — opting out of investments that conflict with an investor's legal or policy restrictions",
          "Information rights — enhanced or customized reporting and access to the manager",
          "Governance — LPAC seats, notice of key person events, transfer consents",
          "Economics — fee discounts tied to size or first-close participation; co-investment offer rights",
          "MFN — the right to elect terms granted to other investors, subject to defined carve-outs",
        ],
      },
      { type: "subheading", text: "How Most-Favored-Nation Clauses Work" },
      {
        type: "paragraph",
        text: "A most-favored-nation (MFN) provision is itself a side letter term. It gives an investor the right to review the side letter terms granted to other investors and to elect to receive some or all of them. The concept is simple; the mechanics are not. In most institutional funds, MFN rights are tiered by commitment size. An investor that commits a given amount can typically elect any term granted to investors with equal or smaller commitments, but not terms granted to larger investors.",
      },
      {
        type: "paragraph",
        text: "MFN clauses also come with carve-outs — categories of terms that cannot be elected regardless of size. Common carve-outs include provisions tied to an investor's specific legal, regulatory, or tax status (which would make no sense for another investor to elect), LPAC seats, terms granted to the manager's affiliates or employees, co-investment rights, and economic terms tied to participation in an early close. The election process usually runs after the final close: the manager circulates a compendium of eligible side letter terms, often without identifying which investor received them, and each MFN holder has a window to make its elections.",
      },
      {
        type: "paragraph",
        text: "Consider an illustrative example. Suppose a fund grants Investor A, committing $50 million, a 10-basis-point fee reduction, and grants Investor B, committing $25 million, quarterly portfolio-level reporting. Investor C, committing $30 million with an MFN, could typically elect B's reporting rights (granted to a smaller investor) but not A's fee reduction (granted to a larger one) — unless the fee term was given for a first-close commitment and carved out of MFN entirely. The outcome depends entirely on how the MFN clause is drafted, which is why sophisticated investors negotiate its wording as carefully as any economic term.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/LEmars/frontofstore.webp",
        alt: "Front of the Le Mars dealership in Iowa",
        caption:
          "Front of the Le Mars, Iowa store, a Coleman Automotive dealership. Investor-specific terms are a feature of large institutional funds, and transparency about them is a central industry concern. Photo: Sweet Dreams US LLC",
      },
      { type: "subheading", text: "ILPA's View: Transparency First" },
      {
        type: "paragraph",
        text: "The Institutional Limited Partners Association is the leading trade body for institutional private equity investors. Its ILPA Principles, most recently revised as Principles 3.0 in 2019, set out the association's recommended best practices on fund terms, governance, and transparency. On side letters, the core message is disclosure. ILPA encourages managers to disclose the existence and terms of side letters to all investors, to provide MFN rights broadly, and to keep carve-outs narrow and clearly defined. ILPA has also published a Model Limited Partnership Agreement and standardized reporting templates designed to reduce the need for investor-by-investor customization in the first place.",
      },
      {
        type: "paragraph",
        text: "ILPA's guidance is voluntary — it is not law — but it shapes negotiations across the institutional market. It also reflects a practical reality: the more terms that are customized privately, the harder it becomes for any one investor to know whether it is being treated fairly. Transparency and well-drafted MFN rights are the market's attempt to keep side letters from becoming a hidden two-tier structure.",
      },
      { type: "subheading", text: "The SEC, the Private Fund Adviser Rules, and the Fifth Circuit" },
      {
        type: "paragraph",
        text: "In August 2023, the SEC adopted a package of rules under the Investment Advisers Act aimed specifically at private fund advisers. One component, the preferential treatment rule, would have prohibited advisers from granting certain preferential redemption rights and certain preferential information rights that the adviser reasonably expected to have a material negative effect on other investors, unless offered to all investors. It would also have required advisers to disclose other preferential treatment to current and prospective investors.",
      },
      {
        type: "paragraph",
        text: "Those rules never took full effect. In June 2024, the U.S. Court of Appeals for the Fifth Circuit, in National Association of Private Fund Managers v. SEC, vacated the private fund adviser rules in their entirety, holding that the SEC had exceeded its statutory authority in adopting them. The SEC did not seek further review. As a result, there is no SEC rule specifically prohibiting or mandating disclosure of side letter terms for private funds.",
      },
      {
        type: "paragraph",
        text: "That does not mean side letters are unregulated. The general antifraud provisions of the Advisers Act, including Rule 206(4)-8, which prohibits misleading statements to investors in pooled investment vehicles, continue to apply. The SEC has brought enforcement actions where advisers granted preferential terms to some investors without adequately disclosing them to others, and examination staff have repeatedly listed private fund conflicts and disclosures among their priorities. The practical standard has not changed much: preferential terms that could matter to other investors should be disclosed.",
      },
      { type: "subheading", text: "Questions Worth Asking Any Sponsor" },
      {
        type: "paragraph",
        text: "Side letters and MFN clauses are most relevant in large institutional funds with many investors of very different types. Smaller funds and co-investment vehicles often take a simpler approach. Whatever the vehicle, an investor can reasonably ask a few questions: Does the governing agreement permit side letters, and on what terms? If side letters exist, are their terms disclosed to all investors? Are there any economic or information rights that differ between investors? Is there an MFN mechanism, and what are its carve-outs?",
      },
      {
        type: "paragraph",
        text: "The answers belong in the offering documents or in written responses from the sponsor — not in a conversation. As with every other term, the governing agreement and any written disclosures are what control, and your own counsel is the right person to help you evaluate them. It is also worth remembering that a side letter's protections run only to the investor that signs it. If a provision matters to you, the question is not whether some investor in the fund has it, but whether the documents you sign give it to you.",
      },
      {
        type: "callout-prime",
        lines: [
          "This chapter describes how side letters and MFN provisions generally work across the private equity industry. It is not a description of the Fund's terms.",
          "Questions about how the Fund treats investors, including any investor-specific arrangements, are answered by the Fund's offering documents, and our team will respond to them in writing.",
          "We encourage every prospective investor to review those documents with independent legal counsel before investing.",
        ],
        link: {
          text: "Request the Fund's offering documents",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "inside-the-private-placement-memorandum-ppm",
      "fund-governance-investor-protections-prime-dealer-equity",
    ],
  },

  {
    slug: "inside-the-private-placement-memorandum-ppm",
    category: "Fund Mechanics",
    title:
      "Inside the Private Placement Memorandum: What's in a PPM and Why Each Section Matters",
    subtitle:
      "The private placement memorandum is the most important document most investors never read cover to cover. Here is how a typical PPM is organized, what each section is designed to tell you, and the questions to ask as you read.",
    author: "Ralph Marcuccilli",
    authorRole: "Managing Partner — Prime Dealer Equity Fund",
    date: "September 30, 2026",
    readTime: "11 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasantFront.webp",
      alt: "Front of the Mt. Pleasant dealership in Iowa",
      caption:
        "Front of Mt. Pleasant Chevy GMC CDJR in Iowa, a Coleman Automotive dealership. A PPM is where a private offering explains, in writing, what an investor is actually buying. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "A private placement memorandum is the disclosure document at the heart of most private offerings. It describes the investment, the people running it, the terms, and — most importantly — the risks. This chapter walks through the anatomy of a typical PPM and how to read each section with a critical eye.",
    content: [
      {
        type: "paragraph",
        text: "Every private fund offering eventually puts a stack of documents in front of a prospective investor. The thickest of those is usually the private placement memorandum, or PPM — a document that can run from a few dozen pages to well over a hundred. It is dense, written by lawyers, and full of language that seems designed to discourage reading. Many investors skim the summary, flip to the signature page, and rely on conversations with the sponsor for everything else.",
      },
      {
        type: "paragraph",
        text: "That is a mistake. The PPM is the sponsor's formal, written description of the investment, and it is the document the sponsor will point to if there is ever a dispute about what was disclosed. Marketing materials, websites, and conversations — including educational content like this series — are not a substitute. If something matters to your decision, it should be in the offering documents, and if it is in the offering documents, you are generally presumed to have read it.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through the sections found in a typical PPM, explains why each exists, and offers questions to ask as you read. It describes industry practice in general terms; it is general education, not legal or tax advice, and it does not describe the contents of any particular offering. The Fund's actual terms are governed by its own offering documents, which every prospective investor should read in full and review with their own advisors.",
      },
      { type: "subheading", text: "Why a PPM Exists in a Private Offering" },
      {
        type: "paragraph",
        text: "As we covered in our chapter on Rule 506(c), a private placement is exempt from SEC registration. No federal rule prescribes the format of a PPM for an offering made only to accredited investors. Sponsors prepare one anyway, for a straightforward reason: the antifraud provisions of the securities laws apply to every offering. A sponsor that sells interests without disclosing material facts — including material risks — faces liability. A carefully drafted PPM is how a sponsor puts those facts in writing, in one place, before an investor commits capital.",
      },
      {
        type: "paragraph",
        text: "A PPM rarely travels alone. The typical offering package also includes the governing agreement — a limited partnership agreement (LPA) for a limited partnership or an operating agreement for an LLC — and a subscription agreement with an investor questionnaire. The PPM summarizes; the governing agreement controls. Most PPMs say so explicitly: if the summary and the LPA conflict, the LPA governs. A diligent investor reads the summary to understand the structure and then checks the governing agreement for the details that matter most.",
      },
      { type: "subheading", text: "The Front Matter: Legends and Notices" },
      {
        type: "paragraph",
        text: "The first pages of most PPMs are capital-letter legends that are easy to skip and worth reading once. They state that the securities have not been registered under the Securities Act or any state law, that no regulator has passed on the merits or accuracy of the document, that the interests are subject to restrictions on transfer, and that investors must be prepared to bear the economic risk of the investment for an extended period. Many PPMs include state-specific legends and a notice about forward-looking statements, explaining that any statement about future plans or targets reflects current expectations and may not come to pass. These notices tell you how to read everything that follows. A target is not a promise. A strategy description is not a guarantee of execution. And the absence of regulatory review means the burden of evaluating the offering sits with you and your advisors.",
      },
      { type: "subheading", text: "The Summary of Terms" },
      {
        type: "paragraph",
        text: "Near the front, most PPMs include a summary of principal terms — a condensed, often tabular overview of the economics and structure. A typical summary covers the issuer and its general partner or manager, the investment objective, the target offering size, the minimum investment, the term and any extension rights, the capital call or funding mechanics, the distribution policy and waterfall, management fees and other compensation, fund expenses, investor reporting, transfer restrictions, and the eligibility requirements for investors.",
      },
      {
        type: "paragraph",
        text: "The summary is where most investors spend their time, and it is a useful map. But it is a map, not the territory. Every defined term in the summary — \"distributable cash,\" \"fund expenses,\" \"cause,\" \"key person\" — has a precise definition in the governing agreement, and the definition is what determines your economics. If a term matters to you, find its definition and read it.",
      },
      {
        type: "callout-numbers",
        title: "The Typical PPM, Section by Section",
        lines: [
          "Legends and notices — registration status, transfer restrictions, forward-looking statements",
          "Summary of terms — size, minimum, term, distributions, fees, expenses, reporting",
          "Business, strategy, and management — what the vehicle will do and who will do it",
          "Risk factors and conflicts of interest — what could go wrong and where interests diverge",
          "Tax, ERISA, and regulatory considerations — how the investment may be treated for different investor types",
          "Subscription procedures — eligibility, verification, and how to invest",
        ],
        link: {
          text: "Request the Fund's offering documents",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "Business, Strategy, and Management" },
      {
        type: "paragraph",
        text: "The narrative sections describe what the vehicle will do with investor capital: the investment strategy, the target assets, the sourcing and underwriting process, how investments will be managed, and how and when they might be exited. Alongside that sits a description of the sponsor and its principals — background, track record where relevant, and the roles each person will play.",
      },
      {
        type: "paragraph",
        text: "Read these sections for specificity. Can you tell what the vehicle will and will not invest in? Are there concentration limits or investment restrictions, and are they binding or merely intentions? Who exactly makes decisions, and what happens if a key individual leaves — is there a key person provision, and what does it trigger? For an operating strategy like dealership acquisitions, does the document explain how the operator and the fund relate to each other, and how capital flows between them? A strategy described only in broad, aspirational language is harder to hold anyone to.",
      },
      { type: "subheading", text: "Risk Factors: The Section That Matters Most" },
      {
        type: "paragraph",
        text: "The risk factors section is often the longest part of a PPM, and it is the section investors most often dismiss as boilerplate. Some of it is generic — every private fund carries illiquidity risk, the risk of loss of the entire investment, and dependence on key personnel. But a well-drafted risk section also identifies risks specific to the strategy, the industry, and the structure, and those are the ones to study.",
      },
      {
        type: "paragraph",
        text: "For a vehicle investing in franchised automotive dealerships, for example, you would expect to see risks drawn from the subjects this series has covered: manufacturer control over franchise transfers and facility requirements, inventory and floor plan interest-rate exposure, cyclicality in new-vehicle demand, regulatory risk in F&I, and execution risk in acquisitions and integration. Read every risk factor and ask two questions: how likely is this, and what would it do to my investment if it happened? Then ask the sponsor how they manage it. A sponsor who can discuss its own risk factors candidly is giving you useful information.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasentGMCSign.webp",
        alt: "GMC signage at the Mt. Pleasant dealership",
        caption:
          "GMC signage at Mt. Pleasant Chevy GMC CDJR in Iowa, a Coleman Automotive dealership. Industry-specific risk factors in a dealership offering should reflect how franchised stores actually operate. Photo: Sweet Dreams US LLC",
      },
      { type: "subheading", text: "Conflicts of Interest, Fees, and Expenses" },
      {
        type: "paragraph",
        text: "Every sponsor has conflicts of interest. The question is whether they are disclosed and how they are managed. Common conflicts in private funds include the sponsor managing other vehicles that may compete for the same opportunities, transactions between the fund and the sponsor's affiliates, fees paid to affiliates for services, how co-investment opportunities are allocated, and the allocation of expenses between the fund and the sponsor. In operator-led strategies, a natural area to examine is the relationship between the fund and the operating company — how decisions are made when their interests could diverge.",
      },
      {
        type: "paragraph",
        text: "The fees and expenses section should let you calculate, at least roughly, what the vehicle costs to own. Look for every form of compensation the sponsor and its affiliates may receive, how each is calculated, which expenses are borne by the fund versus the sponsor, whether organizational expenses are capped, and how any profit participation is computed. If you cannot build a simple illustrative model of the fees from the documents, ask for help — from the sponsor and from your own advisor.",
      },
      { type: "subheading", text: "Distributions, Governance, Reporting, and Tax" },
      {
        type: "paragraph",
        text: "The distribution section explains how and when cash flows back to investors — the order of priority, any preferred return mechanics, how reinvestment is handled, and whether distributions are targets or obligations. Pay close attention to the language: \"targeting\" a distribution level describes an objective, not a guarantee. The governance section covers investor voting rights, any advisory committee, removal provisions for the manager, amendment procedures, and the circumstances that allow the term to be extended or the vehicle to be dissolved. The reporting section describes what you will receive and how often — financial statements, audit status, capital account statements, and tax forms.",
      },
      {
        type: "paragraph",
        text: "The tax section is often the most technical. It typically describes how the vehicle is expected to be treated for federal income tax purposes, how income and losses flow to investors (usually on a Schedule K-1 for a partnership), potential state tax filing obligations, and considerations for tax-exempt investors, including unrelated business taxable income and ERISA plan-asset rules. These sections are written in general terms and explicitly do not replace advice on your own situation. Treat them as a list of topics to raise with your tax advisor.",
      },
      { type: "subheading", text: "The Subscription Documents" },
      {
        type: "paragraph",
        text: "The final piece is the subscription agreement and investor questionnaire. This is where you make representations to the issuer — that you are accredited, that you have read the offering documents, that you understand the risks, that you are investing for your own account, and that you understand the restrictions on transfer. In a Rule 506(c) offering, it is also where verification documentation is collected or a third-party verification letter is delivered. Those representations carry weight. When you sign that you have read and understood the PPM, you are making a statement the sponsor will rely on. That alone is a good reason to actually read it — and to bring your attorney, accountant, or financial advisor into the process before you sign. A practical approach many experienced investors use: read the summary of terms first, then the risk factors and conflicts of interest in full, then the governing agreement's sections on distributions, fees, expenses, transfers, and manager removal. Write down every question as you go, send the list to the sponsor, and ask for written answers. How a sponsor responds to a careful reader is itself part of your diligence.",
      },
      {
        type: "callout-prime",
        lines: [
          "The Fund's private placement memorandum, governing agreement, and subscription documents are the only authoritative description of its terms. Nothing on this website, including this series, replaces them.",
          "We encourage every prospective investor to read the offering documents in full, to ask our team questions about any section, and to review them with independent legal, tax, and financial advisors before investing.",
          "Within the terms we can describe publicly — a $20M target fund size, $100,000 minimum, 10-year term, and annual distributions targeting a minimum 8% — the offering documents set out the full detail, along with the risks.",
        ],
        link: {
          text: "Request the Fund's offering documents",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "reg-d-506c-explained-general-solicitation",
      "fund-governance-investor-protections-prime-dealer-equity",
    ],
  },

  {
    slug: "reg-d-506c-explained-general-solicitation",
    category: "Fund Mechanics",
    title:
      "Reg D 506(c) Explained: The Securities Rule That Lets Us Market Publicly",
    subtitle:
      "Most private funds raise capital quietly. Rule 506(c) allows a private offering to be discussed in public — in exchange for a stricter obligation to confirm that every investor is accredited. Here is how the rule works and what it means for you as an investor.",
    author: "Ralph Marcuccilli",
    authorRole: "Managing Partner — Prime Dealer Equity Fund",
    date: "September 23, 2026",
    readTime: "11 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/FrontofStoreNissanWarsaw.webp",
      alt: "Front entrance of Nissan of Warsaw, a Coleman Automotive dealership",
      caption:
        "Storefront at Nissan of Warsaw, a Coleman Automotive dealership. The rules that govern how a private fund may talk about its investments in public are just as specific as the ones that govern a showroom. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Private funds have historically been sold through private networks. Rule 506(c) of Regulation D changed that by permitting general solicitation — provided every purchaser is an accredited investor and the issuer takes reasonable steps to verify that status. This chapter explains the rule, the accredited investor definition, verification, Form D, and the bad actor provisions.",
    content: [
      {
        type: "paragraph",
        text: "If you are reading this chapter on our website, you are seeing something that, for most of the history of American private capital, was not allowed. Until 2013, a company or fund raising money in a private placement under Regulation D generally could not advertise. No public website describing the offering, no social media posts, no articles inviting readers to invest. Capital was raised through existing relationships, introductions, and placement agents — quietly, and by design.",
      },
      {
        type: "paragraph",
        text: "That changed when the Securities and Exchange Commission implemented a provision of the Jumpstart Our Business Startups Act of 2012 — the JOBS Act — by adopting Rule 506(c). The new rule allowed issuers to use general solicitation and general advertising in a private offering, as long as they accepted a tighter set of conditions. Prime Dealer Equity Fund is offered under Rule 506(c), which is why we can publish educational content like this series and discuss the Fund openly.",
      },
      {
        type: "paragraph",
        text: "For an investor, understanding the rule matters for two reasons. First, it explains why you will be asked for more than a checked box before you can invest in any 506(c) offering. Second, it clarifies what the rule does not do: an exemption from registration is not a government endorsement, review, or approval of any offering. This chapter walks through how Regulation D is structured, how 506(b) and 506(c) differ, who qualifies as an accredited investor, what \"reasonable steps to verify\" means in practice, and the filing and disqualification rules that apply to every Rule 506 offering. As with every chapter in this module, what follows is general education about how these rules typically work. It is not legal, tax, or investment advice, and the Fund's actual terms and procedures are governed solely by its offering documents.",
      },
      { type: "subheading", text: "Why Private Offerings Need an Exemption at All" },
      {
        type: "paragraph",
        text: "Under Section 5 of the Securities Act of 1933, every offer and sale of securities must be registered with the SEC unless an exemption applies. Registration is the process public companies go through — an extensive disclosure document, audited financials, SEC review, and ongoing reporting obligations. It is expensive and slow, and for a fund or a private company raising capital from a limited group of sophisticated investors, it is usually impractical.",
      },
      {
        type: "paragraph",
        text: "Section 4(a)(2) of the Securities Act exempts \"transactions by an issuer not involving any public offering.\" The difficulty is that the statute doesn't define what a public offering is, and decades of case law left issuers uncertain about where the line sat. Regulation D, adopted in 1982, solved that by creating safe harbors — specific conditions that, if met, give issuers confidence that their offering qualifies. Rule 506 is by far the most widely used of those safe harbors, accounting for the large majority of capital raised under Regulation D each year. Rule 506 offerings carry another important feature: securities sold under Rule 506 are \"covered securities\" under Section 18 of the Securities Act, which preempts state-level registration requirements. States can still require a notice filing and a fee, and they retain full authority to pursue fraud, but an issuer does not have to register the offering separately in every state where an investor lives.",
      },
      { type: "subheading", text: "Rule 506(b) vs. Rule 506(c)" },
      {
        type: "paragraph",
        text: "Rule 506 now comes in two versions. The original, Rule 506(b), prohibits general solicitation. An issuer relying on 506(b) generally needs a pre-existing, substantive relationship with prospective investors — or an intermediary who has one — before discussing the offering. In exchange, 506(b) is flexible about who can invest: it permits an unlimited number of accredited investors and up to 35 non-accredited purchasers, provided each non-accredited purchaser (alone or with a purchaser representative) has enough knowledge and experience in financial matters to evaluate the investment. If any non-accredited investors participate, the issuer must furnish them with specific disclosure, including financial statement information, under Rule 502(b).",
      },
      {
        type: "paragraph",
        text: "Rule 506(c), effective September 23, 2013, flips the trade-off. Issuers may broadly solicit and advertise — websites, articles, webinars, social media, public events. But every purchaser must be an accredited investor, and the issuer must take reasonable steps to verify that each purchaser is accredited. Under 506(b), an issuer can generally rely on an investor's own representation of accredited status absent red flags. Under 506(c), self-certification alone is not enough.",
      },
      {
        type: "callout-numbers",
        title: "Rule 506(b) and Rule 506(c) at a Glance",
        lines: [
          "General solicitation — prohibited under 506(b); permitted under 506(c)",
          "Non-accredited investors — up to 35 sophisticated purchasers under 506(b); none under 506(c)",
          "Accredited status — reasonable belief, often based on investor representations, under 506(b); reasonable steps to verify under 506(c)",
          "Disclosure — specific Rule 502(b) information required under 506(b) if any non-accredited investor participates; no mandated format under 506(c), though antifraud rules apply to both",
          "State registration — preempted for both; state notice filings and fees may still apply",
          "Form D — required for both, within 15 calendar days after the first sale",
        ],
        link: {
          text: "Review the Fund's eligibility requirements",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "Who Counts as an Accredited Investor" },
      {
        type: "paragraph",
        text: "The accredited investor definition lives in Rule 501(a) of Regulation D. For individuals, the two best-known tests are financial. The income test is met by a natural person with income above $200,000 in each of the two most recent years — or joint income with a spouse or spousal equivalent above $300,000 — with a reasonable expectation of reaching the same level in the current year. The net worth test is met by a natural person whose net worth, alone or together with a spouse or spousal equivalent, exceeds $1 million, excluding the value of the primary residence. Since the Dodd-Frank Act, the primary residence has been excluded from the calculation, and mortgage debt on it generally counts as a liability only to the extent it exceeds the home's value (or was taken on within 60 days before the investment, other than to buy the home).",
      },
      {
        type: "paragraph",
        text: "In 2020, the SEC amended the definition to recognize financial sophistication, not just wealth. Individuals holding certain professional certifications in good standing — currently the General Securities Representative license (Series 7), the Investment Adviser Representative license (Series 65), and the Private Securities Offerings Representative license (Series 82) — qualify regardless of income or net worth. The amendments also added \"knowledgeable employees\" of a private fund for investments in that fund, and recognized spousal equivalents for the joint tests.",
      },
      {
        type: "paragraph",
        text: "Entities can qualify too. Common categories include banks, registered broker-dealers and investment advisers, and insurance companies; corporations, LLCs, partnerships, and certain trusts with more than $5 million in assets that were not formed for the specific purpose of making the investment; entities in which all of the equity owners are accredited investors; entities owning more than $5 million in investments; and family offices with at least $5 million in assets under management, along with their family clients. Directors, executive officers, and general partners of the issuer itself are also accredited. The income and net worth thresholds for individuals have not been indexed to inflation since they were first set, a point the SEC has studied but not changed.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/CDJRsign.webp",
        alt: "Chrysler, Dodge, Jeep, Ram signage at Mt. Pleasant",
        caption:
          "Brand signage at Mt. Pleasant Chevy GMC CDJR in Iowa, a Coleman Automotive dealership. A 506(c) offering can be discussed publicly, but only verified accredited investors can participate. Photo: Sweet Dreams US LLC",
      },
      { type: "subheading", text: "What \"Reasonable Steps to Verify\" Means" },
      {
        type: "paragraph",
        text: "The SEC deliberately made 506(c) verification principles-based. Whether an issuer's steps are reasonable depends on the facts — the nature of the purchaser, the information the issuer has, the manner of solicitation, and the terms of the offering, including any minimum investment. To give issuers certainty, the rule lists several non-exclusive methods that are deemed to satisfy the requirement for natural persons.",
      },
      {
        type: "paragraph",
        text: "For the income test, an issuer can review IRS forms that report income — W-2s, 1099s, Schedule K-1s, or filed Form 1040s — for the two most recent years, together with a written representation that the investor expects to reach the threshold this year. For the net worth test, an issuer can review documentation of assets, such as bank and brokerage statements, dated within the prior three months, along with a consumer credit report to identify liabilities and a written representation that all liabilities have been disclosed. Alternatively, an issuer can rely on a written confirmation from a registered broker-dealer, an SEC-registered investment adviser, a licensed attorney, or a certified public accountant that the professional has taken reasonable steps to verify accredited status within the prior three months. The 2020 amendments added that an issuer that previously verified an investor can, within five years, rely on that investor's written representation that they remain accredited, absent contrary information.",
      },
      {
        type: "paragraph",
        text: "In March 2025, the staff of the SEC's Division of Corporation Finance added another path. In a no-action letter and accompanying interpretive guidance, the staff indicated that a high minimum investment can be part of a reasonable verification approach. In general terms, where a natural person commits at least $200,000 (or an entity qualifying on a total-assets basis commits at least $1 million), represents in writing that they are accredited and that the investment is not financed by a third party for the specific purpose of making it, and the issuer has no actual knowledge to the contrary, the issuer may conclude it has taken reasonable steps without collecting tax returns or bank statements. This is staff guidance rather than a rule change, and it is one option among several; issuers and investors should look to their own counsel for how it applies to any particular offering.",
      },
      { type: "subheading", text: "Form D, Notice Filings, and the Antifraud Backstop" },
      {
        type: "paragraph",
        text: "Every Rule 506 issuer must file a Form D with the SEC through its EDGAR system no later than 15 calendar days after the first sale of securities in the offering. Form D is a short notice — it identifies the issuer, its related persons, the exemption claimed, the offering size, and the amount sold — not a disclosure document and not an application for approval. Form D filings are public, and anyone can look them up on EDGAR. Issuers file amendments annually while the offering continues and when certain information changes. Most states then require a copy of the Form D as a notice filing, with a fee.",
      },
      {
        type: "paragraph",
        text: "Being exempt from registration does not mean being exempt from liability. The antifraud provisions of the federal securities laws — including Section 17(a) of the Securities Act and Rule 10b-5 under the Securities Exchange Act — apply fully to private placements. Any statement made in a general solicitation, on a website, or in an offering document must not contain a material misstatement or omit a material fact necessary to make it not misleading. This is a major reason responsible 506(c) issuers keep public content educational, avoid projections or promises of returns, and direct investors to the offering documents for actual terms.",
      },
      { type: "subheading", text: "The Bad Actor Rules" },
      {
        type: "paragraph",
        text: "Rule 506(d), adopted under the Dodd-Frank Act and effective at the same time as 506(c), disqualifies an offering from Rule 506 if the issuer or certain \"covered persons\" have a disqualifying event. Covered persons include the issuer and its predecessors and affiliated issuers; its directors, executive officers, and other officers participating in the offering; general partners and managing members; beneficial owners of 20% or more of the issuer's voting equity; promoters; the investment manager of a pooled investment fund; and anyone paid to solicit investors, along with that solicitor's directors and officers.",
      },
      {
        type: "paragraph",
        text: "Disqualifying events include certain criminal convictions and court injunctions related to securities, certain final orders of state and federal regulators, SEC disciplinary and cease-and-desist orders, suspension or expulsion from a self-regulatory organization, SEC stop orders, and U.S. Postal Service false representation orders — generally with five- or ten-year lookback periods depending on the event. Events that occurred before September 23, 2013 do not disqualify an offering but must be disclosed to investors under Rule 506(e). The rule includes a reasonable care exception, and issuers typically run questionnaires and background checks on covered persons before and during an offering. For an investor, the practical takeaway is that a Rule 506 offering carries a built-in screen on the people running it — but the screen is only as good as the issuer's diligence. You can and should do your own: search the sponsor's Form D filings on EDGAR, check FINRA BrokerCheck and the SEC's Investment Adviser Public Disclosure site for any individuals or firms involved, and ask the sponsor directly how it conducts its bad actor review.",
      },
      { type: "subheading", text: "What the Rule Means for You as an Investor" },
      {
        type: "paragraph",
        text: "Securities purchased in a Rule 506 offering are \"restricted securities.\" They cannot be freely resold, and in a private fund, the partnership or operating agreement typically adds its own limits on transfer. Investors should approach any 506(c) offering expecting an illiquid, long-term commitment — the Fund, for example, has a 10-year term — and should only invest money they can afford to have tied up for that period. Expect, too, that verification will involve some paperwork. That is a feature of the rule, not friction for its own sake: the obligation to verify is the price the SEC set for allowing public discussion of private investments. Finally, remember that neither Form D nor the 506(c) exemption means the SEC or any state has reviewed the merits of an offering. That evaluation is the investor's job, which is why the next chapter in this series walks through the document where it should begin — the private placement memorandum.",
      },
      {
        type: "callout-prime",
        lines: [
          "Prime Dealer Equity Fund is offered under Rule 506(c) to accredited investors only, which is why we can publish open educational content like this series.",
          "Every prospective investor goes through accredited investor verification before subscribing, as the rule requires. The specific process is described in the Fund's subscription documents.",
          "We keep public content educational and direct investors to the Fund's offering documents for its actual terms — including the $100,000 minimum, 10-year term, and targeted minimum 8% annual distribution — and we encourage every investor to review them with their own legal and tax advisors.",
        ],
        link: {
          text: "Learn about the Fund and investor eligibility",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "accredited-investor-guide-dealership-private-equity",
      "inside-the-private-placement-memorandum-ppm",
    ],
  },

  {
    slug: "fi-compliance-tila-ecoa-red-flags-afip",
    category: "Investor Education",
    title: "F&I Compliance: TILA, ECOA, the Red Flags Rule, and AFIP Certification",
    subtitle: "The finance office is the most regulated room in a dealership. Here is what federal law requires inside the deal jacket — and how disciplined operators prove they did it right.",
    author: "Ralph Marcuccilli",
    authorRole: "Managing Partner — Prime Dealer Equity Fund",
    date: "September 16, 2026",
    readTime: "12 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/FrontofNissanElgin.jpg",
      alt: "Front exterior of Nissan of Elgin in Illinois",
      caption: "Front of Nissan of Elgin in Illinois, a Coleman Automotive dealership. Every financed sale at a store like this produces a deal jacket that must satisfy several federal statutes at once. Photo: Sweet Dreams US LLC"
    },
    excerpt: "A financed vehicle sale is a consumer credit transaction, and the dealership is usually the original creditor. That single fact brings the Truth in Lending Act, the Equal Credit Opportunity Act, the Fair Credit Reporting Act, and the FTC's Red Flags Rule into every deal jacket.",
    content: [
      {
        type: "paragraph",
        text: "In our chapter on dealer licensing and the regulatory maze, we mapped the full compliance stack a dealership operates under — state licensing, the FTC Safeguards Rule, lemon laws, environmental and OSHA requirements — and introduced the federal credit statutes at a high level. This chapter does not repeat that map. Instead, it opens a single deal jacket and walks through the federal consumer-credit requirements that apply to the documents inside it."
      },
      {
        type: "paragraph",
        text: "For an investor, F&I compliance is not an abstract legal topic. The F&I office produces a large share of a dealership's gross profit, as we covered in the previous two chapters, and it is also where the largest regulatory and litigation exposure tends to concentrate. Fair-lending enforcement actions, class actions over disclosures, and state attorney general investigations into add-on products have all centered on F&I practices. A store whose F&I income depends on noncompliant practices does not have durable earnings; it has a contingent liability that has not been priced."
      },
      {
        type: "paragraph",
        text: "This chapter walks through the Truth in Lending Act, the Equal Credit Opportunity Act and dealer markup, the Fair Credit Reporting Act, the Red Flags Rule, the current status of federal add-on product regulation, and the role of AFIP certification in a compliance program. It is general education about how these rules commonly apply to dealers. It is not legal advice, and any specific situation should be reviewed with qualified counsel. The Fund's actual terms are governed solely by its offering documents."
      },
      {
        type: "subheading",
        text: "Why the Dealer Is the Creditor"
      },
      {
        type: "paragraph",
        text: "Most dealer-arranged financing is indirect. The customer signs a retail installment sale contract with the dealership, which names the dealer as the original creditor, and the dealer then assigns that contract to a bank, credit union, or captive finance company. Because the dealer is the party to whom the obligation is initially payable, the dealer is generally the creditor for purposes of the Truth in Lending Act and its implementing rule, Regulation Z, and a creditor for purposes of the Equal Credit Opportunity Act and Regulation B. A jurisdictional point is worth noting. The Dodd-Frank Act generally excluded motor vehicle dealers that routinely assign their contracts to unaffiliated third parties from the rulemaking and enforcement authority of the Consumer Financial Protection Bureau. The Federal Trade Commission retains enforcement authority over those dealers, and the CFPB supervises many of the larger indirect auto lenders who buy their contracts. In practice, CFPB expectations reach dealers through their lender relationships even where the Bureau has no direct authority over the dealer."
      },
      {
        type: "subheading",
        text: "TILA: The Federal Box and the Itemization"
      },
      {
        type: "paragraph",
        text: "The Truth in Lending Act requires clear, conspicuous disclosure of the cost of credit before the customer becomes obligated. On a retail installment sale contract, the core disclosures appear in what the industry calls the federal box: the annual percentage rate, the finance charge, the amount financed, the total of payments, and, for a credit sale, the total sale price, along with the payment schedule. The disclosures must be accurate; for a regular transaction, Regulation Z treats an APR as accurate only if it is within one-eighth of one percentage point of the true rate."
      },
      {
        type: "paragraph",
        text: "The itemization of the amount financed is where F&I products show up. When a customer finances a service contract, GAP, or tire and wheel protection, the price is typically added to the amount financed and itemized on the contract. This is where TILA and product practices intersect. Charges for products that are truly optional, and that are offered to cash buyers on the same terms, are generally not finance charges. But if a product is required as a condition of the financing, its cost can be treated as part of the finance charge, which changes the APR — and an understated finance charge or APR is a TILA violation. GAP and other debt cancellation products have specific Regulation Z conditions for exclusion from the finance charge, including that the coverage not be required, that this be disclosed in writing, and that the customer affirmatively elect it after receiving the cost disclosure."
      },
      {
        type: "paragraph",
        text: "TILA also reaches advertising. Under Regulation Z, an ad that states certain triggering terms — such as the amount of a payment, the number of payments, the down payment, or the amount of any finance charge — must also disclose the down payment, the terms of repayment, and the annual percentage rate. Leases fall under a parallel framework, the Consumer Leasing Act and Regulation M. Separately, the FTC's Holder Rule requires consumer credit contracts arranged by sellers to include a notice preserving the customer's claims and defenses against any later holder of the contract — the reason lenders care deeply about how the dealers they buy from treat customers."
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/LEmars/frontofstore.webp",
        alt: "Front exterior of the Le Mars dealership in Iowa",
        caption: "Front of the Le Mars store in Iowa, a Coleman Automotive dealership. Federal credit rules apply the same way in a rural market as in a metro one. Photo: Sweet Dreams US LLC"
      },
      {
        type: "subheading",
        text: "ECOA and the Dealer Markup Question"
      },
      {
        type: "paragraph",
        text: "The Equal Credit Opportunity Act prohibits discrimination in any aspect of a credit transaction on the basis of race, color, religion, national origin, sex, marital status, or age (provided the applicant has capacity to contract), because the applicant's income comes from public assistance, or because the applicant has exercised rights under consumer credit laws. Regulation B adds specific procedural requirements that matter in the finance office. A creditor generally cannot require a spouse's signature if the applicant qualifies individually. And when a credit application is denied — including when the dealer cannot find a lender willing to buy the contract — the applicant is entitled to an adverse action notice, generally within 30 days, explaining the decision or the right to request the reasons."
      },
      {
        type: "paragraph",
        text: "The most consequential fair-lending issue for dealers is markup discretion. As we described in the F&I menu chapter, a dealer can typically write a contract at a rate above the lender's buy rate, within the lender's cap, and share in the difference. Regulators have taken the position that discretionary markup can produce a disparate impact: even without intent, customers in protected classes may end up paying higher markups on average. Between 2013 and 2016, federal regulators reached consent orders with several large indirect auto lenders that, among other remedies, reduced the maximum permitted markup or moved to flat-fee compensation."
      },
      {
        type: "paragraph",
        text: "The CFPB's 2013 guidance bulletin on indirect auto lending was later disapproved by Congress under the Congressional Review Act in 2018, but the underlying statute did not change, and fair-lending enforcement against dealers has continued at the federal and state level, including actions alleging that minority customers were charged higher markups and fees. The common industry response is a documented markup policy: a standard markup applied to every customer, with deviations allowed only for defined, legitimate business reasons — meeting a competing offer, accommodating a customer's payment budget — and documented in the file every time. NADA, together with other dealer associations, published a widely used model Fair Credit Compliance Policy and Program built on that approach."
      },
      {
        type: "subheading",
        text: "FCRA, Risk-Based Pricing, and the Red Flags Rule"
      },
      {
        type: "paragraph",
        text: "The Fair Credit Reporting Act governs the credit reports pulled in the finance office. A dealer needs a permissible purpose to obtain a consumer report, and the FCRA's risk-based pricing rules generally require a notice to customers who receive less favorable terms based on their credit report — or, under a commonly used exception, a credit score disclosure notice provided to every applicant. If credit is denied based in whole or in part on a consumer report, FCRA adverse action requirements apply alongside those of Regulation B."
      },
      {
        type: "paragraph",
        text: "The Red Flags Rule, issued by the FTC and other federal agencies under the Fair and Accurate Credit Transactions Act of 2003 and codified for FTC-regulated entities at 16 CFR Part 681, requires covered creditors to maintain a written identity theft prevention program. After Congress narrowed the definition of creditor in the Red Flag Program Clarification Act of 2010, dealers that regularly extend, renew, or arrange credit in the ordinary course of business generally remain covered. The program must identify the red flags relevant to the business, detect them in day-to-day operations, respond appropriately when they appear, and be updated periodically, with oversight by senior management or the board, staff training, and oversight of service providers."
      },
      {
        type: "paragraph",
        text: "In the finance office, red flags are concrete: a driver's license that does not match the applicant, a fraud alert on the credit report, a Social Security number associated with someone else, an address discrepancy notice from a credit bureau, an applicant who cannot answer basic questions about their own credit history. The Red Flags Rule is distinct from the Safeguards Rule discussed in our licensing chapter. Safeguards protects customer information the dealer already holds; Red Flags is about preventing someone from using stolen identity information to obtain credit through the dealer. Most programs also include screening against the Treasury Department's OFAC sanctions list, a separate legal obligation."
      },
      {
        type: "callout-numbers",
        title: "Inside a Compliant Deal Jacket",
        lines: [
          "Credit application, permissible-purpose documentation, and risk-based pricing or credit score disclosure notice",
          "Identity verification under the Red Flags program, plus OFAC screening",
          "Retail installment sale contract with an accurate federal box and itemization of the amount financed",
          "Signed F&I menu showing every product offered, with declinations documented",
          "Markup documentation consistent with the dealer's written fair credit policy",
          "Product contracts, privacy notice, and adverse action notice where credit was denied"
        ],
        link: {
          text: "See how Coleman Prime reviews F&I files during diligence",
          href: "/opportunity"
        }
      },
      {
        type: "subheading",
        text: "Add-On Products After the CARS Rule"
      },
      {
        type: "paragraph",
        text: "In December 2023, the FTC finalized the Combating Auto Retail Scams Rule, known as the CARS Rule, which would have imposed specific federal requirements on dealer pricing disclosures and add-on product sales, including express, informed consent to any add-on charge. In January 2025, the U.S. Court of Appeals for the Fifth Circuit vacated the rule on procedural grounds, holding that the FTC had failed to follow required rulemaking steps. The obligations we described in our licensing chapter under the CARS Rule framework therefore no longer rest on that federal rule itself."
      },
      {
        type: "paragraph",
        text: "That has not reduced the compliance burden much in practice. The FTC continues to police deceptive and unfair practices in auto sales under Section 5 of the FTC Act, including charging customers for add-ons they did not agree to or that provide no benefit. State attorneys general enforce their own consumer protection statutes. And states have begun legislating directly: California's own Combating Auto Retail Scams Act, scheduled to take effect October 1, 2026, imposes state-level requirements on pricing disclosures and add-on products for California dealers. The safest operating posture is the one the vacated rule described anyway — voluntary products, clear pricing, documented consent, and products with real value."
      },
      {
        type: "subheading",
        text: "Where AFIP Certification Fits"
      },
      {
        type: "paragraph",
        text: "None of these rules enforces itself. They depend on F&I managers who understand them and follow them on every deal. The Association of Finance & Insurance Professionals, known as AFIP, is a nonprofit organization that certifies F&I personnel on the federal and state laws and ethical standards that govern dealership finance and insurance operations. Its certification has generally involved training and a proctored exam, adherence to a code of ethics, and periodic recertification — commonly every two years — so certified professionals stay current as rules change. The program has offered tiered levels, including a master certification."
      },
      {
        type: "paragraph",
        text: "AFIP certification is not a government license, and it is not legally required under federal law; some states separately license or register finance personnel, as we noted in our licensing chapter. Its value is as evidence. A dealer facing a regulatory inquiry or a lawsuit is in a materially stronger position if it can show that every F&I manager was trained and tested on the relevant rules, that the training was refreshed on a regular cadence, and that the store's policies were built around that training. Certification is one component of a compliance management system — alongside written policies, file audits, monitoring of markup and product penetration patterns, complaint tracking, and corrective action — not a substitute for it."
      },
      {
        type: "subheading",
        text: "Compliance in Diligence"
      },
      {
        type: "paragraph",
        text: "When we evaluate a target dealership, F&I compliance review is part of the core diligence, not an afterthought. We sample deal jackets against the requirements described here, review the store's written fair credit policy and test actual markup patterns against it, check that the Red Flags program exists on paper and operates in practice, examine product cancellation and refund practices, and review customer complaints filed with regulators and lenders. Patterns matter more than isolated errors: a single clerical mistake is a training issue, while a pattern of undocumented markup deviations or products appearing on contracts without signed menus is a liability that must be priced or remediated before closing. The investment logic is simple. F&I income earned through compliant practices is durable. F&I income that depends on practices regulators are actively targeting is not, and it can reverse — through restitution, chargebacks, and lender terminations — faster than it was earned. This closes Module 4. Our next module turns from the dealership to the fund itself, starting with how Regulation D Rule 506(c) offerings work."
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime samples F&I deal jackets during diligence and tests markup patterns against a written fair credit policy.",
          "Red Flags, OFAC, and adverse action processes are verified in operation, not only on paper.",
          "Post-acquisition, F&I managers are trained and recertified on a regular cadence, and files are audited on an ongoing basis.",
          "F&I income is underwritten only to the extent it is earned through compliant, documented practices."
        ],
        link: {
          text: "Learn how Coleman Prime manages compliance across its platform",
          href: "/opportunity"
        }
      }
    ],
    relatedSlugs: [
      "dealer-licensing-regulatory-maze-ftc-ecoa-lemon-laws",
      "fi-menu-vsc-gap-tire-wheel"
    ]
  },

  {
    slug: "reinsurance-dowc-dealer-owned-warranty-companies",
    category: "Investor Education",
    title: "Reinsurance and DOWCs: How Dealers Build Wealth Inside Their Own Warranties",
    subtitle: "The F&I office earns a markup on every service contract sold. The underwriting profit inside that contract usually goes to someone else — unless the dealer has built a structure to participate in it.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "September 9, 2026",
    readTime: "12 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/CDJRsign.webp",
      alt: "Chrysler Dodge Jeep Ram signage at the Mt. Pleasant dealership in Iowa",
      caption: "CDJR signage at the Mt. Pleasant Chevy GMC CDJR store, a Coleman Automotive dealership. Every service contract sold under a franchise sign carries an underwriting economics question: who keeps the money that is not spent on claims? Photo: Sweet Dreams US LLC"
    },
    excerpt: "Inside the dealer cost of every vehicle service contract is a reserve for future claims. When claims come in below that reserve, someone keeps the difference. Dealer-owned reinsurance companies and dealer-owned warranty companies are how many dealers arrange for that someone to be them — with real risks attached.",
    content: [
      {
        type: "paragraph",
        text: "In last week's chapter on the F&I menu, we treated the vehicle service contract's dealer cost as a single number: the dealer buys the contract for one price, sells it for another, and books the difference as F&I gross. That is how it appears on the dealership's financial statement. But the dealer cost is not a single number. It is a bundle — administrative fees, insurance costs, and, most importantly, a reserve set aside to pay the claims that contract will generate over the next several years."
      },
      {
        type: "paragraph",
        text: "If those claims come in below the reserve, there is an underwriting profit. In a standard arrangement, that profit belongs to the insurer and administrator behind the product. Over the past several decades, many dealers have built structures that let them participate in it — most commonly through dealer-owned reinsurance companies and, in some cases, through dealer-owned warranty companies that act as the obligor on the contracts themselves. For investors, understanding these structures matters because they can hold meaningful value that never appears on the store-level P&L, and because they carry risks and regulatory scrutiny that are easy to underestimate."
      },
      {
        type: "paragraph",
        text: "This chapter walks through how a service contract dollar is divided, how reinsurance participation generally works, the difference between CFC and NCFC reinsurance companies, what a dealer-owned warranty company is, and the risk and regulatory caveats that come with each. This is general education about common industry structures. It is not tax, legal, or insurance advice; these structures are highly technical and should only be evaluated with qualified counsel. The Fund's actual terms are governed solely by its offering documents."
      },
      {
        type: "subheading",
        text: "Inside the Dealer Cost of a Service Contract"
      },
      {
        type: "paragraph",
        text: "Consider an illustrative service contract that retails for $2,500 and carries a dealer cost of $1,300. The $1,200 difference is the dealer's markup, recognized immediately as F&I income. The $1,300 dealer cost is remitted to the product provider and divides, for example, roughly as follows: perhaps $250 to the administrator for handling claims, customer service, and cancellations; perhaps $50 for insurance costs, premium taxes, and fees; and the remaining $1,000 or so into a claims reserve — the money expected to pay that contract's repairs over its life."
      },
      {
        type: "paragraph",
        text: "Now suppose the contracts in that cohort ultimately pay claims equal to 70% of the reserve. On a $1,000 reserve, that is $700 of claims and $300 of underwriting profit per contract, earned gradually as the contracts age and expire. The reserve also earns investment income while it waits to be paid out. In a standard, non-participating program, the dealer never sees either. The insurer and administrator keep them in exchange for having taken the risk that claims might have come in at 110% instead of 70%. That last point is the whole story. Underwriting profit is not free money; it is compensation for bearing claims risk. Every participation structure works by shifting some of that risk to the dealer — and the dealer only earns the profit if the risk turns out well."
      },
      {
        type: "subheading",
        text: "The Participation Spectrum"
      },
      {
        type: "paragraph",
        text: "Dealer participation arrangements sit on a spectrum from least to most risk and complexity. At the light end are retrospective commission or profit-sharing programs, in which the provider agrees to pay the dealer a share of underwriting profit on its business after the contracts have matured and the results are known. The dealer takes no direct insurance risk and forms no new entity, but receives less of the economics and receives them later. In the middle is the dealer-owned reinsurance company, often called a DORC or, more generally, a producer-owned reinsurance company. Here the dealer or related parties form a separate insurance company that reinsures the risk on the dealer's own contracts. At the heavy end is the dealer-owned warranty company, in which the dealer's own entity becomes the obligor on the service contracts. Each step along the spectrum gives the dealer more of the economics, more control, more risk, and more regulatory obligation."
      },
      {
        type: "subheading",
        text: "How a Dealer-Owned Reinsurance Company Works"
      },
      {
        type: "paragraph",
        text: "In a typical reinsurance structure, the service contract is still issued by a third-party provider, and the provider's contractual liability insurance policy is still written by a licensed insurer — the ceding company. That insurer then cedes the risk on contracts sold by the participating dealership to the dealer-owned reinsurer, transferring the claims reserve portion of the premium along with it. The reinsurer is now on the hook for those claims."
      },
      {
        type: "paragraph",
        text: "Because the ceding insurer remains responsible to customers if the reinsurer cannot pay, it almost always requires the reinsurer's funds to be held in a trust or similar collateral arrangement, with claims paid out of that trust. The reinsurer accounts for the premium as it is earned over the life of the contracts, typically using an earnings curve that reflects when claims are expected to occur. Unearned premium remains reserved; earned premium net of claims becomes surplus; and investment income accumulates on the trust assets. Distributions to the reinsurer's owners are generally permitted only when the reinsurer's surplus exceeds the levels required by the ceding company and the reinsurer's regulator. Many dealer reinsurance companies have historically been domiciled offshore, in jurisdictions such as the Turks and Caicos Islands, Nevis, Bermuda, or the Cayman Islands, which developed regulatory regimes suited to small reinsurers. Some are formed in U.S. states with captive insurance statutes. Domicile affects capitalization requirements, regulatory reporting, operating costs, and tax treatment."
      },
      {
        type: "callout-numbers",
        title: "Illustrative Reinsurance Cohort — One Year of Contracts",
        lines: [
          "Service contracts sold in the year: 1,200 (for example)",
          "Claims reserve ceded to the dealer's reinsurer: about $1,000 per contract = $1.2 million",
          "If cumulative claims run at 70% of reserve: about $840,000 paid over the contracts' lives",
          "Illustrative underwriting surplus: about $360,000, released over several years as contracts expire",
          "If claims run at 105% instead: the reinsurer absorbs a loss of about $60,000 on the cohort"
        ],
        link: {
          text: "See how Coleman Prime evaluates F&I structures in acquisition diligence",
          href: "/opportunity"
        }
      },
      {
        type: "subheading",
        text: "CFC and NCFC Structures, in General Terms"
      },
      {
        type: "paragraph",
        text: "Dealer reinsurance companies domiciled outside the United States are commonly described as either CFCs or NCFCs. These are tax concepts, and the distinction turns on ownership. A controlled foreign corporation, or CFC, is a foreign corporation controlled by U.S. shareholders as the Internal Revenue Code defines that term, and the Code applies a lower ownership threshold for insurance companies than for other foreign corporations. A non-controlled foreign corporation, or NCFC, is structured so that it does not meet that definition."
      },
      {
        type: "paragraph",
        text: "In practice, many dealer-owned CFC reinsurers elect under Section 953(d) of the Code to be treated as U.S. domestic corporations for federal income tax purposes, which subjects them to U.S. tax but can simplify compliance. Smaller insurers that meet the requirements may also elect under Section 831(b), which limits federal income tax to investment income for companies whose annual premiums fall below an inflation-adjusted cap. NCFC structures were historically used in pursuit of deferral of U.S. tax on the reinsurer's income; changes to the international tax rules over time, including the 2017 federal tax law, have substantially changed that analysis."
      },
      {
        type: "paragraph",
        text: "The IRS has also paid close attention to small captive insurance arrangements. In January 2025 it finalized regulations identifying certain so-called micro-captive transactions as listed transactions or transactions of interest, with disclosure obligations and penalties for noncompliance. Those regulations include an exclusion for certain consumer coverage arrangements tied to products sold to unrelated customers — a category that can include dealer reinsurers — but the exclusion has specific conditions. Whether any particular structure qualifies, and how it should be taxed and reported, is a question only qualified tax counsel can answer for that structure."
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/GMCTrucksandSign.webp",
        alt: "GMC trucks and signage at the Mt. Pleasant dealership in Iowa",
        caption: "GMC trucks and signage at the Mt. Pleasant Chevy GMC CDJR store, a Coleman Automotive dealership. Claims experience on service contracts depends heavily on what is being covered — vehicle type, mileage, and coverage tier all shape the loss ratio. Photo: Sweet Dreams US LLC"
      },
      {
        type: "subheading",
        text: "Dealer-Owned Warranty Companies"
      },
      {
        type: "paragraph",
        text: "A dealer-owned warranty company goes a step further. Instead of reinsuring a third-party provider's contracts, the dealer group forms its own service contract company to act as the obligor — the party legally responsible for paying claims — usually selling contracts under the group's own brand. Claims administration is often outsourced to a third-party administrator, and the obligor's liability is often backed by a contractual liability insurance policy, though some structures rely on other forms of financial security."
      },
      {
        type: "paragraph",
        text: "State service contract laws govern this activity. Requirements vary, but obligors commonly must register with the state, use contract forms that meet disclosure requirements, and demonstrate financial responsibility — typically by insuring their obligations, maintaining funded reserves plus a security deposit, or meeting a substantial net-worth test. Many states draw these requirements from the National Association of Insurance Commissioners' model service contract act, but the specifics differ state by state. The appeal is control and economics: the group sets coverage terms, retail pricing strategy, and claims philosophy, and keeps more of the underwriting result. The cost is responsibility. When a customer's claim is denied under a dealer-branded contract, the complaint lands on the dealership. Claims handling becomes a direct reputational exposure, and the group carries regulatory obligations in every state where it sells."
      },
      {
        type: "subheading",
        text: "The Risks Investors Should Understand"
      },
      {
        type: "paragraph",
        text: "The first risk is claims experience. Loss ratios on service contracts are not fixed; they move with vehicle reliability, the mix of models and mileage sold, and repair costs. As labor rates and parts prices have risen across the industry, claim severity has risen with them, and reserves set years earlier can prove inadequate. A cohort that was expected to run at 70% can run at 100% or more. Concentration makes this worse: a single store's contracts are a small, undiversified pool compared with a national insurer's book. The second is liquidity. Reinsurance assets are typically held in trust and released only as contracts expire and surplus requirements are met. Cancellations also draw on the reserve, because the unearned portion is refunded to customers. Value inside a reinsurer is real, but it is often illiquid and released over years rather than months."
      },
      {
        type: "paragraph",
        text: "The third is regulatory and reputational. Federal and state regulators have focused intensely on add-on products, and a structure that gives the dealer a stake in product profitability can draw questions about whether products are being sold on their merits. Products must be voluntary, clearly disclosed, fairly priced, and genuinely valuable to the customer — obligations we cover in next week's compliance chapter. Layered on top is the tax and insurance regulatory scrutiny described above, plus the governance costs of running a regulated insurance entity: audits, actuarial reviews, filings, and board oversight."
      },
      {
        type: "subheading",
        text: "Why This Matters in an Acquisition"
      },
      {
        type: "paragraph",
        text: "Reinsurance and warranty company structures matter disproportionately in dealership M&A. Reinsurers are frequently owned by the dealer principal personally or by related parties rather than by the dealership entity, which means they typically are not part of an asset purchase. A buyer acquiring the store usually does not acquire the seller's reinsurer, and the seller's reinsurer may continue to run off contracts written before closing."
      },
      {
        type: "paragraph",
        text: "That has three practical consequences. First, the store-level P&L may understate the total F&I economics the seller has been earning, because some of the value has been accruing inside a separately owned reinsurer. Second, product provider agreements must be transitioned or replaced at closing, and the buyer must decide whether, and how, to establish its own participation structure going forward. Third, the parties need to address cancellations and claims on pre-closing contracts — who refunds, who is charged back, and how customer service is handled — so customers are not caught between the old owner and the new one."
      },
      {
        type: "paragraph",
        text: "When Coleman Prime evaluates a target, we identify every F&I product provider relationship and every participation structure the seller uses, who owns it, and how it will be treated at closing. We normalize F&I income for the economics that will and will not transfer, and we review historical loss ratios and cancellation experience on the store's contracts. Any participation structure going forward is evaluated with outside insurance and tax counsel and judged on its risk, not just its potential upside."
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime maps every F&I product provider and participation structure at a target store, including who owns it and what transfers at closing.",
          "F&I income is normalized for economics that accrue outside the dealership entity before it is used in valuation.",
          "Run-off of pre-closing contracts — claims, cancellations, and chargebacks — is addressed in the purchase agreement, not after.",
          "Any participation structure is evaluated with outside insurance and tax counsel, with claims risk and regulatory exposure weighed as heavily as the upside."
        ],
        link: {
          text: "Learn how Coleman Prime conducts acquisition diligence",
          href: "/opportunity"
        }
      }
    ],
    relatedSlugs: [
      "fi-menu-vsc-gap-tire-wheel",
      "quality-of-earnings-dealership-acquisition-diligence"
    ]
  },

  {
    slug: "fi-menu-vsc-gap-tire-wheel",
    category: "Operations",
    title: "The F&I Menu Deconstructed: How VSC, GAP, and Tire & Wheel Add $1,500 to Every Deal",
    subtitle: "The business office is where a dealership's most profitable minutes happen. Here is what is actually on the menu, how each product is priced, and how the per-vehicle number is built.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "September 2, 2026",
    readTime: "11 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasentVetterInterrior.webp",
      alt: "Interior of the Mt. Pleasant dealership in Iowa",
      caption: "Interior of the Mt. Pleasant Chevy GMC CDJR store, a Coleman Automotive dealership. Once the vehicle and price are agreed, the transaction moves to the business office, where financing is arranged and protection products are presented. Photo: Sweet Dreams US LLC"
    },
    excerpt: "Industry benchmarks commonly put F&I gross profit somewhere around $1,500 per vehicle retailed, with wide variation by store. That number is not one product — it is a finance reserve plus a menu of optional protection products, each with its own price, cost, and penetration rate.",
    content: [
      {
        type: "paragraph",
        text: "Our earlier post on the role of F&I products in dealership profitability made the high-level case: the finance and insurance office generates a disproportionate share of a dealership's gross profit relative to its headcount and square footage. That post explained why F&I matters. This module goes inside the deal jacket to explain how it works — product by product, dollar by dollar."
      },
      {
        type: "paragraph",
        text: "For an investor, the reason to understand the menu in detail is that F&I income is both highly profitable and highly sensitive to execution. Two stores selling the same number of the same vehicles can produce very different F&I results depending on how the menu is presented, which products are offered, how they are priced, and how many deals unwind later through cancellations and chargebacks. The headline per-vehicle number hides all of that."
      },
      {
        type: "paragraph",
        text: "This chapter walks through the two sources of F&I income, the structure of a menu presentation, the economics of the three core products — vehicle service contracts, GAP, and tire and wheel protection — and an illustrative build of how a store arrives at a per-vehicle F&I figure in the range industry benchmarks commonly describe."
      },
      {
        type: "subheading",
        text: "Two Revenue Streams: Reserve and Products"
      },
      {
        type: "paragraph",
        text: "F&I gross profit comes from two places. The first is finance reserve, sometimes called dealer participation. When a dealership arranges financing, it typically writes a retail installment sale contract with the customer and assigns that contract to a bank, credit union, or captive finance company. The lender approves the deal at a buy rate — the interest rate at which it will purchase the contract. The dealer may write the contract at a somewhat higher rate, within limits set by the lender's dealer agreement and by law, and the lender compensates the dealer for a share of that difference."
      },
      {
        type: "paragraph",
        text: "For example, assume a $35,000 amount financed over 72 months, with a lender buy rate of 6.0% and a contract rate of 7.0%. The extra point of interest adds roughly $1,200 of finance charges over the full life of the loan. Depending on the lender's participation terms, the dealer might receive a portion of that — say, for illustration, around $800 — typically paid shortly after the lender funds the contract. If the customer pays the loan off or defaults within an early window defined in the dealer agreement, often the first few months, the lender charges some or all of that reserve back."
      },
      {
        type: "paragraph",
        text: "Lenders cap how much markup a dealer can add, and those caps tightened across much of the industry after regulators focused on fair-lending risk in dealer discretion — a subject we take up in detail in our F&I compliance chapter. Many deals also produce no reserve at all: cash buyers, customers who bring outside financing, and subvented manufacturer rate programs that pay the dealer a flat fee instead of a rate spread."
      },
      {
        type: "paragraph",
        text: "The second stream is product income. The F&I manager offers optional protection products, each purchased by the dealership from a product provider at a dealer cost and sold to the customer at a retail price. The difference is the dealer's gross profit on that product, recorded as F&I income. When the customer finances, the product price is typically included in the amount financed and itemized on the contract."
      },
      {
        type: "subheading",
        text: "What a Menu Is — and Why It Exists"
      },
      {
        type: "paragraph",
        text: "A menu is a single-page presentation, usually generated by F&I software, that lays out every available product and several package options side by side with their prices and the resulting monthly payments. A typical layout shows three or four columns — a comprehensive package, one or two intermediate packages, and a base column with the vehicle payment and no products — so the customer can see exactly what each choice costs."
      },
      {
        type: "paragraph",
        text: "Menu selling replaced an older, discredited practice of quoting a payment that already had products built into it without disclosing them, a practice known as payment packing. The menu exists for three reasons. It is a compliance tool: every customer sees the same products and the same price structure, and the customer's declinations are documented. It is a consistency tool: the presentation does not depend on one F&I manager's improvisation. And it tends to be a performance tool, because customers who see the options clearly and choose for themselves are more likely to buy a product they value and less likely to cancel it later."
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawSticker.webp",
        alt: "Window sticker on a vehicle at Nissan of Warsaw",
        caption: "Window sticker on a vehicle at Nissan of Warsaw, a Coleman Automotive dealership. The sticker shows what the vehicle costs; the F&I menu shows what it costs to protect and finance it. Photo: Sweet Dreams US LLC"
      },
      {
        type: "subheading",
        text: "Vehicle Service Contracts: The Anchor Product"
      },
      {
        type: "paragraph",
        text: "The vehicle service contract, often loosely called an extended warranty, is the anchor of most menus. It covers the cost of specified mechanical repairs after — or overlapping with — the manufacturer's warranty, for a selected term and mileage, usually with a deductible. Coverage tiers range from powertrain-only to exclusionary coverage that pays for everything except a listed set of exclusions. Behind each contract sit several parties. The obligor is the entity legally responsible for paying claims. An administrator handles claims, customer service, and cancellations. In most structures the obligor's liability is backed by a contractual liability insurance policy issued by an insurer. Service contracts are regulated under state service contract laws, which in most states treat them as distinct from insurance products but impose registration, disclosure, and financial-security requirements on providers."
      },
      {
        type: "paragraph",
        text: "The dealer's economics come from the spread between dealer cost and retail price. For illustration, a contract might cost the dealer $1,300 and sell for $2,500, producing $1,200 of gross profit. Retail pricing varies widely with coverage, term, vehicle, and state rules, and many dealers price below the maximum to support penetration. What the dealer cost itself contains — the administrator's fee, the insurer's premium, and the reserve set aside for future claims — is the subject of next week's chapter on reinsurance and dealer-owned warranty companies."
      },
      {
        type: "subheading",
        text: "GAP: Covering the Negative Equity Window"
      },
      {
        type: "paragraph",
        text: "Guaranteed Asset Protection, or GAP, covers the difference between what a primary auto insurer pays on a total loss — generally the vehicle's actual cash value — and what the customer still owes on the loan. Because vehicles depreciate fastest in their early years and long-term loans amortize slowly at first, many financed customers owe more than the vehicle is worth for a substantial portion of the loan term. A total loss in that window leaves the customer owing money on a car they no longer have."
      },
      {
        type: "paragraph",
        text: "In dealer-sold transactions, GAP is commonly structured as a GAP waiver — a debt cancellation addendum to the retail installment contract, in which the creditor agrees to waive the deficiency — rather than as a standalone insurance policy, though both forms exist. Many states regulate GAP pricing, disclosures, and refund obligations specifically, and some cap the retail price. GAP is generally cancellable, with a pro-rata refund of the unearned charge if the loan is paid off early. For illustration, a GAP waiver might carry a dealer cost of $250 and a retail price of $750, for $500 of gross."
      },
      {
        type: "subheading",
        text: "Tire & Wheel and the Rest of the Menu"
      },
      {
        type: "paragraph",
        text: "Tire and wheel protection covers repair or replacement of tires and wheels damaged by road hazards — potholes, nails, debris — that the manufacturer's warranty does not cover. It sells especially well on vehicles with low-profile tires and large alloy wheels, where a single damaged wheel can cost several hundred dollars to replace. For illustration, it might carry $450 of gross per contract sold. Behind the three core products, most menus include some combination of prepaid maintenance plans, appearance or paint-and-fabric protection, key replacement, windshield protection, and theft-deterrent or recovery products. Each carries its own provider, cost, price, and penetration rate. Regulators have paid particular attention to products whose value to the customer is hard to demonstrate, which is one reason disciplined stores keep the menu focused on products that genuinely pay claims and that customers understand."
      },
      {
        type: "callout-numbers",
        title: "Illustrative F&I Build Per Vehicle Retailed",
        lines: [
          "Finance reserve averaged across all deals, including cash and subvented: about $500",
          "Vehicle service contract: $1,200 gross × 40% penetration = $480",
          "GAP: $500 gross × 35% penetration = $175",
          "Tire & wheel: $450 gross × 25% penetration = about $110",
          "Prepaid maintenance and other products combined: about $250",
          "Illustrative total: roughly $1,500 per vehicle retailed — before cancellations and chargebacks"
        ],
        link: {
          text: "See how Coleman Prime evaluates F&I performance in diligence",
          href: "/opportunity"
        }
      },
      {
        type: "subheading",
        text: "Reading the Per-Vehicle Number Correctly"
      },
      {
        type: "paragraph",
        text: "The build above is illustrative, but it shows why the per-vehicle figure — usually reported as F&I gross per vehicle retailed, or PVR — is a blend rather than a price. No individual customer pays $1,500 in F&I. Some buy nothing and pay cash; others finance with reserve and buy three products. The average across all retail deliveries is what lands on the financial statement. That is why the $1,500 in this chapter's title should be read as an approximate, industry-typical figure, not a standard every store achieves. F&I results vary widely: large publicly traded dealer groups have reported per-unit F&I figures well above $2,000 in recent years, while many single-point stores run well below the typical range. Brand, vehicle mix, new versus used mix, credit profile of the customer base, state pricing rules, and the skill of the F&I staff all move the number. Used vehicles, for example, often generate higher service contract penetration because they have less factory warranty remaining."
      },
      {
        type: "paragraph",
        text: "The other adjustment is cancellations. Customers can cancel most products and receive a pro-rata refund of the unearned charge, and an early loan payoff typically triggers GAP refunds and reserve chargebacks. When a product cancels, the provider refunds the customer and charges the dealer back its share of the gross. A store that books $1,500 per unit but carries an inadequate chargeback reserve is overstating its earnings — a classic quality-of-earnings adjustment we will return to in Module 5."
      },
      {
        type: "subheading",
        text: "Where Execution Shows Up"
      },
      {
        type: "paragraph",
        text: "Because almost all F&I income is gross profit with no inventory and very little direct cost beyond the product itself and the F&I manager's commission, small changes in execution flow almost entirely to the bottom line. A five-point increase in service contract penetration on 1,200 annual retail deliveries, at $1,200 of gross per contract, adds roughly $72,000 of annual gross in this illustration. The wrong way to chase that improvement is pressure. Products sold through confusion or pressure cancel at high rates, generate complaints, and create exactly the regulatory exposure our next two chapters describe. The right way is a consistent menu presented to every customer, products that pay real claims, transparent pricing, trained F&I managers, and a culture in which a customer saying no is documented and respected. Over time, that approach tends to produce better penetration and lower cancellations at the same time."
      },
      {
        type: "paragraph",
        text: "When Coleman Prime evaluates a target, we look at F&I performance by product and by F&I manager, not just in aggregate. We review penetration rates, average gross per product, the share of deals with reserve, lender markup practices, cancellation rates, and the adequacy of the chargeback reserve against actual chargeback history. We also review the product provider agreements themselves, because the terms of those agreements determine how much of each product's economics the store actually keeps — the subject of next week's chapter."
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime reviews F&I results product by product and manager by manager, with penetration and cancellation rates side by side.",
          "Reported F&I income is tested against actual chargeback history before it is relied on in valuation.",
          "Every customer sees the same menu; declinations are documented and respected.",
          "Product lineups are kept to protection products that pay real claims and that customers can understand."
        ],
        link: {
          text: "Learn how Coleman Prime approaches F&I operations at acquired stores",
          href: "/opportunity"
        }
      }
    ],
    relatedSlugs: [
      "role-of-fi-products-dealership-profitability",
      "reinsurance-dowc-dealer-owned-warranty-companies"
    ]
  },

  {
    slug: "warranty-administration-hidden-reimbursement",
    category: "Operations",
    title: "Warranty Administration: The Hidden Reimbursement Most Dealers Leave on the Table",
    subtitle: "Every warranty repair is paid by the manufacturer, at a rate the dealer has a legal right to influence. Most dealers never exercise that right — and the gap shows up every month in fixed operations gross.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "August 26, 2026",
    readTime: "11 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/ServiceDepartment.jpg",
      alt: "Service department at Nissan of Elgin, a Coleman Automotive dealership",
      caption: "Service department at Nissan of Elgin, a Coleman Automotive dealership. A meaningful share of the work performed in any franchised service drive is billed not to the customer but to the manufacturer. Photo: Sweet Dreams US LLC"
    },
    excerpt: "Warranty work is the one category of service revenue where the customer never sees the bill. The manufacturer pays it — at labor and parts rates that state law often lets the dealer reset to retail. Dealers who never file that paperwork are quietly subsidizing their manufacturer.",
    content: [
      {
        type: "paragraph",
        text: "When a customer brings a two-year-old vehicle into a franchised service department with a failed water pump, the repair is usually free to the customer. It is not free to anyone else. The dealership performs the work, the technician is paid, the part comes out of inventory, and the dealership submits a claim to the manufacturer for reimbursement. That claim — and the rate at which it is paid — is one of the least-understood line items in dealership economics."
      },
      {
        type: "paragraph",
        text: "For an investor, warranty is interesting for two reasons. First, it is a recurring, manufacturer-funded revenue stream that does not depend on consumer demand in the way vehicle sales do; recalls and factory warranty repairs arrive whether or not the local economy is strong. Second, the rate at which that work is reimbursed is not fixed. In most states, franchise laws give dealers a statutory right to be paid for warranty parts and labor at something close to the rates they charge retail customers. Many dealers never fully exercise that right, and the difference falls straight to the bottom line of the store that does."
      },
      {
        type: "paragraph",
        text: "This chapter walks through how warranty claims are generated and paid, how state retail-rate reimbursement statutes generally work, where claims get rejected and charged back, and how Coleman Prime evaluates a target store's warranty operation during diligence. It also closes our module on the service and parts engine."
      },
      {
        type: "subheading",
        text: "How a Warranty Claim Gets Paid"
      },
      {
        type: "paragraph",
        text: "Warranty work in a franchised store falls into a few buckets: repairs under the manufacturer's new-vehicle limited warranty (the familiar bumper-to-bumper and powertrain coverages), certified pre-owned warranty repairs, safety recalls, and manufacturer-initiated service campaigns or customer-satisfaction programs. In each case the manufacturer, not the vehicle owner, is the paying customer on the repair order. The reimbursement formula is straightforward in principle. Labor is paid as the manufacturer's published labor time for the operation — the factory flat-rate hours assigned to a specific labor operation code — multiplied by the dealer's approved warranty labor rate. Parts are paid at the dealer's cost plus an approved warranty parts markup. Sublet work, diagnostic time, and certain incidentals are paid under the manufacturer's warranty policy manual, which every brand publishes and updates regularly."
      },
      {
        type: "paragraph",
        text: "The two numbers that matter most are the warranty labor rate and the warranty parts markup. As we covered in our chapter on effective labor rate, a well-run store's customer-pay effective labor rate is the real price the market pays for an hour of technician time. If the manufacturer is reimbursing warranty hours at a materially lower rate — and warranty parts at a thinner markup than the parts counter earns on retail — then every warranty repair is being performed at a discount to the store's own retail pricing."
      },
      {
        type: "subheading",
        text: "Retail-Rate Reimbursement: What State Statutes Generally Provide"
      },
      {
        type: "paragraph",
        text: "The large majority of states have written warranty reimbursement provisions into their motor vehicle dealer franchise statutes — the same body of law we discussed in our chapters on the franchise agreement and franchise law protections. The specifics vary considerably by state, but the core principle is broadly consistent: a manufacturer must compensate its dealers for warranty parts and labor at a rate that is reasonable and, in many states, not less than the rate the dealer charges its retail customers for comparable non-warranty work."
      },
      {
        type: "paragraph",
        text: "Most statutes establish that retail rate through a defined submission process. The dealer assembles a set of qualifying customer-pay repair orders — commonly 100 sequential customer-pay repair orders or all such orders within a 90-day window, with the exact formula depending on the state — and calculates the average labor rate and parts markup actually charged on them. Statutes typically exclude repairs that would distort the average: routine maintenance, tires, fluids and shop supplies, vehicle reconditioning, discounted or goodwill work, accessory installations, and repairs performed for internal or fleet customers at special pricing."
      },
      {
        type: "paragraph",
        text: "The manufacturer then usually has a defined window — often around 30 days — to approve the submitted rate or to rebut it with a documented explanation of why it is inaccurate. If the manufacturer does not respond in time or cannot substantiate its objection, the new rate generally takes effect on a schedule the statute sets. Many states limit how often a dealer may file (commonly once per year), and a growing number expressly prohibit manufacturers from recovering higher warranty costs through vehicle price surcharges or other retaliation against dealers who request retail-rate reimbursement."
      },
      {
        type: "paragraph",
        text: "Two caveats matter. First, the statutes are state-specific, amended frequently, and drafted differently enough that a submission that works in one state may be rejected in another; the details belong with counsel and experienced warranty consultants, not with a general rule of thumb. Second, the right is not self-executing. The manufacturer does not automatically raise a dealer's warranty rate when that dealer raises its retail prices. The dealer has to assemble the repair orders, compute the rates correctly, and file."
      },
      {
        type: "callout-numbers",
        title: "Illustrative Retail-Rate Submission — One Store, One Year",
        lines: [
          "Annual warranty labor hours: 6,000 (for example)",
          "Warranty labor rate before submission: $135/hr vs. customer-pay effective rate of $160/hr",
          "Labor uplift if the retail rate is approved: 6,000 hrs × $25 = $150,000",
          "Annual warranty parts at cost: $900,000; markup moves from 40% to 60% = $180,000",
          "Combined illustrative annual gross uplift: roughly $330,000 — with no new customers, bays, or technicians"
        ],
        link: {
          text: "See how Coleman Prime underwrites fixed operations upside",
          href: "/opportunity"
        }
      },
      {
        type: "paragraph",
        text: "The numbers above are illustrative, but the structure is real. Because the incremental revenue arrives with almost no incremental cost — the technician is already paid on the flat-rate hours and the part was already in inventory — nearly the entire uplift drops to gross profit. In a store with a fixed absorption ratio in the 70s or 80s, a few hundred thousand dollars of incremental warranty gross can move that ratio by several points."
      },
      {
        type: "subheading",
        text: "Why So Many Dealers Never File"
      },
      {
        type: "paragraph",
        text: "If the economics are this clear, why do so many stores leave the money on the table? In our experience the reasons are mostly operational. Assembling a compliant submission is tedious work: the repair orders must be pulled in the precise sequence the statute requires, each one coded correctly, exclusions applied consistently, and the math defensible line by line when the manufacturer's warranty team reviews it. A single-point store's service manager is rarely staffed to do it well. There is also a pricing discipline problem underneath. A retail-rate submission can only capture the rate a store actually charges. If service advisors routinely discount customer-pay work, or the store has never raised its posted labor rate to market, the submitted average will be low no matter how carefully it is prepared. Warranty reimbursement is therefore downstream of the effective labor rate and parts pricing work we covered earlier in this module — the stores that run tight customer-pay pricing are the stores that earn the most from a submission."
      },
      {
        type: "paragraph",
        text: "Finally, some dealers are simply reluctant to press the manufacturer. That reluctance is understandable in a relationship that also governs allocation and incentives, but it is the reason so many states wrote anti-retaliation provisions into their statutes. A professionally prepared submission filed under the state's process is the exercise of a statutory right, not a confrontation."
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasantFront.webp",
        alt: "Front exterior of the Mt. Pleasant Chevy GMC CDJR dealership in Iowa",
        caption: "Front of the Mt. Pleasant Chevy GMC CDJR store in Iowa, a Coleman Automotive dealership. Multi-franchise stores administer a separate warranty relationship, policy manual, and reimbursement rate for every brand on the building. Photo: Sweet Dreams US LLC"
      },
      {
        type: "subheading",
        text: "Claims Administration: Where Warranty Dollars Leak"
      },
      {
        type: "paragraph",
        text: "The reimbursement rate is the headline, but day-to-day warranty administration determines how much of that rate the store actually collects. Every claim has to be submitted within the manufacturer's filing deadline, coded to the correct labor operation, and supported by documentation the manufacturer's policy manual requires. The basic standard is often summarized as the three Cs: the customer's complaint, the cause the technician found, and the correction performed — written clearly enough that an auditor reading the repair order months later can follow the diagnosis. Claims that fail those standards are rejected or returned for correction, and every returned claim is working capital tied up in the warranty claims receivable account on the dealer's financial statement. In a well-run store that receivable turns quickly and aged claims are rare. In a poorly run one, the receivable accumulates claims thirty, sixty, and ninety days old — many of which will eventually be written off because nobody had the time to fix and resubmit them."
      },
      {
        type: "paragraph",
        text: "Diagnostic time is a frequent source of leakage. Modern vehicles can require extended diagnostic work before the actual failure is identified, and manufacturer policies on how much diagnostic time is reimbursable — and what pre-authorization is required — differ by brand. A technician who spends ninety minutes diagnosing an intermittent electrical fault and records it poorly may produce a claim that pays a fraction of the time actually spent. Over thousands of repair orders a year, that difference matters to both the store's gross and the technician's paycheck, which is why warranty labor times are a recurring theme in the pay-plan discussions we covered earlier in this module."
      },
      {
        type: "subheading",
        text: "Audits, Chargebacks, and the Administrator's Role"
      },
      {
        type: "paragraph",
        text: "Getting paid on a claim is not the end of the story. Manufacturers audit warranty claims after payment, and if a claim is found to be unsupported — missing technician time punches, a part not retained for return, a repair that does not match the documented cause — the manufacturer can charge the payment back against the dealer's account. Chargebacks from a single audit can reach six figures in a store with sloppy documentation habits. Many state franchise statutes limit this exposure. Common provisions include a cap on how far back a manufacturer can audit paid claims, a requirement that chargebacks be based on material noncompliance rather than clerical errors, a deadline for manufacturers to pay or reject claims after submission, and a right for the dealer to appeal. Those protections help, but they do not substitute for clean files. The best defense against a warranty chargeback is a repair order that would pass the audit on the day it is written."
      },
      {
        type: "paragraph",
        text: "A related area is recall and stop-sale compensation. When a manufacturer issues a stop-sale on a recalled model, any affected used vehicles in the dealer's inventory cannot be retailed until the remedy is available and performed. Those units still carry floor plan interest and depreciation while they sit. A number of states now require manufacturers to compensate dealers for qualifying used inventory held under a stop-sale, and the claim process for that compensation is another piece of warranty administration that rewards a store paying attention."
      },
      {
        type: "paragraph",
        text: "In most stores the warranty administrator is a back-office clerical position. In the stores that run warranty well, it is treated as a profit role. The administrator reviews repair orders before submission, coaches technicians on documentation, tracks rejection and chargeback rates by technician and by labor operation, works the aged receivable weekly, and knows the brand's policy manual better than anyone else in the building. At platform scale, that role can be supported by a centralized function that handles retail-rate submissions across every store and every brand on a coordinated calendar, monitors each state's statutory changes, and benchmarks warranty performance across rooftops. A single store rarely justifies that capability. A group of stores does — and this is another example of the operating leverage that comes from consolidating fixed operations disciplines across a platform."
      },
      {
        type: "subheading",
        text: "What We Look At in Diligence"
      },
      {
        type: "paragraph",
        text: "When Coleman Prime evaluates an acquisition, warranty administration is one of the first places we look for embedded upside. We compare the store's current warranty labor rate and parts markup against its customer-pay effective rates, and we ask when the last retail-rate submission was filed in each brand — in a surprising number of stores the honest answer is that nobody remembers. We review the aging of the warranty claims receivable, the trailing chargeback history from manufacturer audits, and the rejection rate on submitted claims. We are careful not to underwrite that upside as certain. A retail-rate submission depends on the store's actual customer-pay pricing, the state's statutory formula, and the manufacturer's review, and the result can differ from the estimate. What the diligence does tell us is whether a target has been leaving reimbursement uncollected, and whether the pricing and documentation discipline that would let us collect it is already in place or must be built after closing."
      },
      {
        type: "paragraph",
        text: "This chapter is general education about how warranty reimbursement typically works; it is not legal advice, and the specific rights available to any dealer depend on that state's statute and the manufacturer's agreements. With warranty, we close Module 3. Next week we cross the building into the business office, where Module 4 opens with a document-by-document look at the F&I menu."
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime reviews warranty labor rates, parts markups, and the date of the last retail-rate submission for every brand at every target store.",
          "Warranty claims receivable aging and manufacturer chargeback history are reviewed alongside the service department P&L, not separately.",
          "After closing, warranty administration is run as a profit role with consistent documentation standards across the platform.",
          "Any submission upside is treated as an operating opportunity to be earned, never as an assumption built into the purchase price."
        ],
        link: {
          text: "Learn how Coleman Prime builds fixed operations value after acquisition",
          href: "/opportunity"
        }
      }
    ],
    relatedSlugs: [
      "effective-labor-rate-vs-posted-labor-rate",
      "understanding-fixed-absorption-dealership-recession-resistance"
    ]
  },

  {
    slug: "parts-inventory-fill-rate-obsolescence-turns",
    category: "Operations",
    title: "The Parts Inventory Discipline: Fill Rate, Obsolescence, and Turns",
    subtitle:
      "A parts department is an inventory business sitting inside a service business. Stock too little and technicians wait while customers leave. Stock too much and capital sits on shelves until it becomes obsolete. The discipline lies in managing the tension between the two.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "August 19, 2026",
    readTime: "10 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/mtpleasantdrone.png",
      alt: "Aerial view of the Mt. Pleasant dealership campus in Iowa",
      caption:
        "Aerial view of Mt. Pleasant Chevy GMC CDJR in Iowa, a Coleman Automotive dealership. A multi-brand campus like this one carries parts inventory for several manufacturers — each with its own stocking, ordering, and return rules. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Parts inventory is one of the least visible assets on a dealership's balance sheet and one of the easiest to mismanage. This chapter explains the three numbers that define a well-run parts department — fill rate, turns, and obsolescence — and how they trade off against each other.",
    content: [
      {
        type: "paragraph",
        text: "In Module 1 we spent a full chapter on vehicle inventory — days supply, turn rate, and the cost of aged units. There is a second inventory inside every franchised dealership that gets far less attention, even from experienced investors: the parts department. It may hold several hundred thousand dollars or more of stock across thousands of individual part numbers, and it behaves according to the same underlying logic as the vehicle lot. Capital tied up in inventory has a cost. Inventory that does not move loses value. And inventory that is not there when it is needed costs a sale.",
      },
      {
        type: "paragraph",
        text: "The parts department sells in three directions. It supplies the dealership's own service department — the largest channel at most stores. It sells over the counter to retail customers and do-it-yourselfers. And it sells wholesale to independent repair shops, collision centers, and fleet operators. Each channel has different margin and service expectations, and each depends on the parts manager having the right part on the shelf at the right time.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through the three metrics that define parts inventory discipline — fill rate, turns, and obsolescence — how they pull against one another, the stocking and return mechanics that manage that tension, and how Coleman Prime evaluates a parts department during diligence.",
      },
      { type: "subheading", text: "Fill Rate: Having the Part When It Is Needed" },
      {
        type: "paragraph",
        text: "Fill rate measures the share of parts requests that can be filled immediately from stock. Most operators focus on first-time fill rate — the percentage of lines on a repair order or counter ticket that are filled from the shelf on the first request, without a special order or a run to another dealer. A technician who walks to the parts counter and gets the part in hand keeps working. A technician who is told the part will arrive tomorrow stops, the vehicle sits in a bay or on the lot, and the customer gets a call they did not want. The cost of a poor fill rate extends well beyond the parts department. Every unfilled request costs technician time, ties up a service bay, delays the repair order, and puts customer satisfaction at risk. On flat-rate pay plans, as we discussed last week, technicians waiting on parts are technicians not earning — and that frustration shows up in retention. For wholesale customers, fill rate is the reason they buy from the dealer at all. An independent shop that cannot get the part today will find another source.",
      },
      {
        type: "paragraph",
        text: "Many well-run departments target first-time fill rates in roughly the high-80s to low-90s percentage range for service and counter demand. A department far below that is usually understocked on common parts or has poor stocking rules. A department claiming fill rates near 100% should be examined carefully: it may be carrying far too much inventory to get there, or it may be measuring fill rate in a way that excludes special orders from the calculation.",
      },
      { type: "subheading", text: "Turns: Making the Inventory Work" },
      {
        type: "paragraph",
        text: "Inventory turns measure how many times the department sells through its average inventory over a year, usually calculated as annual cost of parts sold divided by average inventory value at cost. For example, a department with $1.2 million in annual cost of sales and an average inventory of $250,000 turns its stock roughly 4.8 times a year. Put differently, the average part sits on the shelf for about 76 days before it sells. Higher turns mean less capital tied up for the same level of sales. Industry guidance commonly places a healthy stocking-inventory turn rate in the range of roughly four to six times a year, though the right target depends on the brand, the store's volume, and how far it is from the manufacturer's distribution center. A store that receives daily parts deliveries can run leaner than a rural store that receives fewer shipments and needs deeper stock to protect fill rate.",
      },
      {
        type: "paragraph",
        text: "Turns also need to be read carefully. A department can show strong turns by stocking very little and special-ordering everything — which looks efficient on the inventory line and costs heavily on the service side through poor fill rate. That is why turns and fill rate must always be read together. Either number in isolation can be manipulated; the two together tell the truth.",
      },
      {
        type: "callout-numbers",
        title: "An Illustrative Parts Department",
        lines: [
          "For example: $1.8M annual parts sales at a 35% gross margin → about $1.17M cost of sales",
          "Average inventory at cost: $260,000 → roughly 4.5 turns, about 81 days on the shelf",
          "First-time fill rate: 88% of service and counter lines",
          "Parts with no sale in 12+ months: $36,000, about 14% of inventory value",
          "Every $50,000 of idle stock cleared and not replaced frees $50,000 of working capital and removes a future write-down risk",
        ],
        link: {
          text: "See how Coleman Prime evaluates dealership operations during diligence",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "Obsolescence: The Quiet Balance-Sheet Problem" },
      {
        type: "paragraph",
        text: "Obsolescence is what happens when inventory stops moving. Parts are superseded by new part numbers. Models age out of the market. A part ordered for a single repair is returned unused and goes back on the shelf, never to be called for again. Over time, these parts accumulate. They are still carried on the balance sheet at cost, but their real value is often a fraction of that — and sometimes close to zero. Parts managers typically track inventory by aging bucket: parts with no sale in the last three, six, nine, and twelve months. Parts in the older buckets are frequently described as idle or obsolete stock. A meaningful percentage of inventory in the twelve-months-plus bucket is a signal that stocking rules have been loose, that returns have been neglected, or that the department has absorbed inventory from discontinued programs without addressing it.",
      },
      {
        type: "paragraph",
        text: "For an investor, obsolescence is a balance-sheet question as much as an operating one. A dealership's financial statement may show parts inventory at its carrying value, but a buyer acquiring that inventory needs to know how much of it will actually sell. In acquisition diligence, parts inventory is typically counted and valued as part of the transaction, and obsolete stock is a common point of negotiation. We will return to this in our chapter on quality of earnings.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/CDJRsign.webp",
        alt: "Chrysler Dodge Jeep Ram signage at the Mt. Pleasant dealership",
        caption:
          "Chrysler, Dodge, Jeep, and Ram signage at Mt. Pleasant Chevy GMC CDJR in Iowa. Each franchise brings its own parts program, return allowances, and stocking guidance that the parts department must manage. Photo: Sweet Dreams US LLC",
        orientation: "wide",
      },
      { type: "subheading", text: "Phase-In and Phase-Out: The Stocking Rules" },
      {
        type: "paragraph",
        text: "The mechanism that balances fill rate against turns and obsolescence is the stocking policy — the set of rules that determine when a part is added to stock and when it is removed. Most dealer management systems and OEM parts programs support phase-in and phase-out criteria based on demand history. For example, a part might be added to regular stock after it has been requested a certain number of times within a defined number of months, and removed from stock when it has not sold within a longer window.",
      },
      {
        type: "paragraph",
        text: "A key input to those rules is lost-sale tracking. When a technician or counter customer asks for a part that is not in stock, a disciplined parts department records that request even if the part is special-ordered or the customer goes elsewhere. Without this data, the stocking system only sees demand that was successfully filled, and it systematically understocks parts the store needs. Lost-sale tracking is one of the simplest and most overlooked tools in parts management.",
      },
      {
        type: "paragraph",
        text: "Manufacturers also provide stocking guidance and, in many cases, automated replenishment programs that recommend or place orders based on the dealer's sales history and the OEM's view of regional demand. These programs can be valuable, particularly for new model launches, but they need oversight. A parts manager who accepts every system recommendation without review can find the department carrying inventory sized to the manufacturer's preferences rather than the store's actual demand.",
      },
      { type: "subheading", text: "Returns: The Release Valve" },
      {
        type: "paragraph",
        text: "Most manufacturers offer dealers some form of parts return program — the ability to send back eligible, unsold stock for credit, typically up to a percentage allowance tied to the dealer's purchases over a period, and often subject to restocking charges and eligibility rules. The specifics vary by manufacturer and change over time. What does not vary is the principle: return allowances that go unused are a lost opportunity to clear slow-moving inventory at or near cost.",
      },
      {
        type: "paragraph",
        text: "Disciplined departments treat the return window as a scheduled event. Before each return period, the parts manager pulls the aging report, identifies eligible slow movers, and uses as much of the allowance as is sensible. Parts that are not returnable are worked through other channels: discounted to wholesale customers, offered to other dealers through parts-locator and exchange networks, or written down when there is no realistic market. The goal is to keep the older aging buckets small and stop obsolescence from compounding year after year.",
      },
      { type: "subheading", text: "Gross Margin and the Channel Mix" },
      {
        type: "paragraph",
        text: "Parts margin depends heavily on which channel the sale goes through. Parts sold on customer-pay repair orders generally carry the strongest margin. Warranty parts are reimbursed by the manufacturer, and as we touched on in our labor rate chapter, many state franchise laws tie warranty parts reimbursement to the dealer's retail markup under a statutory formula. Wholesale parts sold to independent shops and collision centers carry lower margins but can add meaningful volume, and in some markets wholesale is a significant share of the department's sales.",
      },
      {
        type: "paragraph",
        text: "Pricing matrices play the same role in parts that labor-rate matrices play in service. Many departments price customer-pay parts on a sliding markup — higher percentage markup on low-cost items, lower markup on expensive components — to stay competitive on big-ticket parts while earning appropriate margin on the small items that make up most transactions. As with labor rates, a matrix that is designed deliberately and reviewed regularly will usually outperform a single flat markup applied to everything.",
      },
      { type: "subheading", text: "How Coleman Prime Evaluates a Parts Department" },
      {
        type: "paragraph",
        text: "In diligence, we review the parts inventory aging report, the current stocking and phase-out rules, first-time fill rate by channel, turns, gross margin by channel, and the store's use of manufacturer return allowances over recent periods. We compare the carrying value of inventory to what an aging analysis suggests it is realistically worth, and we treat material obsolete stock as a valuation item in the transaction rather than an operating afterthought. We also look at how the parts and service departments work together — because the most common source of poor fill rate is not the parts manager alone, but a lack of communication between the parts counter and the service drive.",
      },
      {
        type: "paragraph",
        text: "A well-run parts department is not glamorous. It is a set of rules, reports, and habits applied consistently every week. But it is also one of the clearest windows into a dealership's overall operating discipline. A store that knows exactly what is on its shelves, why it is there, and how fast it moves is usually a store that manages the rest of the business the same way. Next week, we close Module 3 with warranty administration — where parts, labor, and manufacturer reimbursement all come together.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime reviews parts aging, fill rate, turns, and return-allowance usage as part of operational diligence on every acquisition target.",
          "Obsolete and idle parts inventory is valued realistically and addressed in the transaction rather than inherited at carrying value.",
          "After acquisition, stocking rules, lost-sale tracking, and scheduled returns are managed under the Coleman Automotive Group fixed-operations playbook, with fill rate and turns reviewed alongside service performance.",
        ],
        link: {
          text: "Learn how Coleman Prime approaches dealership operations",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "warranty-administration-hidden-reimbursement",
      "days-supply-turn-rate-aged-inventory-math",
    ],
  },

  {
    slug: "technician-pay-plans-flat-rate-hourly-hybrid",
    category: "Operations",
    title: "Technician Pay Plans: Flat Rate, Hourly, or Hybrid?",
    subtitle:
      "Technicians are the scarcest resource in a dealership, and how they are paid shapes how much the service department produces, how long good technicians stay, and how the work gets done. There is no perfect plan — only tradeoffs an operator must manage deliberately.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "August 12, 2026",
    readTime: "11 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Streetsboro/streetsborofrontofstore.webp",
      alt: "Front of the Streetsboro dealership in Ohio",
      caption:
        "Front of store at the Streetsboro dealership in Ohio, a Coleman Automotive location. Behind the showroom, the service department's capacity depends on recruiting and keeping skilled technicians — and pay plan design is central to both. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Flat-rate pay has dominated dealership service departments for decades, but hourly and hybrid plans are gaining ground as the technician shortage reshapes the labor market. This chapter explains how each plan works, what behavior each one rewards, and how pay design connects directly to service profitability.",
    content: [
      {
        type: "paragraph",
        text: "Last week we looked at the effective labor rate — what a service department actually earns for each hour it sells. Rate is only one side of the equation. The other side is how many hours the shop can produce, and that depends almost entirely on technicians: how many the store has, how skilled they are, how productive they are, and whether they stay.",
      },
      {
        type: "paragraph",
        text: "Technicians are, for most franchised dealers, the binding constraint on fixed-operations growth. Industry groups have reported a persistent gap between the number of new technicians entering the field and the number the industry needs, and most dealers will tell you that finding and keeping experienced, factory-certified technicians is harder than finding customers. In that environment, the technician pay plan is not an HR detail. It is one of the most consequential operating decisions a dealership makes.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through the three main approaches — flat rate, hourly, and hybrid — what each one rewards and risks, the legal requirements that shape pay design, the economics of how pay plans connect to labor gross, and how Coleman Prime evaluates technician compensation when we diligence a store.",
      },
      { type: "subheading", text: "Flat Rate: Paying for Hours Produced" },
      {
        type: "paragraph",
        text: "Under a flat-rate plan, a technician is paid a set dollar amount for each hour flagged — the standard labor time assigned to the job — rather than for each hour on the clock. If a brake job is rated at 1.5 hours and the technician completes it in 1.0 hour, they are paid for 1.5. If it takes 2.5 hours, they are still paid for 1.5. The technician's earnings depend on how many hours of work they complete, not how long they are in the building.",
      },
      {
        type: "paragraph",
        text: "Flat rate has been the dominant model in dealership service for decades, and the logic is straightforward. It aligns technician pay with what the dealership sells. A fast, skilled technician can flag far more hours than they clock and earn substantially more than a slower peer. The dealership's labor cost tracks closely with its labor sales, which protects margin when work is slow. For example, a technician paid $32 per flagged hour who flags 50 hours in a 40-hour week earns $1,600; the store has billed those 50 hours at its effective rate and its technician cost as a share of labor sales stays roughly constant.",
      },
      {
        type: "paragraph",
        text: "The weaknesses are equally well known. Flat rate shifts the risk of slow periods onto the technician: when car count drops or parts are back-ordered, a flat-rate technician sits waiting and earns little. It can create tension over job dispatch, since some repair types pay well relative to the time they take and others — certain diagnostic and electrical work in particular — often take longer than the labor guide allows. It can also discourage technicians from taking on difficult warranty work or training time, and in the worst cases it rewards speed over quality, which shows up later as comebacks.",
      },
      { type: "subheading", text: "Hourly: Paying for Time" },
      {
        type: "paragraph",
        text: "Under an hourly plan, the technician is paid for each hour on the clock regardless of how many hours they flag. Pay is predictable, which matters to younger technicians building a career and to experienced technicians tired of income volatility. Hourly plans make it easier to assign diagnostic work, training, and complex warranty repairs without dispatch disputes, and they can support a more team-oriented shop culture.",
      },
      {
        type: "paragraph",
        text: "The risk moves to the dealership. If technician efficiency slips, labor cost rises as a share of labor sales and margin erodes. A pure hourly plan offers no direct financial incentive for productivity, so management has to supply that incentive through supervision, dispatch, and performance standards. Hourly plans work best in shops with strong workflow management — where the bottleneck is not technician effort but the flow of work to the bays.",
      },
      {
        type: "callout-numbers",
        title: "An Illustrative Comparison: One Technician, One Week",
        lines: [
          "For example: technician clocks 40 hours and flags 46 hours of work",
          "Flat rate at $32 per flagged hour → $1,472 pay",
          "Hourly at $34 per clocked hour → $1,360 pay",
          "Hybrid: $24 base per clocked hour plus $10 per flagged hour above 36 → $960 + $100 = $1,060 base-and-bonus, before any efficiency tiers",
          "Each plan pays differently for the same week — what matters is the behavior it rewards and the labor cost it produces as a share of labor sales",
        ],
        link: {
          text: "See how Coleman Prime approaches talent across its dealerships",
          href: "/story",
        },
      },
      { type: "subheading", text: "Hybrid Plans: Trying to Get the Best of Both" },
      {
        type: "paragraph",
        text: "Hybrid plans combine a guaranteed base with a productivity component. The structures vary widely. Some pay an hourly base plus a bonus for flagged hours above a weekly threshold. Some guarantee a minimum number of flagged hours per week, so a technician on flat rate is protected during slow periods. Others pay flat rate with tiered rates — the per-hour rate steps up as the technician's weekly efficiency rises past defined levels. Many also layer in bonuses for factory certification, low comeback rates, or customer satisfaction scores.",
      },
      {
        type: "paragraph",
        text: "The appeal of a hybrid is that it shares risk. The technician gets stability; the dealership keeps a productivity incentive. The challenge is complexity. A hybrid plan with too many moving parts becomes hard for technicians to understand and hard for payroll to administer correctly — and a plan the technician cannot easily calculate is a plan they will not trust. The best hybrid plans we have seen are simple enough to explain on a single page and reward a small number of clearly measurable outcomes.",
      },
      { type: "subheading", text: "The Legal Framework Behind Pay Design" },
      {
        type: "paragraph",
        text: "Pay plan design is constrained by wage-and-hour law. Under the federal Fair Labor Standards Act, flat-rate and other incentive-based technicians must still receive at least the minimum wage for all hours worked in a workweek, which means the dealership must track clocked time and make up any shortfall. The FLSA also contains an overtime exemption, in Section 13(b)(10)(A), for salespeople, partsmen, and mechanics primarily engaged in selling or servicing automobiles at a qualifying dealership — the provision the U.S. Supreme Court interpreted in its 2018 Encino Motorcars v. Navarro decision as applying to service advisors.",
      },
      {
        type: "paragraph",
        text: "State law can be considerably stricter. California, for example, requires piece-rate workers — which includes flat-rate technicians — to be separately compensated for rest and recovery periods and other nonproductive time, and to have those amounts itemized on wage statements. Other states have their own minimum wage, overtime, and wage-statement rules. For a multi-state dealership group, the practical lesson is that a pay plan that works in one state may need to be modified in another, and that time-tracking and payroll records are a real diligence item, not a formality. This is general education, not legal advice; dealers should rely on employment counsel for the rules that apply to their specific stores.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/FrontofNissanElgin.jpg",
        alt: "Front of Nissan of Elgin in Illinois",
        caption:
          "Front of Nissan of Elgin, a Coleman Automotive dealership in Illinois. Each state where a group operates brings its own wage-and-hour rules that shape how technicians can be paid. Photo: Sweet Dreams US LLC",
        orientation: "wide",
      },
      { type: "subheading", text: "How Pay Plans Connect to Service Profit" },
      {
        type: "paragraph",
        text: "The economic link between technician pay and service profitability runs through a single ratio: technician labor cost as a share of labor sales. For example, if a store's customer-pay effective labor rate is $138 and a flat-rate technician earns $32 per flagged hour, the direct technician cost on that hour is about 23% of the labor sale, leaving roughly 77% as labor gross before other service department costs. Industry benchmarks commonly cite service labor gross margins in the 70–75% range, consistent with this math.",
      },
      {
        type: "paragraph",
        text: "On hourly plans, the ratio depends on efficiency. If the same technician is paid $34 per clocked hour and flags 1.15 hours for every hour worked, the cost per flagged hour is about $29.60 — lower than the flat-rate example. If efficiency falls to 0.85, the cost per flagged hour rises to $40 and labor gross margin compresses. This is the central tradeoff: flat rate makes labor cost predictable as a share of sales, while hourly makes it predictable as a share of payroll. Hybrid plans sit somewhere in between, which is why the right answer depends on the shop. Pay plans also affect the hours side of the equation from the previous chapter. A plan that leaves technicians idle when work is slow encourages them to leave for a competitor or an independent shop. A plan that rewards speed without regard to quality drives comebacks, which consume unpaid hours and pull down effective labor rate. A plan that makes diagnostic work unattractive leaves the hardest jobs sitting in the lot. Every one of these outcomes shows up on the service department's statement.",
      },
      { type: "subheading", text: "Retention: The Number Behind the Numbers" },
      {
        type: "paragraph",
        text: "The most expensive technician is the one who leaves. A departing experienced technician takes capacity, factory certifications, customer relationships, and sometimes other technicians with them. Replacing that capacity can mean recruiting costs, sign-on incentives, tool allowances, months of reduced productivity while a new hire learns the shop, and lost hours that never get sold. Technicians typically own their own tools — often a substantial personal investment — so the decision to move is not taken lightly, which makes a well-regarded shop sticky in both directions.",
      },
      {
        type: "paragraph",
        text: "That is why we view pay plan design and retention as a single question. Pay matters, but so do the things around it: a fair and transparent dispatch system, a clean and well-equipped shop, a clear path to factory certification and master-technician status, apprenticeship and mentoring for newer technicians, and a service manager who keeps work flowing to the bays. We will go deeper into technician recruiting and the talent pipeline in a later chapter in Module 6.",
      },
      { type: "subheading", text: "What We Look For in Diligence" },
      {
        type: "paragraph",
        text: "When Coleman Prime evaluates a dealership, we review the current technician pay plans in writing, compare them to what each technician has actually been paid, and check that time records and wage statements support compliance with federal and state requirements. We look at technician tenure and turnover over several years, efficiency and productivity by technician, comeback rates, and the mix of certification levels across the shop. We also ask a simple question that often reveals a great deal: can the technicians explain how they are paid?",
      },
      {
        type: "paragraph",
        text: "We do not assume that one pay model is right for every store. A high-volume shop with strong workflow and experienced technicians may perform best on flat rate with tiered incentives. A smaller rural store building its bench with younger technicians may benefit from more base-pay stability. The goal is a plan that is legally sound, simple to understand, fair to the technician, and aligned with the labor gross the department needs to produce — and then the management discipline to keep work flowing so the plan works as designed.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime reviews technician pay plans, payroll records, tenure, and efficiency data as part of operational and compliance diligence on every acquisition.",
          "Pay plan changes after acquisition are made deliberately, with attention to retention risk, state wage-and-hour requirements, and the labor gross the department needs to sustain.",
          "Our operating philosophy is talent first: recruiting, certification, and keeping experienced technicians are treated as core fixed-operations priorities across Coleman Automotive Group.",
        ],
        link: {
          text: "Learn how Coleman Prime approaches dealership operations",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: ["effective-labor-rate-vs-posted-labor-rate", "talent-first"],
  },

  {
    slug: "effective-labor-rate-vs-posted-labor-rate",
    category: "Operations",
    title:
      "Effective Labor Rate vs. Posted Labor Rate: How Service Profit Is Engineered",
    subtitle:
      "The labor rate on the service menu board is a starting point, not a result. What a service department actually earns per hour sold — its effective labor rate — is shaped by pay mix, discounting, pricing structure, and the discipline of the people writing the repair orders.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "August 5, 2026",
    readTime: "11 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/ServiceDepartment.jpg",
      alt: "Service department at Nissan of Elgin",
      caption:
        "Service department at Nissan of Elgin, a Coleman Automotive dealership in Illinois. The posted labor rate is set in the office; the effective labor rate is earned here, one repair order at a time. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Investors who look at a service department usually see the posted labor rate and assume that is what the store earns per hour. It rarely is. This chapter explains the gap between posted and effective labor rate, where it comes from, and how disciplined operators narrow it.",
    content: [
      {
        type: "paragraph",
        text: "Earlier in this series we covered why fixed operations matter so much to the dealership investment thesis: the service and parts departments generate a large share of gross profit on a small share of revenue, and they are the reason a well-run store can cover its overhead even in a weak sales year. Those chapters explained why the service department matters. This module goes inside it to explain how service profit is actually produced — and the first number to understand is the labor rate.",
      },
      {
        type: "paragraph",
        text: "Every franchised service department has a posted labor rate. It is the hourly rate printed on the menu board or quoted on the phone, and it is the rate most outsiders assume the store earns. In practice, very few service departments realize their full posted rate across all the work they perform. The number that matters is the effective labor rate: total labor dollars actually billed, divided by total labor hours actually sold. The gap between the two — sometimes small, sometimes surprisingly large — is one of the most revealing diagnostics in a dealership's financial statement.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through how the effective labor rate is calculated, the five forces that pull it below the posted rate, the related productivity metrics that determine how many hours a shop can sell in the first place, and how Coleman Prime uses these numbers to separate a service department's true earning power from its menu board.",
      },
      { type: "subheading", text: "Two Rates, One Department" },
      {
        type: "paragraph",
        text: "The posted labor rate is a pricing decision. Management sets it based on local competition, brand positioning, cost structure, and — importantly — what the store expects to be reimbursed for warranty work, which we will discuss below. It is the rate a customer would pay for one hour of labor on a straightforward customer-pay repair with no discounts. The effective labor rate, often abbreviated ELR, is an outcome. It is calculated by taking total labor sales over a period and dividing by total hours sold — the hours billed on repair orders, regardless of how long the technician actually took. For example, if a department billed $210,000 of labor in a month and sold 1,750 hours, its overall effective labor rate is $120 per hour. If its posted rate is $150, it is realizing about 80% of its posted rate across all work.",
      },
      {
        type: "paragraph",
        text: "That 80% figure is not inherently good or bad. It depends entirely on what is pulling the number down — and that is why experienced operators never look at the overall ELR alone. They break it out by pay type: customer-pay, warranty, internal, and in some cases fleet or service contract. Each pay type has its own rate dynamics, and a single blended number hides more than it reveals.",
      },
      {
        type: "callout-numbers",
        title: "An Illustrative ELR by Pay Type",
        lines: [
          "Posted customer-pay rate: $150 per hour (for example)",
          "Customer-pay: 900 hours at $138 effective → $124,200",
          "Warranty: 450 hours at $130 effective → $58,500",
          "Internal (reconditioning, used-car prep): 400 hours at $68 effective → $27,200",
          "Overall: 1,750 hours, $209,900 of labor sales → roughly $120 effective, about 80% of posted",
          "Raising customer-pay ELR by $10 per hour on the same hours adds roughly $9,000 of monthly labor gross",
        ],
        link: {
          text: "See how Coleman Prime evaluates fixed operations during diligence",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "Force One: Pay-Type Mix" },
      {
        type: "paragraph",
        text: "The single largest driver of overall ELR is the mix of work. Internal work — the reconditioning of used vehicles before they go on the lot, accessory installs on new vehicles, and other jobs the dealership bills to itself — is typically charged at a reduced internal rate. That is a deliberate choice. Charging the used-car department full retail for reconditioning would inflate service gross at the expense of used-car gross, and it would make used inventory more expensive to bring to the front line. Most groups set an internal rate that covers technician cost and a reasonable margin, and accept that it pulls the blended ELR down.",
      },
      {
        type: "paragraph",
        text: "A store with a large used-car operation will therefore show a lower overall ELR than a store with little reconditioning, even if both price customer-pay work identically. That is why comparing two stores on blended ELR without looking at mix is misleading — and why, in diligence, we always want the ELR broken out by pay type before drawing any conclusion.",
      },
      { type: "subheading", text: "Force Two: Warranty Reimbursement" },
      {
        type: "paragraph",
        text: "Warranty work is paid by the manufacturer, not the customer, and the manufacturer historically reimbursed dealers at a warranty labor rate that could sit well below the dealer's retail rate. Over time, most states have adopted dealer franchise statutes that require manufacturers to reimburse warranty labor — and in many states, warranty parts — at a rate tied to what the dealer actually charges retail customers, typically calculated from a sample of qualifying customer-pay repair orders under a formula defined in the statute.",
      },
      {
        type: "paragraph",
        text: "The practical result is that a store's warranty labor rate is partly a function of its own customer-pay pricing discipline. A store that discounts customer-pay work heavily drags down the retail-rate calculation that would otherwise support a higher warranty reimbursement. A store that holds its customer-pay rate and documents it properly can often apply for a warranty rate increase under the applicable statute. We will cover warranty administration in detail in Chapter 17; the relevant point here is that customer-pay pricing and warranty reimbursement are linked, and a weak ELR in one tends to show up in the other.",
      },
      { type: "subheading", text: "Force Three: Discounting and Policy Work" },
      {
        type: "paragraph",
        text: "Every service department discounts. Coupons, loyalty programs, first-responder and military discounts, price-matching against independent shops, and advisor-discretionary discounts to close a sale on the drive all reduce the labor dollars billed on an hour sold. Some of this is smart marketing. Much of it is leakage — discounts given out of habit, without approval, on work the customer would have purchased anyway. Policy and goodwill work belong in the same category. When a vehicle is just out of warranty and the customer has a legitimate grievance, the dealer and manufacturer will often share the cost of a repair as goodwill. When a comeback occurs — a repair that did not fix the problem — the store redoes the work at no charge. Each of these hours is real work performed by a technician, but it generates little or no labor revenue. A department with high comeback rates or loose policy approval will see its ELR erode no matter what its posted rate says.",
      },
      { type: "subheading", text: "Force Four: How Work Is Priced" },
      {
        type: "paragraph",
        text: "The fourth force is the pricing structure itself. Most customer-pay work is priced off published labor-time guides, which assign a standard number of hours to each operation. But many departments also sell maintenance and common repairs as fixed-price menu items — an oil change, a brake job, a fluid service at a set price. If those menu prices are not updated when the posted rate changes, or were built off an outdated labor time, the effective rate on menu work quietly drifts below the posted rate.",
      },
      {
        type: "paragraph",
        text: "More sophisticated operators use a labor-rate matrix: different rates for different categories of work, reflecting the skill required, the equipment involved, and what the local market will bear. Diagnostic and electrical work, which requires the most experienced technicians and the most expensive tooling, may carry a higher rate. Light maintenance, which competes directly with quick-lube chains, may carry a lower one. A well-designed matrix can raise overall customer-pay ELR while keeping maintenance pricing competitive — but only if it is designed deliberately and reviewed regularly.",
      },
      { type: "subheading", text: "Force Five: Advisor Discipline on the Repair Order" },
      {
        type: "paragraph",
        text: "The last force is human. The service advisor writes the repair order, presents the recommended work, quotes the price, and decides whether to discount. An advisor who sells a diagnostic hour, documents the technician's findings clearly, and presents additional needed repairs with photos or video will produce a higher ELR and more hours per repair order than one who waives the diagnostic fee to avoid an awkward conversation. The same posted rate produces very different results depending on who is standing at the write-up desk.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasantTruck.webp",
        alt: "Pickup truck at the Mt. Pleasant dealership in Iowa",
        caption:
          "A truck at Mt. Pleasant Chevy GMC CDJR in Iowa, a Coleman Automotive dealership. Truck-heavy markets bring heavier, longer repair work — and pay-type mix that shapes the store's effective labor rate. Photo: Sweet Dreams US LLC",
        orientation: "wide",
      },
      { type: "subheading", text: "Hours Sold: The Other Half of the Equation" },
      {
        type: "paragraph",
        text: "Labor gross is the effective rate multiplied by hours sold, so rate is only half the story. The other half is how many hours the shop can produce. Three related metrics capture this. Productivity measures the share of a technician's paid time actually spent working on vehicles. Efficiency — sometimes called proficiency — measures hours flagged (billed) against hours actually worked; a technician who completes a job rated at 2.0 hours in 1.6 hours is running at 125% efficiency on that job. Overall technician performance combines the two: hours flagged divided by hours available. Hours per repair order is the related customer-facing measure. It reflects how thoroughly vehicles are inspected and how effectively advisors present needed work. A shop averaging 1.4 hours per customer-pay repair order and one averaging 2.0 hours may have the same car count — but the second shop is selling roughly 40% more labor on every vehicle that comes through the door. That difference compounds across thousands of repair orders a year.",
      },
      {
        type: "paragraph",
        text: "Put the two halves together and the levers become clear. A service department can grow labor gross by raising its effective rate, by selling more hours per repair order, by increasing technician productivity and efficiency, or by bringing more vehicles through the drive. Each lever requires a different management action, and each shows up in a different line of the departmental statement. How technicians are paid — the subject of next week's chapter — sits right in the middle of all of them.",
      },
      { type: "subheading", text: "How Coleman Prime Reads the Numbers" },
      {
        type: "paragraph",
        text: "In diligence, we rebuild the service department's ELR from repair-order data by pay type and by labor operation, rather than relying on a single blended figure from the financial statement. We compare customer-pay ELR to the posted rate and look at where the discounts are coming from. We review the store's current warranty reimbursement rate against what its customer-pay history could support under the applicable state statute. We look at hours per repair order, technician efficiency, and comeback rates side by side.",
      },
      {
        type: "paragraph",
        text: "The output is not a promise that labor gross will rise. It is a clear map of where the gap between posted and effective rate comes from, which parts of that gap are deliberate choices, and which are leakage that process and training can address. That map is what lets us underwrite a service department on its true earning power — not on its menu board.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime rebuilds effective labor rate by pay type and labor operation from repair-order data on every acquisition target.",
          "Discounting, policy work, menu pricing, and warranty reimbursement are each reviewed separately, so we can distinguish deliberate pricing choices from leakage.",
          "After acquisition, labor pricing, advisor discount authority, and hours-per-RO targets are managed through the Coleman Automotive Group fixed-operations playbook and reviewed weekly.",
        ],
        link: {
          text: "Learn how Coleman Prime approaches fixed operations",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "technician-pay-plans-flat-rate-hourly-hybrid",
      "fixed-operations-recurring-revenue",
    ],
  },

  {
    slug: "bdc-lead-response-time-conversion",
    category: "Operations",
    title: "The BDC: Why Lead Response Time Is the #1 Conversion Lever",
    subtitle:
      "Every dealership pays to generate leads. Far fewer have the discipline to answer them quickly and well. The business development center is where that discipline lives — and where marketing dollars either turn into appointments or quietly disappear.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "July 29, 2026",
    readTime: "10 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/FrontofStoreNissanWarsaw.webp",
      alt: "Front entrance of Nissan of Warsaw, a Coleman Automotive dealership",
      caption:
        "Front of store at Nissan of Warsaw, a Coleman Automotive dealership. Before most customers walk through this door, they have already been answered — or ignored — by the store's business development center. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "A dealership can spend heavily on digital advertising and still lose the customer in the first hour. The business development center exists to close that gap. This chapter explains how a BDC works, why response speed matters more than almost anything else it does, and the metrics investors should ask to see.",
    content: [
      {
        type: "paragraph",
        text: "Over the past four chapters we followed a vehicle sale from the first conversation on the lot, through the desk, through the trade appraisal, and into the digital retailing tools that now let a customer do much of the work from a phone. There is one piece of the variable-operations machine we have not yet examined, and it sits upstream of all of them: the moment a shopper raises their hand and the dealership has to respond.",
      },
      {
        type: "paragraph",
        text: "That moment is usually a lead — an internet inquiry, a phone call, a chat message, a text, a credit application, a trade-in valuation request. Every one of those leads cost the dealership money to generate, whether through third-party listing sites, OEM lead programs, paid search, or the store's own website. And every one of them has a short shelf life. A shopper who submits an inquiry at 7:40 on a Tuesday evening has often submitted two or three others at competing stores in the same session. The store that answers first, and answers well, usually gets the appointment.",
      },
      {
        type: "paragraph",
        text: "For an investor, this is not a marketing detail. Lead handling is the conversion step that determines whether a dealership's advertising budget produces sold units or simply produces data. This chapter walks through what a business development center actually does, why lead response time is the single most important lever it controls, how a well-run BDC is measured, and how Coleman Prime evaluates lead-handling discipline when we diligence a store.",
      },
      { type: "subheading", text: "What a Business Development Center Actually Is" },
      {
        type: "paragraph",
        text: "A business development center, or BDC, is the team responsible for converting inbound and outbound customer contact into scheduled appointments. In a smaller store it might be two or three people sitting near the sales floor. In a larger store or a multi-rooftop group it can be a dedicated department — sometimes centralized across several locations — with its own manager, scripts, phone system, CRM workflows, and performance targets. The BDC's job is narrow by design. It is not there to negotiate price or desk deals. Its job is to make contact, answer the shopper's immediate question, confirm the vehicle or service need, and set a specific appointment with a specific person at a specific time. Once the customer arrives, the sales or service team takes over. Separating these roles matters because the skills are different: a BDC agent is measured on speed, consistency, and appointment quality, while a salesperson is measured on closing and gross.",
      },
      {
        type: "paragraph",
        text: "Most dealerships run BDC functions on both sides of the building. The sales BDC handles vehicle inquiries, unsold-showroom follow-up, and equity-mining campaigns aimed at existing customers who could trade into a new vehicle at a similar payment. The service BDC handles appointment scheduling, recall outreach, declined-repair follow-up, and maintenance reminders. Both run on the same underlying principle: the dealership pays to create a contact, and the BDC exists to make sure that contact is not wasted.",
      },
      { type: "subheading", text: "Why Speed Matters More Than Almost Anything Else" },
      {
        type: "paragraph",
        text: "The case for fast lead response is well documented across industries. Widely cited research on online sales leads, including a frequently referenced study published in Harvard Business Review, found that companies responding within the first hour were dramatically more likely to qualify a lead than those that waited even a few hours longer — and that many companies took far longer than an hour to respond at all. Dealership-specific lead studies have reached directionally similar conclusions for years: contact rates and appointment rates fall off quickly as response time stretches from minutes to hours.",
      },
      {
        type: "paragraph",
        text: "The reasons are intuitive once you think about how people shop for vehicles today. Cox Automotive's car buyer research has consistently shown that most of a shopper's time is spent online before they ever visit a store, and that shoppers often narrow their list to a small number of dealerships. When a shopper submits an inquiry, they are at peak attention — the vehicle is on the screen, the question is in their head, and they are ready to talk. Ten minutes later they may be on another site. Two hours later they may have already scheduled a test drive somewhere else.",
      },
      {
        type: "paragraph",
        text: "There is also a credibility effect. A store that responds in four minutes with a real answer signals that it is organized and that the customer's time matters. A store that responds the next morning with a generic template signals the opposite — and the customer reasonably wonders what the rest of the experience will be like. The first response is the first test drive of the dealership itself.",
      },
      {
        type: "callout-numbers",
        title: "An Illustrative Lead Funnel",
        lines: [
          "For example: 600 internet and phone leads in a month at a single rooftop",
          "Contact rate of 70% → 420 live conversations",
          "Appointment-set rate of 50% of contacts → 210 appointments",
          "Show rate of 60% → 126 customers on the lot",
          "Close rate of 45% of shows → roughly 57 units sold from leads",
          "Lift contact rate to 80% with faster response and the same funnel yields roughly 65 units — about 8 more sales from the same ad spend",
        ],
        link: {
          text: "See how Coleman Prime approaches operational improvement after acquisition",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "The Funnel Math: Where Leads Leak" },
      {
        type: "paragraph",
        text: "The illustrative funnel above is simple, but it captures the mechanics every BDC manager lives with. A lead becomes a sale only after passing through four gates: contact, appointment, show, and close. Each gate has its own conversion rate, and the rates multiply. That multiplication is why small improvements at the top of the funnel produce outsized changes at the bottom. Response time drives the first gate more than any other variable. A shopper reached within minutes is far more likely to pick up the phone or reply to a text than one reached the next day. But speed alone is not enough. The second gate — turning a conversation into a firm appointment — depends on whether the agent actually answers the question asked. If the shopper wanted to know whether a specific vehicle was still in stock and what the out-the-door price looks like, a reply that ignores the question and pushes for a visit will often lose them.",
      },
      {
        type: "paragraph",
        text: "The third gate, show rate, is where appointment quality is exposed. An appointment set with a vague time and no named contact is not much of an appointment. Well-run BDCs confirm the appointment the day before and the morning of, send the customer the salesperson's name and photo, confirm the vehicle is pulled up and ready, and in some cases have the appraisal or credit work started in advance. Each of those steps reduces no-shows. The fourth gate, close rate, belongs mostly to the sales floor — but a customer who arrives expecting a specific vehicle, a specific person, and a prepared deal closes at a meaningfully higher rate than a customer who walks in cold.",
      },
      { type: "subheading", text: "How a Well-Run BDC Is Measured" },
      {
        type: "paragraph",
        text: "The core BDC scorecard is short and should be reviewed daily. Average response time — measured from lead receipt to first genuine human contact, not to the automated acknowledgment email — is the headline. Contact rate, appointment-set rate, show rate, and sold-from-appointment rate follow. Many stores also track cost per lead and cost per sale by lead source, which tells management which advertising channels are actually producing buyers and which are producing noise. Phone handling deserves its own line. A surprising share of high-intent shoppers still call, and calls are easy to mishandle: long holds, transfers to voicemail, salespeople who answer a price question with a question. Most well-run groups record and score inbound calls, track the percentage of sales calls that result in a set appointment, and monitor missed-call rates by hour of day. The pattern that shows up again and again is that leads arriving in the evening and on weekends — when many shoppers actually have time to look — are the ones most likely to wait the longest for a response.",
      },
      {
        type: "paragraph",
        text: "Finally, the BDC should be measured on follow-up persistence. Most leads do not convert on the first contact. A disciplined follow-up cadence — a defined sequence of calls, texts, emails, and video messages over the first several days, then a longer nurture cadence for shoppers with a longer timeline — is what separates a store that converts its leads from one that simply logs them. The CRM should show this cadence clearly. If a lead's history shows one email and then silence, the problem is process, not the customer.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/LEmars/frontofstore.webp",
        alt: "Front of the Le Mars dealership in Iowa",
        caption:
          "Front of store at the Le Mars dealership in Iowa, a Coleman Automotive location. In smaller markets, a well-run BDC lets a store answer every shopper quickly without adding a large sales staff. Photo: Sweet Dreams US LLC",
        orientation: "wide",
      },
      { type: "subheading", text: "Centralized vs. In-Store BDC" },
      {
        type: "paragraph",
        text: "One of the structural questions every multi-rooftop group has to answer is whether to run the BDC inside each store or centralize it. An in-store BDC knows the inventory, the people, and the local market intimately. Agents can walk out to the lot and confirm a vehicle is there. Hand-offs to the sales floor are face to face. The tradeoff is coverage and consistency: a two-person team cannot answer every lead in minutes during a busy Saturday, and quality varies from store to store depending on who is running it. A centralized BDC solves the coverage problem. A larger team can staff longer hours, absorb volume spikes, standardize scripts and follow-up cadences, and give management a single view of response performance across the group. The tradeoff is distance — agents need real-time inventory visibility and a clean hand-off process, or the customer arrives at a store that does not know they are coming. Many groups end up with a hybrid: a central team handles first response, after-hours coverage, and service scheduling, while each store keeps a small team for local follow-up and appointment confirmation. We will return to the broader centralization question in our later chapter on multi-rooftop management.",
      },
      {
        type: "paragraph",
        text: "Technology now shapes this decision as much as staffing. Automated first-touch responses, text-enabled CRMs, and AI-assisted chat tools can acknowledge a lead in seconds at any hour. Used well, they buy the dealership time and answer simple questions. Used poorly, they produce a wall of canned replies that the customer quickly learns to ignore. The standard we hold is simple: automation can start the conversation, but a knowledgeable human should be in it quickly — and the customer should never have to repeat information they already provided.",
      },
      { type: "subheading", text: "Compliance in the BDC" },
      {
        type: "paragraph",
        text: "Speed cannot come at the expense of compliance. Outbound calling and texting are governed by the Telephone Consumer Protection Act, which restricts autodialed and prerecorded calls and texts to consumers without the appropriate consent, along with the federal Do Not Call rules and a growing number of state-level telemarketing laws. Customer information collected through leads and credit applications falls under the FTC Safeguards Rule we covered in our chapter on dealer licensing and regulation. And any price or payment quoted by a BDC agent is an advertising and disclosure matter, not just a sales conversation.",
      },
      {
        type: "paragraph",
        text: "A well-run BDC builds compliance into its tools and scripts: consent captured and recorded at the point of lead submission, opt-out handling that works immediately, call recording disclosures where required, and pricing language reviewed by management. These are not exotic controls. They are basic hygiene — but in diligence we find that stores with weak response discipline often have weak compliance discipline too, because both come from the same lack of process.",
      },
      { type: "subheading", text: "What Investors Should Ask to See" },
      {
        type: "paragraph",
        text: "When we evaluate a dealership, we ask for at least ninety days of CRM data on lead volume by source, average and median response time, contact and appointment rates, show rate, and sold rate. We look at response time by hour and day of week, because a store that answers quickly at 10 a.m. on a Wednesday but takes fourteen hours to answer a Saturday-night inquiry has a staffing problem the averages will hide. We listen to a sample of recorded calls. And when it is appropriate, we submit test leads of our own to see what a real shopper experiences.",
      },
      {
        type: "paragraph",
        text: "What we are looking for is not perfection. It is the gap between how leads are being handled today and how they could be handled with clear process, appropriate staffing, and daily accountability. Because the funnel multiplies, closing that gap is often one of the faster operational improvements available after an acquisition — it requires no new building, no new franchise, and no change in inventory. It requires the discipline to answer the customer, quickly and well, every time. That discipline closes out our look at variable operations. Next week, Module 3 moves to the other side of the building: the service and parts engine.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime reviews CRM lead-handling data — response time, contact, appointment, show, and sold rates — as part of operational diligence on every acquisition.",
          "Response time is examined by hour and day of week, not just as a monthly average, so after-hours and weekend gaps are visible before we close.",
          "After acquisition, BDC process, staffing, follow-up cadence, and compliance controls are standardized under the Coleman Automotive Group operating playbook and reviewed daily by store leadership.",
        ],
        link: {
          text: "Learn how Coleman Prime approaches dealership operations",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "digital-retailing-online-sales-showroom",
      "modern-dealership-sales-process-road-to-the-sale",
    ],
  },

  {
    slug: "digital-retailing-online-sales-showroom",
    category: "Operations",
    title: "Digital Retailing: How Online Sales Are Reshaping the Showroom",
    subtitle:
      "Customers increasingly want to start — and sometimes finish — a vehicle purchase online. For a franchised dealer, the question is not whether to sell digitally, but how to connect the online and in-store experience into one process.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "July 22, 2026",
    readTime: "10 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Streetsboro/streetsborofrontofstore.webp",
      alt: "Front of the Streetsboro dealership",
      caption:
        "Front of the Streetsboro store in Ohio, a Coleman Automotive dealership. For many customers, the visit to this building is now the last step of a purchase that began online. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Digital retailing lets customers structure a deal online — payments, trade value, credit, and even protection products — before visiting the store. This chapter explains how digital retailing works inside a franchised dealership, how it affects gross and efficiency, and what separates a real omnichannel process from a website plug-in.",
    content: [
      {
        type: "paragraph",
        text: "Over the past several chapters, we walked through the traditional dealership sales process, how front-end gross is built at the desk, and how used vehicles are appraised and sourced. Each of those processes was designed around a customer who sat across a desk from a salesperson. Increasingly, a large part of the work now happens before the customer ever arrives — on a phone, at a kitchen table, at eleven at night.",
      },
      {
        type: "paragraph",
        text: "Digital retailing is the industry's name for the tools and processes that let customers complete steps of a vehicle purchase online. Online-only used-vehicle retailers made the concept famous, and the disruptions of 2020 accelerated adoption across franchised dealerships. Today, nearly every franchised store offers some form of online deal-building. The question for investors is no longer whether a store has digital retailing, but whether it actually works — whether the online deal and the in-store deal are the same deal.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through what digital retailing includes, how customers actually use it, its effects on gross and efficiency, the operational and compliance requirements of doing it well, and what investors should look for in diligence.",
      },
      { type: "subheading", text: "What Digital Retailing Actually Includes" },
      {
        type: "paragraph",
        text: "At its most basic, digital retailing is a set of tools embedded in a dealership's website and vehicle listing pages. A customer selects a vehicle and can then see a real selling price with taxes and fees, calculate payments for cash, finance, and lease options, receive an estimated value for a trade-in, apply for credit, view and select protection products, place a deposit, and schedule a test drive, pickup, or delivery. Platforms from vendors such as CDK's Roadster, Cox Automotive, Upstart, and others provide these tools to franchised dealers, often integrated with the dealer's CRM, DMS, and desking systems.",
      },
      {
        type: "paragraph",
        text: "The depth of the integration is what separates a useful tool from a lead form with a calculator. In a shallow implementation, the customer builds a deal online, the store receives an email, and a salesperson starts over from scratch. In a deep implementation, the customer's selected vehicle, trade information, credit application, payment structure, and product selections flow directly into the store's systems, and the salesperson picks up exactly where the customer left off.",
      },
      {
        type: "paragraph",
        text: "Online-only retailers built their processes digitally from the start. Franchised dealers have had to retrofit digital steps onto systems and pay plans designed for the showroom. That retrofit is harder than it looks, and the quality of the execution varies enormously from store to store. Two dealerships can license the same platform and see very different outcomes, because the software is only as good as the pricing data behind it, the speed of the people who respond to it, and the willingness of the sales desk to honor what the customer built.",
      },
      { type: "subheading", text: "How Customers Actually Use It" },
      {
        type: "paragraph",
        text: "Research from Cox Automotive, J.D. Power, and others has consistently shown that buyers want to complete more of the purchase online — especially the parts they find most time-consuming or least pleasant, such as negotiating price, valuing the trade, and completing paperwork. At the same time, the same research has found that most buyers still want to see and drive the vehicle in person, and only a minority want to complete the entire purchase without visiting a dealership.",
      },
      {
        type: "paragraph",
        text: "In practice, this means most digital retailing customers are omnichannel customers. They may build a deal online, visit the store to drive the vehicle and finalize paperwork, and take delivery at the store or at home. Or they may arrive with a trade estimate and a pre-qualification, buy a different vehicle than the one they built online, and finish everything in person. A store's process has to accommodate every one of these paths without making the customer repeat steps. The most common failure point is the handoff: a customer who has already entered their address, trade details, and credit information online and is then asked to fill out the same paper forms at the desk quickly concludes that the online experience was for show.",
      },
      {
        type: "paragraph",
        text: "For a franchised dealer, this is good news. The physical store remains valuable — for test drives, deliveries, and, crucially, for service. A customer who completes most of the purchase online still needs a place to have the vehicle serviced, and the franchised dealer is the natural home for warranty and recall work. Digital retailing does not replace the rooftop; it changes what happens under it. It also gives the store a richer record of each customer's preferences, which supports follow-up, retention, and future service marketing.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/mtpleasantdrone.png",
        alt: "Aerial view of the Mt. Pleasant dealership campus",
        caption:
          "Aerial view of Mt. Pleasant Chevy GMC CDJR, a Coleman Automotive dealership in Iowa. Even as more of the purchase moves online, the physical campus remains the hub for test drives, delivery, and service. Photo: Sweet Dreams US LLC",
        orientation: "wide",
      },
      { type: "subheading", text: "The Effect on Gross and Efficiency" },
      {
        type: "paragraph",
        text: "A common concern is that showing real prices and payments online compresses front-end gross. There is some truth to it: transparent pricing reduces the room for negotiation, and online shoppers compare prices across stores. But price transparency was already the reality of the market — customers could see competitor listings long before digital retailing tools existed. The more useful question is whether digital retailing changes the total economics of a sale.",
      },
      {
        type: "paragraph",
        text: "Done well, it can. A customer who arrives with a structured deal, a completed credit application, and an appraised trade typically spends less time in the store, and that saved time is capacity: a salesperson and a sales manager can handle more transactions per day. Customers who engage with protection products online, with time to read about them, may be more receptive in the F&I office than customers encountering them for the first time at the end of a long visit. And a faster, more predictable experience tends to support CSI, which, as we have discussed, feeds manufacturer incentive eligibility.",
      },
      {
        type: "callout-numbers",
        title: "Illustrative Example: Time Saved Is Capacity Gained",
        lines: [
          "Traditional in-store transaction: an illustrative 3 to 4 hours from arrival to delivery",
          "Digitally prepared transaction: an illustrative 1 to 1.5 hours, with pricing, trade, and credit already structured",
          "A sales team handling 120 deliveries a month saves, in this example, roughly 250 or more staff hours monthly",
          "That capacity can be redeployed to follow-up, appointment setting, and additional customers without adding headcount",
          "Figures are hypothetical; actual results depend on the store, its systems, and its process",
        ],
      },
      { type: "subheading", text: "Making the Online Deal and the In-Store Deal the Same Deal" },
      {
        type: "paragraph",
        text: "The single most important requirement of digital retailing is consistency. If the price, trade value, or payment the customer saw online is different from what the store presents in person, the customer's trust is lost and the deal often goes with it. Consistency requires that online pricing pulls from the same source as the store's desking system, that trade estimates are clearly labeled as estimates subject to inspection, and that taxes, fees, and rebate eligibility are calculated accurately.",
      },
      {
        type: "paragraph",
        text: "It also requires the right people and pay plans. A salesperson paid entirely on front-end gross may resist honoring an online price or may restart the negotiation. Many stores that have succeeded with digital retailing have adjusted pay plans to reward units, customer experience, and process adherence rather than gross alone, and have designated staff — sometimes in the business development center, which we cover in the next chapter — to manage online deals from first contact to appointment.",
      },
      {
        type: "paragraph",
        text: "Compliance belongs in the same conversation. Online prices are advertisements, and the Federal Trade Commission's authority over unfair and deceptive practices under Section 5 of the FTC Act, together with state consumer protection and advertising laws, applies to them just as it applies to newspaper ads. Online credit applications collect sensitive customer financial information that must be protected under the FTC Safeguards Rule, which we discussed in our chapter on dealer licensing and the regulatory maze. Electronic contracting and e-signatures must satisfy applicable federal and state requirements. A digital process that is convenient but not compliant creates risk rather than value.",
      },
      { type: "subheading", text: "Home Delivery, Remote Paperwork, and the Limits of Digital" },
      {
        type: "paragraph",
        text: "Some franchised dealers now offer home delivery, remote signing, and in some cases home test drives. These options can widen a store's effective market and appeal to customers who value convenience. They also carry costs: staff time, transportation, and the operational complexity of completing paperwork and delivery outside the store. Rules on remote sales, titling, and delivery vary by state, and dealers must follow the requirements of each state in which they sell.",
      },
      {
        type: "paragraph",
        text: "There are also natural limits. Franchise agreements, state dealer laws, and manufacturer programs shape how and where franchised dealers can sell, and some brands have experimented with different retail models. Used-vehicle digital retail has its own challenges, because condition, reconditioning, and history vary from unit to unit and must be represented accurately online. Digital retailing is a powerful set of tools, not a replacement for the operating disciplines covered in the rest of this module.",
      },
      { type: "subheading", text: "What Investors Should Look For" },
      {
        type: "paragraph",
        text: "When we evaluate a store's digital retailing, we start with the customer path. We build a deal online and see what happens: how quickly the store responds, whether the information carries through to the CRM, and whether the in-store proposal matches. We review the share of sales that began with an online deal, the conversion rate from online deal starts to appointments to sales, the in-store time for digital versus traditional customers, and the gross and CSI outcomes for each. Comparing those outcomes side by side shows whether the online channel is adding customers and efficiency or simply relabeling customers the store would have sold anyway.",
      },
      {
        type: "paragraph",
        text: "We also look at integration and accountability. Which systems are connected, and where does data get re-keyed? Who owns online deals inside the store, and how are they paid? How quickly does a customer who submits a deal online hear from a real person, and does that person have the authority to confirm the numbers? A store that has bought the right software but not changed its process will show it in the data — high online engagement, low conversion, and customers who start over when they arrive. A store that has aligned tools, people, and pay plans will show the opposite.",
      },
      {
        type: "paragraph",
        text: "Digital retailing is not the end of the showroom. It is a reorganization of the showroom around the way customers now prefer to buy. The franchised dealers best positioned for the next decade are those that treat online and in-store as one continuous process — and that keep the service relationship at the center of it.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime evaluates digital retailing by testing the customer path end to end, not by checking whether a vendor tool is installed.",
          "In diligence we measure online-to-sale conversion, data flow between systems, pricing consistency, and the compliance of online advertising and data handling.",
          "After acquisition, Coleman Automotive Group aligns digital tools, CRM workflow, and pay plans so the online deal and the in-store deal are the same deal.",
        ],
        link: {
          text: "Learn how Coleman Prime approaches operations after acquisition",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "bdc-lead-response-time-conversion",
      "modern-dealership-sales-process-road-to-the-sale",
    ],
  },

  {
    slug: "trade-in-appraisal-wholesale-market-vauto-manheim",
    category: "Operations",
    title:
      "Trade-In Appraisal and the Wholesale Market: vAuto, Black Book, and Manheim",
    subtitle:
      "In the used-vehicle business, profit is made when a car is bought, not when it is sold. The appraisal lane and the wholesale market are where that profit is won or lost.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "July 15, 2026",
    readTime: "11 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/GMCTrucksandSign.webp",
      alt: "GMC trucks parked beneath dealership signage at Mt. Pleasant",
      caption:
        "Trucks on the lot at Mt. Pleasant Chevy GMC CDJR, a Coleman Automotive dealership in Iowa. Each used unit on a lot like this started with an appraisal decision. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Used vehicles are a skill business, and the skill starts at the appraisal. This chapter explains how dealers value trade-ins, how tools like vAuto, Black Book, and Manheim market data inform those decisions, and how the wholesale market acts as both a source of inventory and a safety valve.",
    content: [
      {
        type: "paragraph",
        text: "The United States sells far more used vehicles than new ones — industry estimates from Cox Automotive and others put annual used-vehicle sales at roughly two to two-and-a-half times new-vehicle volume. For a franchised dealer, the used-vehicle department is one of the largest sources of gross profit and one of the clearest tests of operating skill. It is also the department most exposed to the price swings of the wholesale market, which is why the discipline behind it matters as much as the gross it produces. Unlike new vehicles, where the manufacturer sets the cost and the internet sets the price, used vehicles give the dealer control over both sides of the trade.",
      },
      {
        type: "paragraph",
        text: "That control cuts both ways. A store that buys used vehicles well, reconditions them efficiently, and prices them to the market can earn healthy gross while turning inventory quickly. A store that overpays at acquisition spends the next sixty days trying to recover a mistake it made on the first day. Experienced used car managers have a saying that captures this: you make your money when you buy the car. Every dollar overpaid at appraisal is a dollar the store must either recover from the next customer, in a market where that customer can see every competing listing, or write off when the unit is eventually wholesaled.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through how a dealership appraises a trade-in, the data tools that inform modern appraisals, how the wholesale market works as both a source of inventory and a disposal channel, and what investors should look for when evaluating a store's used-vehicle operation.",
      },
      { type: "subheading", text: "Why Trade-Ins Are the Best Source of Used Inventory" },
      {
        type: "paragraph",
        text: "Dealers acquire used vehicles from several channels: trade-ins from customers buying another vehicle, vehicles purchased directly from consumers who are not buying, service-lane acquisitions from customers whose vehicles are in for repair, off-lease returns, and purchases at wholesale auctions. Of these, trade-ins have historically been the most attractive. The store acquires the vehicle at or near its wholesale value, with no auction fees or transport costs, and often with a known service history from its own records.",
      },
      {
        type: "paragraph",
        text: "Auction-sourced vehicles, by contrast, are bought in competition with every other dealer bidding on the same unit, with buyer fees and transportation added on top. Auctions are an essential channel for filling specific inventory gaps, but a used department that depends heavily on auction purchases typically starts each unit with a thinner margin than one that sources locally. The difference on a single unit may be modest, but across hundreds of used units a year it compounds into a meaningful gap in departmental gross. That is why many operators track the share of used inventory that is self-sourced — through trades, street purchases, and the service lane — as a core management metric.",
      },
      {
        type: "paragraph",
        text: "The appraisal also shapes the new-vehicle deal. As we showed in our chapter on desking the deal, the trade allowance presented to the customer and the value at which the trade is booked into inventory are two different numbers, and the gap between them flows directly into front-end gross. An accurate appraisal protects both the used department and the new-vehicle deal it supports.",
      },
      { type: "subheading", text: "How an Appraisal Is Built" },
      {
        type: "paragraph",
        text: "A professional appraisal begins with the vehicle itself: VIN decode to confirm year, make, model, trim, and factory options; a walkaround to assess body condition, paint, glass, and tires; an interior inspection; a test drive; and a review of vehicle history reports for prior accidents, title brands, and ownership history. The appraiser estimates the reconditioning the vehicle will need to be retail-ready — mechanical repairs, tires, brakes, cosmetic work, and detail.",
      },
      {
        type: "paragraph",
        text: "Modern appraisals then work backward from the market. Rather than asking what a guidebook says the car is worth, the appraiser asks what the vehicle is likely to retail for in the store's market, how quickly it is likely to sell, and what the store needs to earn on it. Subtracting the target gross, reconditioning, and any pack from the expected retail price produces the maximum the store can pay — the actual cash value, or ACV, the store is willing to book.",
      },
      {
        type: "callout-numbers",
        title: "Illustrative Example: Working an Appraisal Backward from Retail",
        lines: [
          "Expected retail price based on comparable market listings: $30,000",
          "Less target front-end gross: $2,500",
          "Less estimated reconditioning: $1,800 — less internal pack: $500",
          "Maximum actual cash value the store can book: $25,200",
          "If the comparable wholesale value is well below $25,200, the store has room; if it is above, the unit may be a wholesale candidate rather than a retail one",
          "All figures are hypothetical and for explanation only",
        ],
      },
      { type: "subheading", text: "The Data Behind the Number: vAuto, Black Book, and Market Guides" },
      {
        type: "paragraph",
        text: "Used-vehicle pricing has been transformed over the past two decades by inventory management software that pulls live market data. vAuto, part of Cox Automotive, is one of the most widely used of these platforms. Its core idea is that used vehicles should be appraised and priced against the live market: how many comparable vehicles are currently listed within a given radius, at what prices, and how quickly similar units have been selling. Metrics such as price-to-market and market days supply let a manager see, unit by unit, whether a vehicle is priced competitively and whether demand for it is strong or soft.",
      },
      {
        type: "paragraph",
        text: "Valuation guides provide a second reference point. Black Book, long known for wholesale values updated frequently to reflect auction results, is widely used by dealers and lenders. Kelley Blue Book, J.D. Power valuation guides (formerly NADA Guides), and other services publish wholesale, trade-in, and retail values used by dealers, lenders, and consumers. Lenders often reference these guides when determining how much they will advance against a vehicle, which links the appraisal to what the store can ultimately finance. For an investor, the important point is that these tools are widely available to every dealer in a market. The advantage does not come from having the software; it comes from using it consistently, on every unit, with managers who review the results.",
      },
      {
        type: "paragraph",
        text: "No single source is the answer. A disciplined appraiser triangulates: guide values for a baseline, recent auction transactions for what dealers are actually paying, live retail listings for what the vehicle can sell for locally, and the store's own sales history for how that type of vehicle performs on its lot. Where those sources disagree — a guide value well above recent auction results, for example — the appraiser should lean toward the evidence of actual transactions, because that is what the store will face if the vehicle has to be wholesaled later. The tools make the appraiser faster and more consistent; they do not replace judgment about condition, reconditioning, and local demand.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/ChargerOutFront.webp",
        alt: "Vehicle displayed in front of the Mt. Pleasant dealership",
        caption:
          "Vehicle on display at Mt. Pleasant Chevy GMC CDJR, a Coleman Automotive dealership. Retail pricing on used units is set against live market data, not a guidebook alone. Photo: Sweet Dreams US LLC",
        orientation: "wide",
      },
      { type: "subheading", text: "Manheim and the Wholesale Market" },
      {
        type: "paragraph",
        text: "Behind the retail used-vehicle market sits a large wholesale market, where dealers, rental companies, lenders, and fleet operators buy and sell vehicles among themselves. Manheim, also part of Cox Automotive, is the largest operator of physical and digital wholesale auctions in the United States. Digital-first platforms such as ACV Auctions and OPENLANE have grown alongside it, allowing dealers to buy and sell vehicles remotely with condition reports, photos, and arbitration policies.",
      },
      {
        type: "paragraph",
        text: "Manheim also publishes the Manheim Used Vehicle Value Index, a widely followed measure of wholesale used-vehicle prices adjusted for mix, mileage, and seasonality. Investors and analysts watch it as a barometer of the used-vehicle market. The index rose dramatically during the 2021–2022 supply shortage and has moderated since. For an operator, the index is context; for a store, what matters is the wholesale value of the specific units on its lot and in its appraisal lane.",
      },
      {
        type: "paragraph",
        text: "The wholesale market plays two roles for a franchised dealer. First, it is a source of inventory when trades and local purchases do not supply the vehicles the store needs. Second, it is the safety valve for vehicles the store should not retail — units that are too old, too high-mileage, the wrong segment for the market, or simply aged beyond the store's turn policy. As we covered in our chapter on days supply and aged inventory, a unit that has sat too long is often worth more to the store as wholesale cash than as a retail hope.",
      },
      { type: "subheading", text: "Wholesale Discipline: Knowing When to Let Go" },
      {
        type: "paragraph",
        text: "Many well-run stores set an explicit aging policy: a used vehicle that has not sold within a defined window — often somewhere between 45 and 60 days, depending on the store and the market — is wholesaled rather than repriced again. The logic is the same as cutting a losing position. Every additional day costs depreciation and floor plan interest, and the capital tied up in an aged unit could be redeployed into a fresher vehicle with better demand.",
      },
      {
        type: "paragraph",
        text: "Wholesale results are therefore a revealing diagnostic. A store that consistently loses money when it wholesales aged units is often overpaying at appraisal, over-spending on reconditioning, or holding units too long. A store that wholesales trades it chose not to retail at roughly break-even is appraising accurately. Wholesale losses are not inherently bad — some are the price of a disciplined turn policy — but their size and pattern tell you a great deal about the front end of the process.",
      },
      {
        type: "paragraph",
        text: "Reconditioning speed belongs in the same conversation. A vehicle that waits two weeks for inspection, parts, and detail before it is listed is two weeks older on day one of its retail life. Many operators track time-to-line — the days between acquisition and the unit being retail-ready and online — because every day saved there is a day of depreciation and interest the store does not pay.",
      },
      { type: "subheading", text: "What Investors Should Look For" },
      {
        type: "paragraph",
        text: "When we evaluate a store's used-vehicle operation, we look at the sources of its inventory, the share that is self-sourced, average reconditioning cost and time-to-line, used-vehicle gross per unit after normalizing packs, the age profile of current inventory, and the store's wholesale gains and losses over time. We compare appraisal values to subsequent retail or wholesale outcomes to see whether the appraisal process is calibrated.",
      },
      {
        type: "paragraph",
        text: "We also look at people and process. Who appraises vehicles, and are values reviewed by a manager? Are appraisal photos and notes documented in the system? Does the store actively acquire vehicles from its service customers? A used department built on a few individuals' instincts can perform well, but it is harder to scale and more exposed to turnover than one built on documented process and shared tools.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime treats the used-vehicle department as a skill business and evaluates it from acquisition forward, not from the sale backward.",
          "In diligence we test appraisal calibration, self-sourcing, reconditioning time and cost, aging discipline, and wholesale results.",
          "After acquisition, Coleman Automotive Group applies consistent market-based appraisal and pricing practices, a defined aging policy, and service-lane acquisition across rooftops.",
        ],
        link: {
          text: "Learn how Coleman Prime evaluates acquisitions",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "days-supply-turn-rate-aged-inventory-math",
      "desking-the-deal-front-end-gross-profit",
    ],
  },

  {
    slug: "desking-the-deal-front-end-gross-profit",
    category: "Operations",
    title: "Desking the Deal: How Front-End Gross Profit Is Built",
    subtitle:
      "Front-end gross is the number every sales manager watches and every investor should understand. It is built — and lost — in a handful of decisions made at the sales desk.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "July 8, 2026",
    readTime: "11 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawSticker.webp",
      alt: "Window sticker on a new vehicle at Nissan of Warsaw",
      caption:
        "Window sticker on a new vehicle at Nissan of Warsaw, a Coleman Automotive dealership. The sticker is where the conversation starts — the desk is where front-end gross is actually decided. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Desking is the process of structuring a vehicle deal — price, trade, down payment, and payment — into a proposal the customer will accept and the store can live with. This chapter explains how front-end gross is calculated, where it leaks, and what an investor should look for in a store's deal log.",
    content: [
      {
        type: "paragraph",
        text: "In our last chapter, we walked through the road to the sale — the sequence of steps that moves a customer from the first greeting to delivery. At one point in that sequence, the conversation moves from the vehicle to the numbers. In most dealerships, the numbers are structured by a sales manager at the \"desk,\" and the practice of building and presenting those numbers is called desking the deal.",
      },
      {
        type: "paragraph",
        text: "Desking matters to an investor because it is where front-end gross profit is made or lost. Two stores can sell the same number of the same vehicles from the same inventory and post very different results, simply because one desks deals with discipline and the other does not. Front-end gross is also the number most exposed to competitive pressure, market conditions, and manager judgment, which makes it the most volatile line in variable operations and the one that most rewards careful underwriting.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through how front-end gross is defined and calculated, how a desk manager structures a proposal, the main ways gross leaks out of a deal, and the deal-log patterns we review in diligence.",
      },
      { type: "subheading", text: "What Front-End Gross Actually Measures" },
      {
        type: "paragraph",
        text: "Dealership profit on a vehicle sale is split into two buckets. Front-end gross is the profit on the vehicle itself — the selling price minus the vehicle's cost in inventory, adjusted for the trade-in. Back-end gross is the profit generated in F&I: finance reserve from the lender and income from protection products. The two are tracked separately because they are produced by different people, paid under different commission plans, and influenced by different decisions.",
      },
      {
        type: "paragraph",
        text: "On a new vehicle, the inventory cost is the dealer's invoice, adjusted for any dealer-installed accessories. As we covered in our chapter on OEM allocation, holdback, and stair-step bonuses, manufacturer payments are typically booked separately rather than in the front-end gross of each deal, which is why new-vehicle front-end gross can look thin — and sometimes negative — on deals that are profitable once the full program stack is counted.",
      },
      {
        type: "paragraph",
        text: "On a used vehicle, the inventory cost is the acquisition cost plus reconditioning, plus in many stores an internal charge called a \"pack.\" A pack is a fixed amount added to the cost of each used vehicle to cover overhead such as lot maintenance or detail labor. It reduces the reported gross on which salespeople are paid, and it is one of the first things we normalize when comparing used-vehicle gross across stores — a $2,000 gross at a store with a $500 pack and a $2,000 gross at a store with no pack are not the same number.",
      },
      {
        type: "callout-numbers",
        title: "Illustrative Example: Building Front-End Gross on a Used Vehicle",
        lines: [
          "Acquisition cost (trade-in actual cash value): $22,000",
          "Reconditioning: $1,500 — internal pack: $500 — inventory cost: $24,000",
          "Advertised price: $27,995 — agreed selling price: $27,000",
          "Reported front-end gross: $27,000 − $24,000 = $3,000",
          "Salesperson commission at an illustrative 25% of front gross: $750",
          "All figures are hypothetical and for explanation only",
        ],
      },
      { type: "subheading", text: "The Four Levers on the Desk" },
      {
        type: "paragraph",
        text: "The traditional desking tool is the four-square worksheet: a sheet divided into four boxes for selling price, trade-in value, down payment, and monthly payment. The four-square is a blunt instrument and has drawn criticism for the way it can be used to shift a customer's attention between boxes. But it captures a real truth about the structure of a vehicle deal: those four numbers are linked, and changing one changes the others. Most customers negotiate on one or two of the four. Some focus on price, having researched it online. Some focus on the trade, because they have a number in mind from an online estimate. Many care most about the monthly payment, because that is what fits their budget. A skilled desk manager listens for which lever matters to the customer and builds a proposal that satisfies it while protecting gross on the others.",
      },
      {
        type: "paragraph",
        text: "In modern stores, desking software integrated with the CRM and DMS has largely replaced the paper four-square. The software pulls in rebates, lender programs, taxes and fees, and trade values, and lets a manager build several payment options at once — for example, three terms and two down payment amounts on a single screen. Presented transparently, this gives the customer real choices. The underlying economics have not changed: the selling price, the trade allowance, and the vehicle's cost determine front-end gross.",
      },
      { type: "subheading", text: "Where Front-End Gross Leaks" },
      {
        type: "paragraph",
        text: "The most obvious leak is discounting. Every dollar below the advertised price is a dollar of front-end gross. In a competitive market some discounting is inevitable, and a store that never discounts may be overpricing and slowing its turn. The question is whether discounting is deliberate — tied to aging, market position, or a specific program — or simply the default response to any objection.",
      },
      {
        type: "paragraph",
        text: "The less visible leak is the trade. Suppose a customer's trade has an actual cash value — the amount the store could realistically get for it at wholesale — of $15,000. If the desk shows the customer $16,500 to close the deal, the extra $1,500 is an \"over-allowance.\" The used vehicle department books the trade at its $15,000 value, and the $1,500 difference comes straight out of the front-end gross on the vehicle being sold. A new-vehicle deal that looks like a $1,500 gross deal at the desk may be a break-even deal once the trade is booked correctly.",
      },
      {
        type: "paragraph",
        text: "Negative equity creates a related pressure. If the same customer owes $18,000 on a trade worth $15,000, the $3,000 shortfall must be paid in cash or rolled into the new loan. Rolling it in raises the amount financed and the payment, which in turn pressures the desk to discount the vehicle to keep the payment where the customer wants it. In the deal log, heavy negative-equity deals often show up as thin front-end gross paired with longer loan terms. Lenders also limit how much they will advance relative to a vehicle's value, so heavy negative equity can constrain both gross and approval. Stores that handle negative equity with discipline — and with full, clear disclosure to the customer — protect both margin and compliance.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasentVetterInterrior.webp",
        alt: "Interior of the Mt. Pleasant dealership showroom",
        caption:
          "Showroom interior at Mt. Pleasant Chevy GMC CDJR, a Coleman Automotive dealership in Iowa. The desk is where price, trade, and payment are reconciled into a single proposal. Photo: Sweet Dreams US LLC",
        orientation: "wide",
      },
      { type: "subheading", text: "New Versus Used: Two Different Gross Games" },
      {
        type: "paragraph",
        text: "New-vehicle front-end gross is constrained by transparency. Invoice pricing is widely available online, identical vehicles sit on competitors' lots, and the spread between invoice and MSRP is limited. Front-end gross on new vehicles moves substantially with market supply: it rose sharply during the inventory shortages of 2021 and 2022 and has compressed as supply recovered. A store's new-vehicle profitability depends heavily on the manufacturer payments we covered in Module 1, which is why we evaluate new-vehicle performance on a total-gross basis rather than front-end alone.",
      },
      {
        type: "paragraph",
        text: "Used-vehicle gross is driven more by the store's own decisions. No two used vehicles are identical, and the store controls the acquisition price, the reconditioning, and the retail price. That makes used vehicles a skill business: buy well, recondition efficiently, price to the market, and turn quickly. Used-vehicle front-end gross is earned largely at the moment of acquisition — a theme we develop in the next chapter on trade-in appraisal and the wholesale market.",
      },
      {
        type: "paragraph",
        text: "There is also a tension between gross and turn. As we showed in our chapter on days supply and aged inventory, a used vehicle loses value every day it sits, and floor plan interest accrues while it waits. A desk that holds out for an extra $500 of gross on a 75-day-old unit may cost the store more in depreciation and carry than it gains. The best desks know the age and market position of every unit and adjust their negotiating posture accordingly.",
      },
      { type: "subheading", text: "Transparency, Compliance, and the Modern Desk" },
      {
        type: "paragraph",
        text: "Desking practices sit squarely within the regulatory perimeter we described in our chapter on dealer licensing and the regulatory maze. The Federal Trade Commission's authority over unfair and deceptive practices under Section 5 of the FTC Act, state consumer protection laws, and state advertising rules all govern how prices, fees, add-ons, and payments are presented. The FTC's Combating Auto Retail Scams (CARS) Rule, finalized in 2023, would have added specific federal requirements on pricing and add-on disclosure; it was vacated by the Fifth Circuit in January 2025, but the underlying expectations around honest pricing remain enforceable under existing law, and several states have pursued their own measures.",
      },
      {
        type: "paragraph",
        text: "For an investor, the practical lesson is that gross built on confusion is fragile. Payment packing, undisclosed add-ons, and advertised prices that are not honored create regulatory, litigation, and reputational exposure that can dwarf the incremental gross. A desk that presents a clear, itemized proposal — price, fees, trade, and payment options — tends to produce slightly more predictable gross, fewer unwound deals, and better CSI.",
      },
      { type: "subheading", text: "What We Look for in the Deal Log" },
      {
        type: "paragraph",
        text: "Every sold deal in a dealership is recorded in the DMS, and the resulting deal log is one of the most informative documents in diligence. We look at front-end gross per unit by new and used, by salesperson, by manager, by vehicle age at sale, and by week of the month. Gross that collapses in the last few days of every month suggests the store is buying volume to hit manufacturer targets. Wide gross dispersion between managers suggests inconsistent desking. A large share of mini deals suggests either aggressive pricing strategy or weak negotiating discipline.",
      },
      {
        type: "paragraph",
        text: "We also reconcile trade allowances in the deal log to the values at which trades were booked into used inventory, which exposes over-allowance. When a store routinely books trades below the allowance shown to the customer, the used department's gross looks healthy while the new-vehicle department quietly absorbs the cost — a pattern that can make one department's manager look better than the store's economics justify. We compare the store's packs, reconditioning charges, and commission plans to normalize gross across stores. And we review unwinds and contracts in transit, because a deal that is booked but never funds is not gross at all.",
      },
      {
        type: "paragraph",
        text: "Front-end gross will never be the most stable line on a dealership income statement — it is too exposed to market cycles and competition for that. But the discipline behind it is stable. A store with a disciplined desk earns more of the available gross in every market, and that consistency is what an investor is really underwriting.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime underwrites variable operations on total gross per unit — front-end, back-end, and manufacturer payments together — rather than on front-end gross alone.",
          "In diligence we normalize packs, reconcile trade allowances to booked values, and analyze gross dispersion by manager and by week of the month.",
          "After acquisition, Coleman Automotive Group implements consistent desking guidelines, transparent itemized proposals, and aging-based pricing discipline across rooftops.",
        ],
        link: {
          text: "See how Coleman Prime evaluates dealership operations",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "trade-in-appraisal-wholesale-market-vauto-manheim",
      "oem-allocation-holdback-stair-step-bonuses",
    ],
  },

  {
    slug: "modern-dealership-sales-process-road-to-the-sale",
    category: "Operations",
    title: "The Modern Road to the Sale: Inside the Dealership Sales Process",
    subtitle:
      "The showroom sales process is the front door to half of a dealership's revenue. Understanding how it actually works — step by step — is how an investor tells a disciplined store from a lucky one.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "July 1, 2026",
    readTime: "10 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawCarsinShowroom.webp",
      alt: "New vehicles on display in the showroom at Nissan of Warsaw",
      caption:
        "Showroom floor at Nissan of Warsaw, a Coleman Automotive dealership. Every vehicle on this floor is waiting on a process, not a personality. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Most people picture the car sale as a negotiation. Operators see it as a sequence — a repeatable set of steps with measurable conversion at each one. This chapter opens Module 2 by walking through the modern road to the sale and the metrics investors should use to judge it.",
    content: [
      {
        type: "paragraph",
        text: "Module 1 of this series built the financial skeleton of a dealership: the seven profit centers, the NADA-style financial statement, floor plan, inventory turn, the OEM relationship, and the regulatory perimeter. Module 2 moves to the front of the house — the variable operations side of the business, where new and used vehicles are actually sold. Variable operations typically produce the majority of a dealership's revenue and a large share of its gross profit, and they are where the day-to-day quality of management shows up first.",
      },
      {
        type: "paragraph",
        text: "From the outside, a car sale looks like a single event: a customer walks in, haggles, and drives out. Inside a well-run store, it is a process with defined steps, defined handoffs, and conversion rates measured at every stage. The difference matters to an investor because a sale that depends on one talented salesperson is a key-person risk, while a sale that depends on a process is a scalable asset. When we underwrite an acquisition, we are less interested in last year's unit count than in whether the store has a road to the sale it can repeat.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through the traditional steps of the dealership sales process, how the modern customer has compressed and reordered them, the metrics that tell you whether the process is working, and how pay plans and management structure shape the behavior on the floor.",
      },
      { type: "subheading", text: "The Classic Road to the Sale" },
      {
        type: "paragraph",
        text: "For decades, the industry has taught some version of a stepwise sales process, often called the road to the sale. The names vary by trainer and by store, but the sequence is broadly consistent: the meet and greet, needs assessment, vehicle selection, product presentation and walkaround, the demonstration drive, the trade-in evaluation, the write-up and negotiation, the turnover to F&I, and finally delivery and follow-up.",
      },
      {
        type: "paragraph",
        text: "Each step exists for an economic reason. The needs assessment is there because selling the wrong vehicle — too expensive, wrong body style, wrong drivetrain for an Iowa winter — creates a deal that falls apart at the desk or comes back as an unhappy customer. The walkaround and test drive exist because customers who drive the vehicle close at materially higher rates than those who do not. The trade evaluation exists because most buyers have a vehicle to dispose of, and that vehicle is often the most profitable piece of the transaction, as we will explore in our chapter on trade-in appraisal. The steps also create checkpoints. A sales manager who knows that a customer has completed a needs assessment and a test drive but has not yet seen numbers can make a very different decision than one who only knows that \"someone is on the lot.\" Process is what turns sales management from guesswork into coaching.",
      },
      { type: "subheading", text: "How the Modern Customer Rewrote the Steps" },
      {
        type: "paragraph",
        text: "The road to the sale was designed for a customer who arrived knowing relatively little. That customer is largely gone. Cox Automotive's long-running Car Buyer Journey research has consistently found that buyers spend the majority of their shopping time online before they ever contact a store, and that most visit only a small number of dealerships — often just one or two — before buying. By the time a customer walks in, they have frequently already chosen the model, compared prices across several stores, and estimated the value of their trade.",
      },
      {
        type: "paragraph",
        text: "That changes the job. The meet and greet is often a confirmation of an appointment rather than a cold introduction. Needs assessment becomes validation: confirming the trim, color, and options the customer already researched and catching the cases where the online choice does not fit their actual use. Product presentation shifts from features the customer has never heard of to the questions the internet could not answer — how the seat feels, how the infotainment actually works, what the service experience will be.",
      },
      {
        type: "paragraph",
        text: "What has not changed is that most buyers still want to see and drive the vehicle, and most still finish the transaction in person. Industry research has repeatedly shown that while buyers want to complete more of the process online, only a minority want to buy entirely without visiting a store. The modern process is therefore a hybrid: fewer steps performed from scratch, more steps performed to confirm, and a much lower tolerance for wasted time. We return to this in depth in our chapter on digital retailing.",
      },
      {
        type: "image",
        src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/FrontofNissanElgin.jpg",
        alt: "Exterior of Nissan of Elgin dealership",
        caption:
          "Front of Nissan of Elgin, a Coleman Automotive dealership. Most customers who walk through this door have already done hours of research online. Photo: Sweet Dreams US LLC",
        orientation: "wide",
      },
      { type: "subheading", text: "The Metrics That Tell You Whether the Process Works" },
      {
        type: "paragraph",
        text: "An investor does not need to stand on the showroom floor to evaluate a sales process. The process leaves fingerprints in the data. The most basic is the closing ratio — the share of showroom opportunities, or \"ups,\" that turn into sold units. A store that logs 400 fresh ups in a month and delivers 80 units is closing at 20%. The same store closing at 25% would deliver 100 units from identical traffic, with no additional advertising spend. That gap is pure process.",
      },
      {
        type: "paragraph",
        text: "Closing ratio is only meaningful when traffic is logged honestly, which is why we look at the CRM before we look at the ratio. A store where salespeople log only the customers who buy will show an implausibly high closing rate and tell you nothing. A store with disciplined up-logging lets you break conversion down by step: what share of customers took a test drive, what share received a written proposal, what share of proposals closed, and what share of unsold customers received follow-up within a day.",
      },
      {
        type: "paragraph",
        text: "The second family of metrics is productivity. Units per salesperson per month is the headline number; industry trainers commonly cite something in the low teens as a solid benchmark for a full-time salesperson, though the right number varies by brand, market, and pay plan. Gross per unit, which we cover in the next chapter, tells you whether those units are being sold well. And the mix of units — how many came from walk-in traffic, internet leads, phone leads, repeat customers, and referrals — tells you how dependent the store is on paid advertising versus its own customer base.",
      },
      {
        type: "callout-numbers",
        title: "Illustrative Example: What a Five-Point Closing Improvement Is Worth",
        lines: [
          "Monthly showroom opportunities logged: 400 (illustrative)",
          "Closing ratio at 20%: 80 units per month — at 25%: 100 units per month",
          "Incremental units: 20 per month, or 240 per year, from the same traffic",
          "At an illustrative $3,000 of combined front-end and back-end gross per unit: roughly $720,000 of additional annual gross",
          "Incremental advertising spend required: none — the gain comes from process, training, and follow-up",
        ],
        link: {
          text: "See how Coleman Prime underwrites operational upside",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "Who Does What: Salespeople, Managers, and the Desk" },
      {
        type: "paragraph",
        text: "The sales floor has a hierarchy that most outsiders never see. Salespeople — often called sales consultants or product specialists — own the customer through presentation and test drive. Sales managers, sometimes working from a central \"desk,\" structure the numbers, approve pricing, and decide when to bring in a second voice. A general sales manager oversees new and used vehicles together, sets pricing strategy, and manages inventory with the used car manager. Above them, the general manager is accountable for the store's total profitability.",
      },
      {
        type: "paragraph",
        text: "One traditional practice that illustrates the structure is the turnover, or T.O. — the moment a salesperson brings a manager into the conversation, either to resolve an objection or to present numbers with more authority. Done well, a turnover is a service to the customer: a decision-maker in the room shortens the transaction. Done badly, it is the source of the endless back-and-forth that customers consistently rank among the least pleasant parts of buying a car. Modern stores increasingly empower salespeople to present a complete, manager-approved proposal on the first pass, which reduces turnovers and shortens time in the store.",
      },
      {
        type: "paragraph",
        text: "Once the customer agrees to terms, the deal is turned over to the F&I office, where financing is finalized, required disclosures are executed, and optional protection products are presented. We covered F&I as a profit center in an earlier post and devote a full module to it later in this series. The key point for the sales process is that the handoff must be clean: a customer who arrives in F&I frustrated by a long negotiation is a customer who will be less receptive and less satisfied, and that shows up in both gross and CSI.",
      },
      { type: "subheading", text: "Pay Plans Shape Behavior" },
      {
        type: "paragraph",
        text: "Every sales process is ultimately enforced — or undermined — by the pay plan. The traditional structure pays salespeople a commission on front-end gross profit, commonly somewhere in the range of 20% to 30%, with a minimum flat \"mini\" commission on deals that produce little or no gross. Many plans layer on unit-volume bonuses, CSI bonuses, and spiffs on specific vehicles or products.",
      },
      {
        type: "paragraph",
        text: "Each element pulls behavior in a direction. A plan heavily weighted to gross encourages salespeople to hold price, which can protect margin but slow the turn. A plan heavily weighted to volume encourages speed, which can help aged inventory move but erode gross. A plan with meaningful CSI components encourages the follow-up and delivery quality that drive repeat business. Some stores have moved to salaried or unit-based \"one-price\" models where the salesperson does not negotiate at all. None of these is right in every market; what matters is that the pay plan and the process point the same direction. In diligence, we read the pay plans alongside the deal log. If the plan rewards something the process is not supposed to do, the deal log usually shows it — in clusters of mini deals at month-end, in unusual gross variance between salespeople, or in follow-up activity that collapses once a customer leaves without buying.",
      },
      { type: "subheading", text: "Delivery and Follow-Up: The Step That Pays Later" },
      {
        type: "paragraph",
        text: "The last step of the road to the sale is the one most often rushed. A proper delivery means the vehicle is clean and fueled, the customer's phone is paired, key features are explained, and the customer is introduced to the service department before they leave. That final introduction matters more than it seems. As we discussed in our chapters on fixed operations, the service relationship is where a dealership earns recurring, recession-resistant gross — and the sales department is the funnel that fills the service drive.",
      },
      {
        type: "paragraph",
        text: "Follow-up closes the loop. A thank-you call, a check-in after the first week, a reminder before the first service visit, and an annual touch create the repeat and referral business that lowers the store's cost of acquiring the next customer. Stores that sell a meaningful share of units to prior customers and referrals are structurally less dependent on paid advertising, which is one of the quieter signals of a durable franchise.",
      },
      {
        type: "paragraph",
        text: "The road to the sale is not glamorous, and in the age of online research it is shorter than it used to be. But every step still exists for a reason, and every step still leaves a trail in the data. An investor who learns to read that trail can tell the difference between a store that sells cars and a store that has a system for selling cars.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime evaluates the sales process through the CRM and the deal log, not the sales pitch.",
          "In diligence we test up-logging discipline, step-by-step conversion, follow-up activity, and the alignment between pay plans and desired behavior.",
          "Post-acquisition, Coleman Automotive Group standardizes the process, the CRM workflow, and manager coaching cadence across rooftops while respecting local market differences.",
          "The goal is a sale that depends on a system — which is what makes a store scalable and reduces key-person risk for the Fund.",
        ],
        link: {
          text: "Learn how Coleman Prime approaches operations after acquisition",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "desking-the-deal-front-end-gross-profit",
      "anatomy-dealership-seven-profit-centers",
    ],
  },
];
