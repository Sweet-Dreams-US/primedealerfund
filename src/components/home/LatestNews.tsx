"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Featured announcement block — surfaces the latest acquisition press release
 * paired with its YouTube announcement video. Sits high on the homepage so
 * visitors see the most recent platform news immediately after the hero.
 */
export default function LatestNews() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-navy-950/40 border-y border-navy-800/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center"
        >
          {/* Video */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-navy-800/50 shadow-2xl shadow-black/30">
            <iframe
              src="https://www.youtube.com/embed/mi7M95pYGNM?rel=0"
              title="Coleman Prime Acquires Nissan of Elgin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Press release card */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 text-gold-400 font-mono text-[10px] tracking-[0.25em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                Latest Press Release
              </span>
              <span className="text-navy-700">&middot;</span>
              <span className="text-navy-500 text-xs font-mono tracking-wider">
                May 1, 2026
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-cream-50 leading-tight tracking-tight mb-5">
              Coleman Prime Acquires Nissan of Elgin
            </h2>

            <p className="text-navy-300 text-base leading-relaxed mb-6">
              Five dealerships in twelve months. The platform&apos;s first
              store in the Chicago metro pushes annualized revenue past
              <span className="text-cream-100 font-medium"> $200 million</span>
              {" "}and marks the third Nissan rooftop in the Coleman Prime
              portfolio.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/insights/nissan-of-elgin-acquisition-press-release"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gold-400 text-[#1a1a2e] font-mono text-sm tracking-wider font-semibold hover:bg-gold-300 transition-colors"
              >
                Read the Announcement
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
              </Link>
              <Link
                href="/portfolio/nissan-elgin"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-navy-700 text-cream-100 font-mono text-sm tracking-wider hover:border-gold-400/50 hover:text-gold-400 transition-colors"
              >
                View Dealership
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
