"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import { fadeInUp } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
}

export default function CalculatorPage() {
  const [investment, setInvestment] = useState(500000);
  const [holdPeriod, setHoldPeriod] = useState(5);
  const [annualReturn, setAnnualReturn] = useState(20);
  const { ref, isInView } = useScrollAnimation();

  const projections = useMemo(() => {
    const cashYield = 0.08;
    const appreciation = (annualReturn - 8) / 100;
    const years = [];
    let totalDistributions = 0;

    for (let y = 1; y <= holdPeriod; y++) {
      const annualDistribution = investment * cashYield;
      totalDistributions += annualDistribution;
      const equityValue = investment * Math.pow(1 + appreciation, y);
      years.push({
        year: y,
        distribution: annualDistribution,
        totalDistributions,
        equityValue,
        totalValue: totalDistributions + equityValue,
      });
    }

    return years;
  }, [investment, holdPeriod, annualReturn]);

  const finalProjection = projections[projections.length - 1];
  const totalReturn = finalProjection ? finalProjection.totalValue - investment : 0;
  const roi = finalProjection ? ((finalProjection.totalValue / investment - 1) * 100).toFixed(1) : "0";
  const multiple = finalProjection ? (finalProjection.totalValue / investment).toFixed(2) : "1.00";

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
            Investment Calculator
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6"
          >
            Model Your <span className="text-gold-gradient">Investment</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            Use our interactive calculator to project potential returns based on
            your investment amount and time horizon.
          </motion.p>
        </div>
      </section>

      <GoldDivider />

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Controls */}
            <motion.div
              ref={ref}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="p-8 md:p-12 rounded-2xl bg-navy-900/50 border border-navy-800/50 space-y-10"
            >
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm text-navy-400">Investment Amount</label>
                  <span className="text-gold-400 font-display font-semibold">
                    {formatCurrency(investment)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={10000000}
                  step={50000}
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
                />
                <div className="flex justify-between mt-1 text-xs text-navy-600">
                  <span>$100K</span>
                  <span>$10M</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm text-navy-400">Hold Period</label>
                  <span className="text-gold-400 font-display font-semibold">
                    {holdPeriod} Years
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={10}
                  step={1}
                  value={holdPeriod}
                  onChange={(e) => setHoldPeriod(Number(e.target.value))}
                  className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
                />
                <div className="flex justify-between mt-1 text-xs text-navy-600">
                  <span>3 Yrs</span>
                  <span>10 Yrs</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm text-navy-400">Target Annual Return</label>
                  <span className="text-gold-400 font-display font-semibold">
                    {annualReturn}%
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={30}
                  step={1}
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
                />
                <div className="flex justify-between mt-1 text-xs text-navy-600">
                  <span>12%</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="pt-6 border-t border-navy-800/50">
                <p className="text-navy-500 text-xs leading-relaxed">
                  This calculator is for illustrative purposes only and does not guarantee
                  any returns. Actual results may vary significantly. Past performance is
                  not indicative of future results.
                </p>
              </div>
            </motion.div>

            {/* Results */}
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800/50">
                  <p className="text-navy-500 text-xs font-mono tracking-wider uppercase mb-2">
                    Total Value
                  </p>
                  <p className="text-gold-400 font-display text-2xl md:text-3xl font-bold">
                    {finalProjection ? formatCurrency(finalProjection.totalValue) : "$0"}
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800/50">
                  <p className="text-navy-500 text-xs font-mono tracking-wider uppercase mb-2">
                    Total Return
                  </p>
                  <p className="text-green-400 font-display text-2xl md:text-3xl font-bold">
                    {formatCurrency(totalReturn)}
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800/50">
                  <p className="text-navy-500 text-xs font-mono tracking-wider uppercase mb-2">
                    ROI
                  </p>
                  <p className="text-cream-50 font-display text-2xl md:text-3xl font-bold">
                    {roi}%
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800/50">
                  <p className="text-navy-500 text-xs font-mono tracking-wider uppercase mb-2">
                    Multiple
                  </p>
                  <p className="text-cream-50 font-display text-2xl md:text-3xl font-bold">
                    {multiple}x
                  </p>
                </div>
              </div>

              {/* Year-by-Year */}
              <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800/50">
                <h3 className="font-display text-lg font-semibold text-cream-50 mb-4">
                  Year-by-Year Projection
                </h3>
                <div className="space-y-3">
                  {projections.map((p) => {
                    const barWidth = (p.totalValue / (finalProjection?.totalValue || 1)) * 100;
                    return (
                      <div key={p.year} className="flex items-center gap-4">
                        <span className="text-navy-500 font-mono text-xs w-8">Y{p.year}</span>
                        <div className="flex-1 h-6 bg-navy-800/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ duration: 0.8, delay: p.year * 0.1 }}
                            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                          />
                        </div>
                        <span className="text-cream-200 font-mono text-xs w-20 text-right">
                          {formatCurrency(p.totalValue)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comparison */}
              <div className="p-6 rounded-2xl bg-navy-900/50 border border-navy-800/50">
                <h3 className="font-display text-lg font-semibold text-cream-50 mb-4">
                  vs. Alternative Investments
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Prime Dealer Equity Fund", rate: annualReturn, color: "from-gold-600 to-gold-400" },
                    { label: "S&P 500 (Avg)", rate: 10, color: "from-navy-600 to-navy-500" },
                    { label: "Real Estate", rate: 8, color: "from-navy-600 to-navy-500" },
                    { label: "Bonds", rate: 4.5, color: "from-navy-600 to-navy-500" },
                  ].map((alt) => {
                    const altFinal = investment * Math.pow(1 + alt.rate / 100, holdPeriod);
                    const maxVal = investment * Math.pow(1 + annualReturn / 100, holdPeriod);
                    const width = (altFinal / maxVal) * 100;
                    return (
                      <div key={alt.label} className="flex items-center gap-4">
                        <span className="text-navy-400 text-xs w-36 shrink-0">{alt.label}</span>
                        <div className="flex-1 h-5 bg-navy-800/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${alt.color} rounded-full transition-all duration-500`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <span className="text-cream-200 font-mono text-xs w-20 text-right">
                          {formatCurrency(altFinal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-navy-900/30 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mb-6">
            Ready to Make It Real?
          </h2>
          <p className="text-navy-300 mb-8">
            Connect with our team to discuss how these projections map to your portfolio goals.
          </p>
          <MagneticButton href="/contact" variant="primary" size="lg">
            Schedule Consultation
          </MagneticButton>
        </div>
      </section>
    </PageLayout>
  );
}
