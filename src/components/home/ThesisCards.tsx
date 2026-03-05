"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const thesisPoints = [
  {
    title: "Recession Resistant",
    description:
      "Americans need vehicles regardless of economic cycles. Service departments generate consistent revenue even in downturns.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Hard Asset Backed",
    description:
      "Real estate, inventory, franchise rights, and equipment provide tangible collateral and downside protection.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: "Multiple Revenue Streams",
    description:
      "New & used sales, F&I, service, parts, and body shop (some locations) — seven distinct profit centers in every dealership.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    title: "Protected Market",
    description:
      "OEM franchise agreements create territorial exclusivity. High barriers to entry protect existing operators.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
];

export default function ThesisCards() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Investment Thesis"
          title="Why Automotive Retail"
          subtitle="A $1.2 trillion industry with structural advantages that institutional capital is only beginning to discover."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {thesisPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={staggerItem}
              className="group p-8 rounded-2xl bg-navy-900/50 border border-navy-800/50 hover:border-gold-400/30 transition-all duration-500 hover:bg-navy-900/80"
            >
              <div className="text-gold-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                {point.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-cream-50 mb-3">
                {point.title}
              </h3>
              <p className="text-navy-300 text-sm leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
