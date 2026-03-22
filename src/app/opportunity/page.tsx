"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import MagneticButton from "@/components/ui/MagneticButton";
import NumberCounter from "@/components/ui/NumberCounter";
import GoldDivider from "@/components/ui/GoldDivider";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const fundTerms = [
  { label: "Target Fund Size", value: "$20M" },
  { label: "Minimum Investment", value: "$100,000" },
  { label: "Target IRR", value: "21-31%" },
  { label: "Fund Term", value: "10 Years" },
  { label: "Distribution", value: "Annual" },
];

const comparisonData = [
  { asset: "Private Fund invested in Auto Dealerships", yield: "21-31%", risk: "Medium", liquidity: "Low", correlation: "Low" },
  { asset: "S&P 500", yield: "8-10%", risk: "High", liquidity: "High", correlation: "High" },
  { asset: "Real Estate (REIT)", yield: "6-10%", risk: "Medium", liquidity: "Medium", correlation: "Medium" },
  { asset: "Private Equity (non-auto)", yield: "15-20%", risk: "High", liquidity: "Very Low", correlation: "Medium" },
  { asset: "Bonds (10Y Treasury)", yield: "4-5%", risk: "Low", liquidity: "High", correlation: "Low" },
];

const riskFactors = [
  "Economic downturns may reduce vehicle sales volume at dealerships adversely affecting cash flow to the Fund",
  "Original equipment manufacturer (OEM) relationship and franchise agreement risks at dealerships adversely affecting cash flow to the Fund",
  "Interest rate changes affecting floor plan costs at dealerships adversely affecting cash flow to the Fund",
  "Regulatory changes in automotive retail adversely affecting cash flow to the Fund",
  "Key person dependency on co-investor's management team adversely affecting cash flow to the Fund",
  "A Fund interest is an illiquid equity investment with limited transferability",
];

function FundStructure() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Fund Structure"
          title="Investment Terms"
          subtitle="Structured to align the interests of Prime Management Partners, LLC (the Fund's Manager), its co-investor and Fund investors' interests while targeting an attractive return."
        />
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {fundTerms.map((term) => (
            <motion.div
              key={term.label}
              variants={staggerItem}
              className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800/50 text-center"
            >
              <p className="text-gold-400 font-display text-2xl md:text-3xl font-bold mb-2">
                {term.value}
              </p>
              <p className="text-navy-400 text-sm font-mono tracking-wider uppercase">
                {term.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonTable() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Comparison"
          title="How We Compare"
          subtitle="The Prime Dealer Equity Fund offers investors a compelling risk-return profile versus traditional investments."
        />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-navy-800">
                <th className="text-left py-4 px-4 font-mono text-xs tracking-wider uppercase text-navy-400">
                  Asset Class
                </th>
                <th className="text-left py-4 px-4 font-mono text-xs tracking-wider uppercase text-navy-400">
                  Target Return
                </th>
                <th className="text-left py-4 px-4 font-mono text-xs tracking-wider uppercase text-navy-400">
                  Risk
                </th>
                <th className="text-left py-4 px-4 font-mono text-xs tracking-wider uppercase text-navy-400">
                  Liquidity
                </th>
                <th className="text-left py-4 px-4 font-mono text-xs tracking-wider uppercase text-navy-400">
                  Market Correlation
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr
                  key={row.asset}
                  className={`border-b border-navy-800/50 ${
                    i === 0 ? "bg-gold-400/5" : ""
                  }`}
                >
                  <td className={`py-4 px-4 font-display font-medium ${i === 0 ? "text-gold-400" : "text-cream-100"}`}>
                    {row.asset}
                    {i === 0 && <span className="ml-2 text-xs text-gold-400/60">(Our Fund)</span>}
                  </td>
                  <td className="py-4 px-4 text-cream-200 text-sm">{row.yield}</td>
                  <td className="py-4 px-4 text-cream-200 text-sm">{row.risk}</td>
                  <td className="py-4 px-4 text-cream-200 text-sm">{row.liquidity}</td>
                  <td className="py-4 px-4 text-cream-200 text-sm">{row.correlation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        <p className="text-navy-500 text-xs mt-4 text-center">
          Returns are targets only, not guaranteed. Past performance does not indicate future results.
          <br />
          <span className="text-navy-600">Sources: S&amp;P 500 historical avg (S&amp;P Global); REIT avg (Nareit); PE avg (Cambridge Associates); Treasury yield (U.S. Dept. of Treasury)</span>
        </p>
      </div>
    </section>
  );
}

function RiskFactors() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="py-24 md:py-32 bg-navy-900/30">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader
          label="Disclosures"
          title="Risk Factors"
          subtitle="All investments carry risk. We commit to transparency with our investors."
        />
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-4"
        >
          {riskFactors.map((risk, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="flex items-start gap-4 p-4 rounded-xl bg-navy-950/50 border border-navy-800/30"
            >
              <span className="text-gold-400 font-mono text-sm mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-navy-300 text-sm leading-relaxed">{risk}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function OpportunityPage() {
  return (
    <PageLayout>
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-gold-400 font-mono text-sm tracking-[0.2em] uppercase mb-6"
          >
            The Fund&apos;s Investment Opportunity
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6"
          >
            A <span className="text-gold-gradient">$1.2 Trillion</span> Industry
            <br />
            Awaiting Consolidation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            The U.S. automotive retail market is highly fragmented — the top 10 dealer groups
            control less than 10% of the market. Prime Dealer Equity Fund is positioned to capitalize
            on this once-in-a-generation investment opportunity, while targeting a minimum of 8% annual distribution.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-navy-600 text-xs mt-4 max-w-xl mx-auto"
          >
            Sources: NADA Annual Data Report 2024; Kerrigan Advisors 2024 Blue Sky Report
          </motion.p>
        </div>
      </section>

      <GoldDivider />
      <FundStructure />
      <ComparisonTable />
      <RiskFactors />

      <section className="py-24 md:py-32 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mb-6">
            Ready to Learn More?
          </h2>
          <p className="text-navy-300 mb-8">
            Request our private placement memorandum for our Fund and schedule a consultation with our investor relations team.
          </p>
          <MagneticButton href="/contact" variant="primary" size="lg">
            Request Investment Materials
          </MagneticButton>
        </div>
      </section>
    </PageLayout>
  );
}
