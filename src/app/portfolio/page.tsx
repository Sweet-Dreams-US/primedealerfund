"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { dealerships, type Dealership } from "@/lib/dealerships";

export default function PortfolioPage() {
  const { ref, isInView } = useScrollAnimation();

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
            Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6"
          >
            Our <span className="text-gold-gradient">Dealership Portfolio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            Six franchise dealerships across Iowa, Indiana, and Ohio.
            Each location is selected for its market position and growth potential.
          </motion.p>
        </div>
      </section>

      <GoldDivider />

      {/* Full-width dealership rows */}
      <section className="py-8 md:py-12">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {dealerships.map((d, i) => (
            <motion.div key={d.slug} variants={staggerItem}>
              <Link
                href={`/portfolio/${d.slug}`}
                className="group relative block w-full overflow-hidden"
              >
                {/* Full-width image row */}
                <div
                  className={`relative w-full ${
                    i === 0 ? "h-[50vh] md:h-[70vh]" : "h-[40vh] md:h-[55vh]"
                  }`}
                >
                  {d.heroImage ? (
                    <Image
                      src={d.heroImage}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                      sizes="100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d44] to-[#1a1a2e] flex items-center justify-center">
                      <span className="font-display text-5xl md:text-7xl text-[#3d4355] tracking-widest">
                        {d.name.split(" ")[0]}
                      </span>
                    </div>
                  )}

                  {/* Dark overlay — lifts on hover */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />

                  {/* Bottom gradient for text */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Content overlay — bottom left */}
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 lg:p-16 z-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-xs font-mono tracking-widest uppercase text-green-400">
                            {d.status}
                          </span>
                          <span className="text-white/30">|</span>
                          <span className="text-xs font-mono tracking-wider text-white/60">
                            {d.location}
                          </span>
                        </div>

                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide mb-3 group-hover:text-gold-300 transition-colors duration-500">
                          {d.name}
                        </h2>

                        <div className="flex flex-wrap gap-2">
                          {d.brands.map((brand) => (
                            <span
                              key={brand}
                              className="px-3 py-1 text-xs font-mono tracking-wider text-white/80 bg-white/10 backdrop-blur-sm rounded-full border border-white/10"
                            >
                              {brand}
                            </span>
                          ))}
                        </div>
                        {d.disclaimer && (
                          <p className="text-white/50 text-xs italic mt-3">
                            {d.disclaimer}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center gap-2 text-white/50 group-hover:text-gold-400 transition-colors duration-500">
                        <span className="text-sm font-mono tracking-wider hidden md:inline">
                          View Dealership
                        </span>
                        <div className="w-10 h-10 rounded-full border border-white/20 group-hover:border-gold-400/50 flex items-center justify-center group-hover:translate-x-1 transition-all duration-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-24 md:py-32 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mb-6">
            Invest in the Portfolio
          </h2>
          <p className="text-navy-300 mb-8">
            Request detailed fund performance data and portfolio metrics.
          </p>
          <MagneticButton href="/contact" variant="primary" size="lg">
            Request Portfolio Details
          </MagneticButton>
        </div>
      </section>
    </PageLayout>
  );
}
