import type { BlogPost } from "./blog-types";

/**
 * Module 1 — Industry Foundations (Chapters 1–4 of 8).
 * Curriculum-style teaching arc that builds the dealership mental model
 * before going inside any single department. Posts auto-publish on their
 * `date` field via the publish-date gate in blog-data.ts.
 */
export const may2026Posts: BlogPost[] = [
  {
    slug: "anatomy-dealership-seven-profit-centers",
    category: "Investor Education",
    title:
      "Anatomy of a Dealership: The Seven Profit Centers Most Investors Don’t See",
    subtitle:
      "New, used, F&I, service, parts, body shop, fleet — the seven independent income streams that make a franchise dealership a portfolio of businesses, not a single retail operation.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "May 6, 2026",
    readTime: "9 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/mtpleasantdrone.png",
      alt: "Aerial view of a multi-franchise Coleman Automotive dealership",
      caption:
        "Mt. Pleasant Chevy GMC CDJR — a single rooftop operating seven distinct profit centers. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Most investors think a dealership “sells cars.” That’s one of seven profit centers operating under the same roof — new vehicles, used vehicles, F&I, service, parts, body, and fleet. Each has its own customers, margins, cycle, and competitive moat, which is what makes a franchise dealership structurally a diversified business rather than a single retail operation.",
    content: [
      {
        type: "paragraph",
        text: "When investors first underwrite a dealership, almost all of them build the same model: revenue per new vehicle sold, multiplied by units, minus a gross margin assumption. They treat the store like a single retail business — a car version of a furniture showroom. That mental model is wrong, and it consistently understates both the earnings power and the resilience of the asset.",
      },
      {
        type: "paragraph",
        text: "A modern franchise dealership is not one business. It is seven. Each profit center has its own customer base, its own pricing dynamics, its own demand cycle, and in many cases its own balance sheet treatment. They share a roof, a brand, and a general manager — and almost nothing else. Understanding that structure is the difference between thinking of a dealership as a cyclical retailer and recognizing it as a diversified operating platform.",
      },
      {
        type: "paragraph",
        text: "This chapter walks through the seven streams, why they exist as a bundle, how each one behaves through a cycle, and where the profit actually lands when you open the books. The numbers tend to surprise people — including investors who thought they already knew the industry.",
      },
      { type: "subheading", text: "The Seven Streams Explained" },
      {
        type: "paragraph",
        text: "New vehicle sales is the headline. It is the most visible profit center, the one consumers experience, and the one analysts track. It is also, on a gross-margin basis, one of the smallest. NADA composite data has shown new-vehicle gross as a share of total store gross drifting in the 25–30% range across most of the last decade, and even lower in normalized markets. New-vehicle volume drives the brand and the door swings, but it does not drive the bottom line.",
      },
      {
        type: "paragraph",
        text: "Used vehicle sales is a separate business that happens to live under the same roof. Used inventory is sourced from trade-ins, off-lease returns, auctions, and direct buys; pricing is set by an entirely different market; and the customer is often a different demographic than the new-vehicle buyer. A well-run used desk operates with its own buyer, its own reconditioning workflow, and its own turn metrics. In a tight new-vehicle supply environment, used quietly becomes the largest single contributor to variable gross.",
      },
      {
        type: "paragraph",
        text: "F&I — finance and insurance — is the third stream, and it is the one most investors miss entirely. When a customer signs paperwork, the dealer earns income on the financing arrangement, on extended service contracts, on GAP coverage, on tire-and-wheel protection, and on a handful of other ancillary products. F&I gross per retail unit at well-run stores routinely runs $1,800–$2,500 and at top performers above $3,000. It is high margin, repeatable, and almost entirely uncorrelated with the price of the underlying vehicle.",
      },
      { type: "subheading", text: "Service, Parts, Body, and Fleet" },
      {
        type: "paragraph",
        text: "The service department is where the durable economics live. Customer-pay repairs, manufacturer warranty work, and internal reconditioning all flow through the same shop, but they are billed and paid by three different counterparties. Labor rates are set by the dealer, parts margins are set by the dealer, and the customer base compounds with every vehicle sold into the market over the prior decade. Service is the profit center that makes a dealership a recurring-revenue business rather than a transactional one.",
      },
      {
        type: "paragraph",
        text: "Parts is structurally tied to service but operates as its own department with its own P&L. Beyond the parts consumed in the service drive, dealers run wholesale parts operations selling to independent repair shops, run counter sales to retail customers, and increasingly run e-commerce channels for OEM parts. A strong parts manager can build a wholesale book that is meaningful in its own right — particularly for truck and commercial-heavy franchises.",
      },
      {
        type: "paragraph",
        text: "Body shop, where the rooftop has one, is a fifth distinct business. Collision work is paid almost entirely by insurance carriers, runs on direct-repair-program relationships, and has a demand curve driven by accident frequency rather than vehicle sales. Fleet and commercial sales is the seventh — a B2B sales motion serving municipalities, contractors, and corporate accounts, with longer cycles, larger ticket sizes, and recurring service relationships attached to every unit sold.",
      },
      {
        type: "callout-numbers",
        title: "The Seven Profit Centers",
        lines: [
          "1. New vehicle sales — franchise-protected, cyclical, brand-driving",
          "2. Used vehicle sales — independent market, supply-driven margins",
          "3. F&I — finance reserve, service contracts, ancillary products",
          "4. Service — customer-pay, warranty, internal reconditioning",
          "5. Parts — counter, wholesale, e-commerce beyond the service drive",
          "6. Body shop / collision — insurance-paid, accident-frequency demand",
          "7. Fleet & commercial — B2B sales with recurring service attached",
        ],
        link: {
          text: "See how Coleman Prime underwrites these streams",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "Why This Diversification Is Structural, Not Strategic" },
      {
        type: "paragraph",
        text: "What matters for an investor is that this diversification is not a strategy choice. It is baked into the franchise itself. The OEM agreement requires the dealer to operate a service department, stock parts to a defined level, and meet sales objectives across new and certified used. Customers who buy a vehicle become service customers by virtue of warranty obligations and proximity. Trade-ins create used inventory whether the dealer wants it or not. Insurance carriers route collision work to franchised body shops because of OEM-certified repair requirements.",
      },
      {
        type: "paragraph",
        text: "A general manager cannot decide to “focus on new cars and skip service” the way a retailer can decide to skip a product line. The bundle is the business. That structural cohesion is what makes the dealership model so hard to disrupt — and so durable across operators and across cycles.",
      },
      {
        type: "paragraph",
        text: "It is also what creates the natural diversification that investors pay a premium for in other asset classes. A dealership owner does not need to assemble a portfolio of unrelated businesses to get diversification. The portfolio comes pre-assembled, with shared overhead and a single management team, inside one franchise agreement.",
      },
      { type: "subheading", text: "How Each Stream Behaves Differently in a Downturn" },
      {
        type: "paragraph",
        text: "The seven streams do not move together. New-vehicle volume is the most cyclical — it falls first and falls hardest in a recession, and historically has dropped 20–30% peak-to-trough in severe downturns. Used vehicle demand often holds steady or even strengthens, because consumers trade down rather than out of the market entirely. F&I follows transaction count, so it softens with new and used volume but remains profitable per unit.",
      },
      {
        type: "paragraph",
        text: "Service, parts, and body shop behave very differently. The installed base of vehicles in operation does not shrink in a recession; it ages. Owners defer trade-ins, drive their existing vehicles longer, and spend more on maintenance and repair to keep them running. Service hours and parts revenue often hold flat or grow during the same quarters new-vehicle gross is collapsing. Body shop demand is tied to miles driven and accident rates, both of which are largely independent of macro conditions.",
      },
      {
        type: "paragraph",
        text: "Fleet and commercial moves on its own clock entirely, driven by municipal budget cycles and corporate replacement schedules that are typically planned years in advance. The result, when you stack the streams, is a composite earnings profile dramatically less volatile than any single line implies — which is precisely why dealership earnings have historically held up better through recessions than the new-vehicle SAAR would suggest.",
      },
      { type: "subheading", text: "The Math: Where Profit Actually Comes From" },
      {
        type: "paragraph",
        text: "Here is where the model most investors build falls apart. NADA composite reporting consistently shows that fixed operations — service and parts — contribute roughly 45–50% of total store gross profit at a typical franchise dealership, despite generating a much smaller share of revenue. F&I generally contributes another 20–25% of gross. New and used vehicle sales combined often account for less than a third of total gross, even though they represent the overwhelming majority of revenue.",
      },
      {
        type: "paragraph",
        text: "Translate that into the real economics: the “car business” is not primarily a car-selling business. It is a service, parts, and finance business with a vehicle-sales front end that generates the customers and the inventory the back end monetizes. A dealer can lose money on the metal — and many do, on individual deals — and still produce strong store-level returns if the F&I desk and the service drive are running well.",
      },
      {
        type: "paragraph",
        text: "This is the single most important fact for an outside investor to internalize. The headline-grabbing volatility of new-vehicle pricing, OEM incentives, and dealer cash margins is real, but it sits on top of a much larger and much steadier base of gross profit that almost no one outside the industry sees on a P&L.",
      },
      { type: "subheading", text: "Why This Matters for the Investor" },
      {
        type: "paragraph",
        text: "When Coleman Prime underwrites a dealership, we are not buying a car store. We are buying seven businesses bundled inside one franchise, with seven independent revenue lines, seven different cycle dynamics, and a combined gross profit pool that is far more diversified than any single retail business of comparable size. That is the asset. The vehicle on the showroom floor is the marketing for it.",
      },
      {
        type: "paragraph",
        text: "It is also why operator quality matters so much. Each of the seven profit centers can be run well or run poorly, and the gap between a top-quartile and bottom-quartile operator on the same rooftop is enormous — particularly in F&I and fixed operations, where small process differences compound into hundreds of basis points of store-level return. Buying the right rooftop is half the job. Operating it well is the other half.",
      },
      {
        type: "paragraph",
        text: "For an investor evaluating the asset class, the practical takeaway is to stop modeling dealerships like single-line retailers. Build the model the way the business actually runs — seven streams, seven margin profiles, seven cycle behaviors — and the underwriting case for franchised auto retail starts to look very different from the one most outsiders carry around in their heads.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime is built around this seven-stream reality. We acquire franchised rooftops with strong fixed operations and underwritten F&I capacity, then deploy Coleman Automotive Group’s operating playbook across all seven profit centers — not just the showroom.",
          "Investors co-invest alongside an operator who runs the bundle as a portfolio, not a single retail business. That is what makes the return profile look more like a diversified operating platform than a cyclical car dealer.",
        ],
        link: {
          text: "See the Coleman Prime co-investment thesis",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: [
      "fixed-operations-recurring-revenue",
      "why-car-dealerships-most-overlooked-asset-class",
    ],
  },

  {
    slug: "reading-dealership-financial-statement-nada-composite",
    category: "Investor Education",
    title:
      "Reading a Dealership Financial Statement: A Guided Walk Through the NADA Composite",
    subtitle:
      "Every franchise dealership reports in the same standardized format. Once you can read the NADA composite, every dealership in America becomes legible.",
    author: "Ralph Marcuccilli",
    authorRole: "Managing Partner — Prime Dealer Equity Fund",
    date: "May 13, 2026",
    readTime: "11 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/MtPleasantFront.webp",
      alt: "Front exterior of Mt. Pleasant Chevy GMC CDJR",
      caption:
        "Behind every franchise dealership is the same standardized financial format. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "The NADA composite is the universal accounting language of franchise dealerships — a standardized chart of accounts that every store in America reports against, every single month. Once an investor can read it, they can compare any dealership in the country in minutes and form a defensible view of operating quality, asset productivity, and earnings power. This chapter teaches the reader to read it.",
    content: [
      {
        type: "paragraph",
        text: "Most asset classes force investors to translate between formats. A multifamily T-12 in Phoenix does not look like one in Atlanta. A SaaS company’s ARR schedule rarely lines up with the next company’s. Dealerships are different. Every franchise dealership in the United States reports its monthly financials on a standardized template — the NADA composite — built around an industry-wide chart of accounts that the manufacturers themselves require. Once you understand the structure, the format does the comparison work for you.",
      },
      {
        type: "paragraph",
        text: "This chapter is a guided walk through that document. We will move from the top of the departmental P&L down through expense lines and net-to-gross, then turn to the balance sheet — where dealership accounting genuinely diverges from other operating businesses — and finish with how the composite is used in 20 Group benchmarking and in the buy-sell market. The goal is simple: by the end, an investor should be able to open any dealership’s composite and know within fifteen minutes whether the store is well run.",
      },
      { type: "subheading", text: "The Universal Language of Dealership Accounting" },
      {
        type: "paragraph",
        text: "The NADA composite — sometimes called the “factory statement,” the “financial statement,” or simply the “composite” — is the monthly financial report every franchised dealer submits to its manufacturer. The chart of accounts is standardized at the brand level (General Motors, Ford, Stellantis, Toyota, Honda, Nissan, and the rest each maintain their own dealer accounting manual), but the structure is nearly identical across brands and conforms to NADA’s industry-wide template. Every revenue line, every expense line, every balance sheet item has a defined account number and a defined definition.",
      },
      {
        type: "paragraph",
        text: "The reason this exists is not investor convenience — it is manufacturer control. OEMs need uniform reporting to manage incentives, track market representation, allocate inventory, monitor warranty exposure, and benchmark dealer performance against the network. The byproduct, however, is enormously valuable for investors. Two dealerships in different states selling different brands report against essentially the same line items in the same order, which means apples-to-apples comparison is the default state, not a heroic analytical effort.",
      },
      {
        type: "paragraph",
        text: "The composite is also released on a strict monthly cadence. Manufacturers require submission by a fixed day of the following month, which means dealership financials are closed and reported faster and more consistently than almost any other private operating business. For a fund underwriting acquisitions, this is the difference between making decisions on real-time operating data and waiting on quarterly distributions of stale numbers.",
      },
      { type: "subheading", text: "Reading the Departmental P&L" },
      {
        type: "paragraph",
        text: "The first thing to internalize is that a dealership P&L is not one P&L — it is six. New vehicles, used vehicles, finance and insurance (F&I), service, parts, and (where applicable) body shop each report their own gross profit line, with their own direct expenses underneath. The composite then rolls all six departments into total dealership gross, subtracts overhead and personnel that are not departmentally allocated, and arrives at net pre-tax profit. An investor reading the document top-to-bottom is really reading six small businesses stapled together.",
      },
      {
        type: "paragraph",
        text: "Each department behaves differently. New vehicles are typically the highest revenue line and the lowest gross margin — often 4–7% on front-end gross before incentives, with most of the real profitability coming from manufacturer hold-back, volume bonuses, and floor plan assistance booked further down. Used vehicles run higher gross margin (10–14% is normal) but carry more inventory risk because there is no manufacturer to take aging units back. F&I is almost pure margin: it has effectively no cost of goods sold and is measured in gross per vehicle retailed (PVR), with $1,500–$2,500 PVR being the working range for most stores.",
      },
      {
        type: "paragraph",
        text: "Then come the fixed operations departments — service and parts, and body shop where the store has one. These are the high-margin recurring revenue engines of the dealership. Service gross margins typically run in the 70–75% range on customer-pay labor and the parts department in the 35–45% range. They are reported separately on the composite, but operationally they are joined at the hip: every repair order pulls labor from service and parts from parts inventory, and the composite shows both halves of that transaction in the right place. The relationship between fixed operations gross and total dealership expense is the single most important ratio on the document, and we cover it in the next chapter on fixed absorption in detail — for the purposes of this walk-through, the point is simply to recognize where it lives on the page.",
      },
      { type: "subheading", text: "The Numbers Inside the Numbers: Key Ratios" },
      {
        type: "paragraph",
        text: "The composite presents raw dollars, but operators and investors think in ratios. The departmental gross profit percentage tells you whether pricing discipline is intact. The personnel expense as a percentage of gross — the single largest controllable expense line in any dealership — tells you whether the store is over-staffed or whether productivity is in line with peers. NADA 20 Group benchmarks generally place total personnel expense between 35% and 45% of total gross; stores running above 50% are almost always either inefficient or paying their managers above market without the volume to support it.",
      },
      {
        type: "paragraph",
        text: "The single most-watched line on the composite is the net-to-gross ratio: net pre-tax profit divided by total dealership gross profit. A well-run franchise dealership in a normalized market produces a net-to-gross between 25% and 35%. Below 20% suggests expense bloat, weak fixed operations, or a poorly priced variable department. Above 40% is unusual and usually points to either an exceptionally well-run store or an accounting choice — often LIFO reserve treatment — that deserves a closer look.",
      },
      {
        type: "paragraph",
        text: "Two other ratios deserve their own attention on every read. Days supply of inventory — total units in stock divided by an average daily sales rate — tells you whether the store is over-floored relative to its sales pace; 60 days is healthy for new vehicles, 45 days for used. And return on assets, calculated against the dealership’s working capital and fixed asset base, tells you whether the operator is generating earnings commensurate with the capital tied up in the store. A franchise dealership with a healthy fixed-operations base should produce ROA materially above what a comparable retail concept produces, because the recurring service revenue carries the asset base.",
      },
      {
        type: "callout-numbers",
        title: "Key Lines on the NADA Composite",
        lines: [
          "Departmental gross profit % — pricing discipline, by department",
          "Personnel expense as % of gross — typically 35–45% in well-run stores",
          "Net-to-gross ratio — pre-tax profit ÷ total gross, target 25–35%",
          "Days supply of inventory — 60 days new, 45 days used as a working benchmark",
          "Fixed coverage / absorption — fixed-ops gross ÷ total dealership expense",
          "Return on assets — earnings against the working capital and fixed-asset base",
        ],
        link: {
          text: "See how Coleman Prime applies these ratios in underwriting",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "The Balance Sheet — What’s Different About a Dealership" },
      {
        type: "paragraph",
        text: "A dealership balance sheet looks unfamiliar to investors used to reading manufacturers, software companies, or even other retailers. Inventory is the dominant asset, often making up the majority of the asset side of the balance sheet, and it is reported under a specific accounting convention. Most franchise dealerships elect LIFO (last-in, first-out) for tax purposes, which understates inventory value relative to current market and creates a “LIFO reserve” line that an investor must add back to compare against a FIFO-reporting peer. When normalizing earnings across stores or across years, the LIFO reserve adjustment is one of the first things a careful underwriter checks.",
      },
      {
        type: "paragraph",
        text: "On the asset side there are also several manufacturer-specific receivable lines that do not exist in other industries. Contracts in transit are F&I deals that have been booked but not yet funded by the lender — typically a few days of float. Manufacturer receivables include hold-back (a percentage of MSRP returned to the dealer after the vehicle is sold), volume incentives earned but not yet paid, warranty claim receivables for service work performed under factory warranty, and co-op advertising reimbursements. These are real, collectible receivables and they aggregate to a meaningful working capital line, but they are also a place where weak operators let aging build up. A clean composite shows manufacturer receivables turning quickly; a problem composite shows months of stale balances.",
      },
      {
        type: "paragraph",
        text: "On the liability side, the dominant line is floor plan — the revolving line of credit that finances vehicle inventory. Floor plan is almost always classified as a current liability because it pays off as units sell, and it is matched almost dollar-for-dollar against the new and used vehicle inventory it finances. Net working capital at a dealership, properly calculated, nets inventory against floor plan; looking at either in isolation gives a misleading picture. The cost of floor plan interest sits on the P&L below gross profit and is partially offset by manufacturer floor plan assistance — another line item that exists nowhere else in the operating world.",
      },
      { type: "subheading", text: "20 Groups and Why Benchmarking Works" },
      {
        type: "paragraph",
        text: "The reason the composite is so useful in practice is the existence of the 20 Group system. Twenty Groups are NADA-organized peer cohorts of approximately twenty non-competing dealerships of the same brand and similar size that meet several times a year and share their composites, in full, with each other. Composite-level benchmarks — what a top-quartile Chevrolet dealer with $50M in revenue does on personnel expense, what a median Toyota store does on F&I PVR, what a top-decile fixed absorption number looks like — exist precisely because thousands of dealers report into these groups every month.",
      },
      {
        type: "paragraph",
        text: "For an institutional investor underwriting a transaction, this is a structural gift. We do not have to construct a peer set from scratch or argue about comparables — the peer set already exists, the data is already standardized, and the benchmarks are published quarterly by NADA, J.D. Power’s NADA Data, the manufacturer’s own dealer council, and several private benchmarking services. When we evaluate an acquisition target, we know precisely where the store sits against its 20 Group peers on every line that matters. A target running fixed absorption at 70% in a brand where the top quartile is at 95% is not a problem store — it is an opportunity store, with a quantifiable gap to close.",
      },
      {
        type: "paragraph",
        text: "The system also creates a built-in operating culture inside the dealership world. General managers know their composite is being compared, line by line, against twenty peer stores every quarter. The pressure to manage to the benchmark — to keep personnel expense in band, to keep days supply tight, to push fixed absorption up — is a permanent feature of the industry, and it is one of the reasons franchise dealership financial discipline is structurally tighter than the industry’s reputation suggests.",
      },
      { type: "subheading", text: "How an Investor Uses the Composite" },
      {
        type: "paragraph",
        text: "Consider a representative store: a single-point domestic franchise doing $50 million in annual revenue, of which roughly $32M is new vehicles, $11M used, $1.5M F&I, $4M service, and $1.5M parts. The composite shows a total dealership gross of about $7.5M, total expense of $5.6M, and pre-tax profit of $1.9M — a net-to-gross of roughly 25%. Personnel expense runs 38% of gross. Fixed operations gross of $3.2M covers 57% of total expense, which means the store needs only 43% of its expense base to come from variable operations to break even. Days supply is at 72 days new and 51 days used. Manufacturer receivables are turning in under 30 days. Floor plan sits at $4.8M against new and used inventory of $5.1M.",
      },
      {
        type: "paragraph",
        text: "Reading that composite, an underwriter immediately sees a healthy, normally-run store. The numbers are not exceptional — net-to-gross is at the low end of the band, days supply is slightly heavy on new, fixed absorption is below the top quartile — but nothing is broken. The opportunity, and the basis for any investment thesis, is the gap between where the store sits and where its 20 Group benchmarks say it could sit with disciplined operating execution. That gap, multiplied across departments and compounded by the cash conversion of fixed operations, is the source of operational lift that justifies a buy-sell premium.",
      },
      {
        type: "paragraph",
        text: "It is also where the “blue sky” multiple comes from. In a buy-sell transaction, the purchase price is generally expressed as the market value of tangible assets (inventory at LIFO-adjusted cost, parts at cost, fixed assets at depreciated value, working capital at book) plus a multiple of normalized pre-tax earnings — the “blue sky” component. That normalized earnings number is built directly off the composite, with adjustments for non-recurring items, owner add-backs, and any operating run-rate changes already in motion. A reader who cannot follow the composite cannot defend a multiple, and a fund that pays a multiple it cannot defend on the composite is the fund that overpays in this asset class.",
      },
      {
        type: "callout-prime",
        lines: [
          "At Coleman Prime, every acquisition target runs through a composite-level diligence process — line-by-line comparison against the brand’s 20 Group benchmarks, three years of monthly composites stress-tested for normalized earnings, and a working capital build that nets floor plan against inventory and adjusts the LIFO reserve.",
          "Once a store is acquired, the same composite becomes our monthly operating dashboard. Every dealership in the portfolio reports on the standardized format, every month, and the partnership reviews each store against its own benchmarks and against the rest of the portfolio. The composite is not a diligence document we read once — it is the operating language of the business we own.",
        ],
        link: {
          text: "Learn how the Fund underwrites and operates each acquisition",
          href: "/opportunity",
        },
      },
      {
        type: "paragraph",
        text: "The point of this chapter is not to make every investor a dealership accountant. It is to make the financial format itself a familiar object — to take what reads at first glance as an industry-specific document and reveal it as the most standardized, most benchmarked, and most operationally useful financial statement in private business. Once the composite is legible, every dealership in America is legible, and the question stops being “can we evaluate this store” and starts being “is this store priced fairly against what its composite tells us it can earn.” That is the question the rest of the curriculum is built to answer.",
      },
    ],
    relatedSlugs: ["fixed-operations-recurring-revenue", "co-investment-model"],
  },

  {
    slug: "floor-plan-financing-hidden-cost-holding-inventory",
    category: "Operations",
    title: "Floor Plan Financing Explained: The Hidden Cost of Holding Inventory",
    subtitle:
      "Every new car on the lot is borrowed money. The interest meter runs every day until it sells — and how a dealer manages that meter separates good operators from great ones.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "May 20, 2026",
    readTime: "10 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/GMCTrucksandSign.webp",
      alt: "Inventory of GMC trucks on the lot",
      caption:
        "Every vehicle on the lot is collateralized inventory financed through a floor plan line. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "A typical franchise dealership is sitting on $20–$50 million of inventory at any given moment — and almost every dollar of it is borrowed. Floor plan interest is one of the largest controllable expenses on a dealer P&L, and the discipline a management team brings to it is one of the clearest dividing lines between an average store and a great one.",
    content: [
      {
        type: "paragraph",
        text: "Walk onto any new-car lot in America and look at the rows of trucks, SUVs, and sedans. To a customer, it looks like a showroom. To an operator, it looks like a balance sheet — millions of dollars of borrowed money parked in the sun, accruing interest every day until a buyer drives one off the lot. This is floor plan financing, and it is the single most important piece of working-capital plumbing in the franchise dealer business.",
      },
      {
        type: "paragraph",
        text: "For an investor underwriting a dealership, understanding floor plan is non-negotiable. It dictates how much capital actually has to sit in the store, how sensitive the P&L is to interest rates, and — most importantly — how much margin a disciplined operator can manufacture out of thin air just by managing the line well.",
      },
      { type: "subheading", text: "What Floor Plan Financing Actually Is" },
      {
        type: "paragraph",
        text: "A floor plan is a revolving line of credit collateralized by vehicle inventory. When a manufacturer ships a new vehicle to the dealer, the floor plan lender pays the wholesale invoice directly to the OEM. The dealer takes physical possession of the unit, and the lender records a lien against that specific VIN. The dealer now owes the lender the wholesale cost plus accrued interest, and the loan is paid off the day the vehicle retails — typically within 24 to 72 hours of the sale.",
      },
      {
        type: "paragraph",
        text: "Floor plan lines are sized to inventory. A store carrying 300 new units at an average cost of $35,000 needs a line capable of supporting roughly $10.5 million in outstanding principal. The line is monitored almost continuously — most lenders run weekly or bi-weekly audits where a third-party inspector physically verifies that every financed VIN is on the lot and accounted for. Floor plan is not optional credit. Without it, a dealer cannot take delivery of inventory, and without inventory there is no business.",
      },
      {
        type: "paragraph",
        text: "There are three primary categories of floor plan provider. Captive lenders — Ford Motor Credit, GM Financial, Toyota Financial Services, Stellantis Financial — are owned by the OEMs and built specifically to floor their own brands. Commercial banks like JPMorgan, Wells Fargo, and Huntington run dedicated dealer commercial services groups. Specialty independents like NextGear, Westlake Flooring, and Automotive Finance Corporation focus on used inventory and on dealers the captives and banks don’t want. Most franchise stores carry a primary captive line for new vehicles and a secondary line for used.",
      },
      { type: "subheading", text: "How the Mechanics Work — From Truck Delivery to Customer Sale" },
      {
        type: "paragraph",
        text: "The lifecycle of a floor-planned vehicle looks like this. A unit is built at the OEM plant and assigned to the dealer. The transport carrier drops it at the store, the receiving manager inspects it, and the VIN is entered into the dealer management system. That entry triggers a draw on the floor plan line — the lender wires the wholesale invoice amount to the manufacturer, and the dealer’s outstanding balance ticks up by the cost of that vehicle.",
      },
      {
        type: "paragraph",
        text: "From that moment on, the meter is running. Interest accrues daily on the outstanding principal, calculated against a rate that almost always floats with Prime. A creditworthy, well-capitalized dealer might be priced at Prime plus 1%. A weaker store, or one being floored by a specialty lender, might be at Prime plus 3% or 4%. With Prime currently sitting in the mid-7% range, that means new-car floor plan rates of roughly 8% to 11%, depending on the dealer.",
      },
      {
        type: "paragraph",
        text: "When a customer buys the car, the deal funds, and the payoff to the floor plan lender is one of the first wires out the door — usually within one to three business days. The lien is released, the VIN comes off the line, and the principal balance drops by exactly the wholesale cost of that unit. The dealer keeps everything between the wholesale cost and the retail selling price, minus the interest that accrued while the vehicle sat on the lot. That last number — interest accrued — is where operator skill shows up.",
      },
      { type: "subheading", text: "The Cost Curve: Why Day 91 Is Different From Day 30" },
      {
        type: "paragraph",
        text: "Floor plan lenders do not want vehicles sitting on the line forever. Aged inventory is risky inventory — the longer a unit sits, the more likely it is to be marked down, damaged, or wholesaled at a loss. To manage that risk, every floor plan agreement contains a curtailment schedule, which is essentially a forced principal paydown timeline. Curtailments are commonly triggered at day 90, 180, and 270, with the dealer required to pay down a percentage of principal at each milestone whether the vehicle has sold or not.",
      },
      {
        type: "paragraph",
        text: "Aged units also carry a higher rate. A unit past its first curtailment date frequently moves from Prime plus 1% to Prime plus 3% or worse, and at the second curtailment the lender may reprice it again or demand a 25%–50% principal paydown out of cash. So the operator is hit twice — they are paying more interest on a higher-rate balance, and they are pulling cash off the balance sheet to satisfy the curtailment. A vehicle that should have sold in 60 days and instead sits for 200 can erase its entire gross margin and then some.",
      },
      {
        type: "paragraph",
        text: "This is why aged inventory is the silent killer of dealership profitability. It does not show up in a single line on the P&L; it shows up as compressed front-end gross, elevated floor plan expense, and depressed cash flow all at once. A store with 300 units in inventory and 30 of them past curtailment is, in effect, paying a tax on its own poor ordering discipline.",
      },
      {
        type: "callout-numbers",
        title: "The Floor Plan Math",
        lines: [
          "Average new-car floor plan line at a single rooftop: $8M–$15M",
          "Typical inventory: 200–400 new units at $30K–$45K average cost",
          "Current rate environment: Prime + 1% to Prime + 4% (≈8%–11% all-in)",
          "Daily interest cost on a $10M line at 8%: roughly $2,200 per day",
          "Annualized: $700K–$900K of floor plan expense per rooftop",
          "Curtailment milestones: typically day 90, 180, and 270",
        ],
        link: {
          text: "See how Prime models floor plan exposure across the portfolio",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "Manufacturer Floor Plan Assistance: The Window That Matters" },
      {
        type: "paragraph",
        text: "Almost every OEM offers a program called floor plan assistance, or FPA. In its simplest form, the manufacturer reimburses the dealer for floor plan interest on new inventory for a defined window after delivery — commonly the first 30 to 90 days, depending on the brand and the model. For many manufacturers, FPA is paid as a flat per-unit credit against the wholesale invoice; for others, it’s a true interest reimbursement keyed to the actual rate the dealer is paying.",
      },
      {
        type: "paragraph",
        text: "The economic implication is enormous. A vehicle that turns inside its FPA window costs the dealer effectively zero in floor plan interest. A vehicle that sits one day past it starts costing real money. So the question of whether a store sells most of its inventory inside the FPA window — versus burning through it and paying interest out of pocket — is a single-digit percentage difference that can move hundreds of thousands of dollars to the bottom line.",
      },
      {
        type: "paragraph",
        text: "Sophisticated operators model FPA windows by model and by brand and use that data to inform how they order, how they price, and which units they push their sales team to move first. The dealers who don’t track it leave manufacturer money on the table every month — a recurring leak that compounds across hundreds of vehicles a year.",
      },
      { type: "subheading", text: "What Great Operators Do Differently" },
      {
        type: "paragraph",
        text: "Floor plan discipline is not glamorous, but it is the most reliable margin lever in the new-car business. The operators who run it well do four things consistently. First, they order with discipline — they build their inventory mix around the units that actually sell in their market, not the units the factory wants to push. A store that orders correctly carries fewer units and turns them faster, which means a smaller line, less interest, and more time inside the FPA window.",
      },
      {
        type: "paragraph",
        text: "Second, they enforce ruthless aged-unit policies. The best operators have a written rule — once a unit hits day 75 or day 80, it is repriced, advertised harder, or moved to wholesale before curtailment hits. They would rather take a small front-end haircut than pay a 200-day interest tab and a forced principal paydown. Third, they own their FPA windows like a calendar — every salesperson and every desk manager knows which units are about to age out and prices and incentivizes accordingly. Fourth, they treat the floor plan statement as a P&L document, not a back-office report. The CFO, the GM, and the variable ops director all read it together every month.",
      },
      {
        type: "paragraph",
        text: "These habits sound mundane. They are also the reason two stores selling identical product mixes can have new-car gross profit per unit that differs by $400 or more. That difference is almost entirely a function of how the floor plan is managed.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime models floor plan exposure as a first-class line item during diligence — not a footnote.",
          "We pull at least 24 months of floor plan statements, reconcile them against curtailment schedules, and rebuild interest expense at our forward rate assumptions.",
          "We separate true cost of carry from manufacturer FPA reimbursement to see which stores are actually being subsidized — and which are leaking margin every month.",
          "We model post-close inventory targets the same way: smaller, faster-turning lines that fit the operating playbook Kyle Coleman’s team brings to every acquisition.",
          "The result is a much more accurate view of underwritten cash flow — and a clear list of operational fixes we can implement on day one.",
        ],
        link: {
          text: "Read how the Coleman Prime playbook approaches diligence",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "Why Floor Plan Discipline Drives Margin Expansion" },
      {
        type: "paragraph",
        text: "When Coleman Prime evaluates an acquisition target, floor plan is one of the first things we look at — not because it is the largest expense, but because it is the most fixable. New ownership with a strong operating playbook can move a store’s floor plan expense by 15% to 25% in the first twelve months, just by cleaning up ordering, tightening curtailment management, and capturing more FPA. None of that requires capex. It requires discipline.",
      },
      {
        type: "paragraph",
        text: "That improvement falls almost entirely to the bottom line. On a typical rooftop, a 20% reduction in floor plan expense is worth roughly $150K to $200K of incremental annual EBITDA, and at a fund-level multiple, that translates into millions of dollars of enterprise value created out of nothing more than better day-to-day operating habits.",
      },
      {
        type: "paragraph",
        text: "This is the quiet truth of the dealer business. The flashy parts — new model launches, big advertising campaigns, sales contests — are visible to everyone. The real money is in the boring parts: how fast inventory turns, how aged units are managed, and how tightly the floor plan is run. For investors who want to understand what makes a dealership a great asset, start with the floor plan. Everything else follows from it.",
      },
    ],
    relatedSlugs: ["fixed-operations-recurring-revenue", "first-90-days-after-acquisition"],
  },

  {
    slug: "days-supply-turn-rate-aged-inventory-math",
    category: "Operations",
    title:
      "Days Supply, Turn Rate, and Aged Inventory: The Math That Kills Dealership Profit",
    subtitle:
      "Three numbers tell you whether a dealership is hemorrhaging money or compounding it: how much inventory you have, how fast it moves, and how much of it is past its prime.",
    author: "Kyle Coleman",
    authorRole: "CEO — Coleman Automotive Group",
    date: "May 27, 2026",
    readTime: "10 min read",
    heroImage: {
      src: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/NissanWarsaw/NissanWarsawCarsinShowroom.webp",
      alt: "New Nissan inventory in the showroom",
      caption:
        "Inventory that turns is profit. Inventory that ages is cost. Photo: Sweet Dreams US LLC",
    },
    excerpt:
      "Holding too little inventory means lost sales; holding too much means paying floor plan interest on cars that won’t sell. Days supply and turn rate are the two metrics that resolve that tension — and aged inventory is what happens when dealers get them wrong. Get the math right and a store compounds; get it wrong and every day on the lot bleeds margin.",
    content: [
      {
        type: "paragraph",
        text: "Every dealership is, at its core, an inventory business. The store buys cars at one price, finances them on a floor plan line, holds them for some number of days, and sells them at another price. The spread between those two prices — minus the carrying cost of every day in between — is the front-end gross. That single sentence is why inventory metrics are the most important operating numbers in a dealership.",
      },
      {
        type: "paragraph",
        text: "Yet inventory is also the metric most operators get wrong. Sales managers want more units on the ground because more units feel like more opportunity. Owners want fewer units because every car is a line item on a floor plan bill. The job of a disciplined operator is to size inventory to actual demand — not to feel, not to brand pressure, and not to last quarter’s sales pace.",
      },
      {
        type: "paragraph",
        text: "Two numbers govern that decision: days supply and turn rate. They are mathematically the same idea looked at from opposite ends of the telescope, and together they tell you whether a store is positioned to make money or positioned to bleed it.",
      },
      { type: "subheading", text: "The Two Numbers That Govern Inventory" },
      {
        type: "paragraph",
        text: "Days supply is the simpler of the two. The formula is (current inventory units divided by monthly sales rate) multiplied by 30. A store sitting on 180 new units that sells 60 per month is carrying 90 days’ supply. The number answers a single, blunt question: at today’s pace, how long would it take to sell through what is sitting on the lot if no new units arrived?",
      },
      {
        type: "paragraph",
        text: "Turn rate is the inverse view. The formula is annual sales units divided by average inventory. The same store — 60 units a month at 180 units of average inventory — sells 720 a year and turns its inventory four times. New-vehicle operators tend to think in days supply because that is how the manufacturer talks. Used-vehicle operators tend to think in turns because that is how the wholesale market talks. Both are describing the same physics.",
      },
      {
        type: "paragraph",
        text: "What matters is that an operator looks at both. Days supply tells you how exposed you are to floor plan interest and market depreciation right now. Turn rate tells you whether the operating engine is producing the velocity it should be producing across a full year. A store can have an acceptable days supply on a given Friday and still be running an unhealthy turn rate over twelve months — and that is the case where inventory discipline quietly erodes profit.",
      },
      { type: "subheading", text: "What Counts as “Healthy” Days Supply" },
      {
        type: "paragraph",
        text: "Industry sweet spots are well established. New-vehicle inventory tends to run healthiest in the 60 to 75-day range. Used-vehicle inventory tends to run healthiest in the 30 to 45-day range — used depreciates faster, so the cost of being wrong is higher and the discipline has to be tighter. Translated to turns, that is roughly 5 to 6 turns per year on new and 8 to 12 turns per year on used.",
      },
      {
        type: "paragraph",
        text: "Those are starting points, not commandments. The “right” days supply varies by brand, by market, and by the turn velocity of specific models. A luxury franchise can run hotter — 80 to 100 days is often acceptable because individual units carry higher gross and customers expect a deeper selection to configure against. A high-volume mass-market store needs to run leaner because gross per unit is thinner and the math only works if velocity is high.",
      },
      {
        type: "paragraph",
        text: "Within a single store, the same logic applies model by model. A pickup configuration that sells in 21 days deserves to be re-stocked aggressively. A trim level that consistently ages past 75 days deserves to be ordered less, priced more sharply at receipt, or removed from the order guide entirely. Days supply at the store level is an average — the discipline lives one VIN at a time.",
      },
      {
        type: "callout-numbers",
        title: "The Inventory Discipline Targets",
        lines: [
          "New-vehicle days supply: 60–75 days at the store level",
          "Used-vehicle days supply: 30–45 days, tighter on volume segments",
          "Annual turn rate: 5–6× on new, 8–12× on used",
          "Aged 60+ days: under 15% of total inventory units",
          "Aged 90+ days: under 5% of total inventory units",
          "Wholesale exit decisions reviewed weekly, not monthly",
        ],
        link: {
          text: "See how Coleman Prime applies these standards across the platform",
          href: "/opportunity",
        },
      },
      { type: "subheading", text: "The Aged Inventory Death Spiral" },
      {
        type: "paragraph",
        text: "Every market has units that won’t sell at intended margin. The wrong color, the wrong trim, the wrong powertrain for the season, a competitor incentive that just landed — there are a hundred reasons a unit can stop moving. The discipline is not pretending those units don’t exist. The discipline is recognizing them early and acting before the math gets worse.",
      },
      {
        type: "paragraph",
        text: "The industry rule of thumb is that 60-day-old units start losing margin power. Pricing tools recommend the first markdown, sales managers stop showing the unit first, and the customer pool that would have paid sticker is mostly gone. By 90 days, the unit typically needs to be wholesaled at a loss or held through a second markdown that erases what front-end gross was left. Every additional day on the ground is roughly $40 to $60 in floor plan interest, plus an unmeasured but real amount of market depreciation, plus the opportunity cost of the lot space and the capital.",
      },
      {
        type: "paragraph",
        text: "The reason aged inventory compounds badly is that the longer a unit sits, the more the surrounding economics work against it. Floor plan interest accrues daily. Market values drift as new model years arrive. Reconditioning expenses creep up as detail and mechanical issues recur. Salespeople lose interest in working a unit they have failed to sell three times. Aged inventory is not just a one-time write-down — it is a slow drain that quietly subtracts from store profit every single month it isn’t addressed.",
      },
      { type: "subheading", text: "Used Vehicles: A Different Discipline" },
      {
        type: "paragraph",
        text: "Used inventory is where the most disciplined operators separate themselves. The new-vehicle world has factory pricing, factory incentives, and a finite order guide. The used-vehicle world has none of that — every unit is sourced individually, priced individually, and depreciates on its own clock. Get used wrong and the losses scale much faster than on new.",
      },
      {
        type: "paragraph",
        text: "Modern used-vehicle operations run on price-to-market tools — vAuto, ProfitTime, MarketScan, and similar platforms — that rank every unit against live competing inventory inside the store’s market radius and recommend a markdown cadence based on age and price position. A unit priced 96% to market on day 15 is in a very different position than the same unit priced 102% to market on day 45, and the system flags the difference long before a human manager would catch it.",
      },
      {
        type: "paragraph",
        text: "The discipline isn’t the tool — it’s using the tool. Disciplined used-vehicle operations review the price-to-market and age report every Monday morning, mark down units on a fixed cadence, and accept that a 30-day-old unit priced sharply is worth far more to the business than a 75-day-old unit being held for an extra $500 of theoretical gross. That single behavior — pricing today’s reality instead of yesterday’s hope — is what separates a 10-turn used operation from a 6-turn one.",
      },
      { type: "subheading", text: "Wholesale Exit — When to Cut Bait" },
      {
        type: "paragraph",
        text: "The hardest decision in inventory management is taking a known loss today to avoid a larger unknown loss tomorrow. A 75-day-old unit that won’t respond to the second markdown is a wholesale candidate. Holding it for another 30 days while hoping for a retail customer typically costs another $1,500 in floor plan, market depreciation, and reconditioning — to recover, at best, a few hundred dollars more than the auction would have paid. The math almost always favors the exit.",
      },
      {
        type: "paragraph",
        text: "Disciplined operators set policy rather than negotiate every unit. The rule at a well-run store is something like: any used unit at 60 days gets a final markdown; any used unit at 75 days that hasn’t responded goes to the wholesale list; any used unit at 90 days is gone, period. The policy removes ego from the decision. It also removes the temptation to keep one ugly unit on the lot because someone in the store is convinced it will sell next week.",
      },
      {
        type: "paragraph",
        text: "Healthy stores wholesale a steady, modest percentage of their used acquisitions. Unhealthy stores either wholesale almost nothing — because they hold units indefinitely and let aged inventory metastasize — or wholesale far too much, because their acquisition discipline at the front end was poor. The wholesale exit rate is, in practice, one of the cleanest indicators of how well the inventory engine is being run.",
      },
      { type: "subheading", text: "How Operators Win on Inventory Discipline" },
      {
        type: "paragraph",
        text: "Every dealership we acquire arrives with some version of an inventory problem. Sometimes it’s overstock — too many units, too much days supply, too much floor plan interest. Sometimes it’s aged — units that quietly crossed 90 days under the previous operator and are now sitting on the books at numbers that no longer reflect the market. Sometimes it’s mix — the right total unit count but the wrong models, trims, and colors for the local customer base.",
      },
      {
        type: "paragraph",
        text: "The fix is rarely a single dramatic action. It is a set of weekly disciplines: age report every Monday, price-to-market review every Wednesday, wholesale list finalized every Friday, order guide adjusted at every monthly cycle based on what actually sold versus what was ordered. None of it is glamorous. All of it compounds. Within two to three months of consistent execution, days supply normalizes, aged percentages drop, turn rate rises, and floor plan interest as a percentage of gross falls measurably.",
      },
      {
        type: "paragraph",
        text: "That sequence — diagnose the inventory inheritance, install the weekly disciplines, hold managers accountable to the metrics, accept the short-term wholesale losses to clean the deck — is what produces the margin expansion that shows up six and twelve months after a Coleman Prime acquisition. It is not magic. It is the inventory math, applied with the same discipline at every store, every week, with no exceptions.",
      },
      {
        type: "callout-prime",
        lines: [
          "Coleman Prime applies the same inventory discipline at every store from day one of integration.",
          "Days supply, turn rate, and aged-unit policy are reviewed weekly at every dealership in the platform — not monthly, not quarterly.",
          "Pricing tools, age reports, and wholesale exit rules are standardized across the group, so every store benefits from the same operating rigor regardless of size or brand.",
          "The result is faster turn, lower floor plan interest as a percentage of gross, and more capital free to fund the next acquisition.",
        ],
        link: {
          text: "Learn how the Coleman Prime operating model translates discipline into returns",
          href: "/opportunity",
        },
      },
    ],
    relatedSlugs: ["first-90-days-after-acquisition", "fixed-operations-recurring-revenue"],
  },
];
