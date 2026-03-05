"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import { fadeInUp } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "Investment",
    question: "What is the minimum investment?",
    answer: "The minimum investment in Prime Dealer Equity Fund is $100,000. This threshold ensures our investor base consists of qualified, accredited investors who understand alternative investments.",
  },
  {
    category: "Investment",
    question: "What are the target returns?",
    answer: "We target a net IRR of 21-31%, targeting an 8% annual distribution to investors. Returns are generated through operational improvements, equity appreciation, and strategic exits. Past performance is not indicative of future results.",
  },
  {
    category: "Investment",
    question: "How long is the investment term?",
    answer: "The fund has a 10-year term with the option for two 1-year extensions. This timeline allows us to acquire, optimize, and exit dealerships at optimal valuations.",
  },
  {
    category: "Investment",
    question: "What is the fund structure?",
    answer: "Prime Dealer Equity Fund is structured as a Delaware limited partnership. The General Partner manages all fund operations, acquisitions, and dealership management. Limited Partners are passive investors who receive annual distributions and annual reporting.",
  },
  {
    category: "Eligibility",
    question: "Who can invest?",
    answer: "Investments are available only to accredited investors as defined by SEC Rule 501 of Regulation D. Generally, this means individuals with $1M+ net worth (excluding primary residence) or $200K+ annual income ($300K+ with spouse) for the last two years.",
  },
  {
    category: "Eligibility",
    question: "How do I verify accredited investor status?",
    answer: "We work with a third-party verification service to confirm accredited investor status. This can be done through income verification, net worth verification, or professional certification (e.g., Series 7, Series 65, or CFA).",
  },
  {
    category: "Operations",
    question: "How do you select dealerships to acquire?",
    answer: "We target underperforming franchise dealerships in growing southeastern U.S. markets. Key criteria include strong franchise brands (Big 7 OEMs), below-average performance metrics, favorable real estate, and cooperative manufacturer relationships.",
  },
  {
    category: "Operations",
    question: "What is the 90-Day Turnaround?",
    answer: "Our proprietary methodology for transforming underperforming dealerships. In the first 90 days post-acquisition, we implement operational improvements across all seven profit centers: new vehicle sales, used vehicle sales, F&I, service, parts, body shop (some locations), and fleet.",
  },
  {
    category: "Operations",
    question: "Who manages the dealerships?",
    answer: "Our team manages all dealership operations directly. Kyle Coleman and the operating team have hands-on experience running franchise dealerships and are actively involved in day-to-day management and strategic decisions.",
  },
  {
    category: "Reporting",
    question: "How often will I receive updates?",
    answer: "Investors receive quarterly financial reports including P&L statements, portfolio performance metrics, and market commentary. Annual reports include audited financials and tax documentation (K-1s).",
  },
  {
    category: "Reporting",
    question: "When are distributions paid?",
    answer: "Distributions are paid annually, subject to available cash flow and GP discretion, targeting an 8% annual distribution.",
  },
  {
    category: "Legal",
    question: "What are the risks?",
    answer: "All investments carry risk, including potential loss of principal. Key risks include economic downturns affecting vehicle sales, OEM relationship changes, interest rate fluctuations, regulatory changes, and the illiquid nature of the investment. Full risk disclosures are provided in the offering documents.",
  },
];

const categories = Array.from(new Set(faqs.map((f) => f.category)));

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-navy-800/50">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className={`font-display text-lg pr-8 transition-colors ${isOpen ? "text-gold-400" : "text-cream-100 group-hover:text-cream-50"}`}>
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gold-400 text-2xl shrink-0"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-navy-300 text-sm leading-relaxed pb-5 pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { ref, isInView } = useScrollAnimation();

  const filtered = faqs.filter((faq) => {
    const matchesSearch =
      search === "" ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
            FAQ
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6"
          >
            Frequently Asked <span className="text-gold-gradient">Questions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to know about investing with Prime Dealer Equity Fund.
          </motion.p>
        </div>
      </section>

      <GoldDivider />

      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-900/50 border border-navy-800/50 rounded-xl px-5 py-4 text-cream-100 placeholder:text-navy-600 focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-all duration-300"
            />
          </motion.div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-mono tracking-wider transition-all ${
                activeCategory === "all"
                  ? "bg-gold-400 text-[#1a1a2e]"
                  : "bg-navy-900/50 text-navy-400 hover:text-cream-100"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-mono tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-gold-400 text-[#1a1a2e]"
                    : "bg-navy-900/50 text-navy-400 hover:text-cream-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            {filtered.length === 0 ? (
              <p className="text-navy-500 text-center py-8">
                No questions match your search. Try a different term or{" "}
                <a href="/contact" className="text-gold-400 hover:underline">
                  contact us directly
                </a>
                .
              </p>
            ) : (
              filtered.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-navy-900/30 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-navy-300 mb-8">
            Our investor relations team is happy to answer any additional questions.
          </p>
          <MagneticButton href="/contact" variant="primary" size="lg">
            Contact Our Team
          </MagneticButton>
        </div>
      </section>
    </PageLayout>
  );
}
