"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function CalendarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

/**
 * Persistent "Schedule a Call" affordance — booking is the highest-value
 * conversion on the site, so it follows the visitor down the page.
 *
 * Two presentations from one component (mounted in PageLayout + the homepage,
 * so this is sitewide):
 *   Desktop (lg+)  — a floating pill in the bottom-right corner.
 *   Mobile (<lg)   — a full-width sticky bar pinned to the bottom, which is
 *                    the only always-reachable booking entry point on a phone.
 *
 * Hidden on /schedule itself, where it would just point at the current page.
 */
export default function FloatingCTA() {
  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't compete with the page the CTA points to.
  if (pathname === "/schedule") return null;

  // Mobile reveals earlier — the hero is shorter in view on a phone, so a
  // visitor is "past the fold" and ready for a CTA sooner than on desktop.
  const showDesktop = scrollY > 600;
  const showMobile = scrollY > 300;

  return (
    <>
      {/* Desktop floating pill */}
      <AnimatePresence>
        {showDesktop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block fixed bottom-6 right-6 z-40"
          >
            <Link
              href="/schedule"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-[#1a1a2e] font-display font-semibold text-sm rounded-full shadow-xl shadow-gold-500/30 hover:shadow-gold-500/50 hover:scale-105 transition-all duration-300"
            >
              <CalendarIcon />
              Schedule a Call
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky bar */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-3 bg-[#1a1a2e]/95 backdrop-blur-md border-t border-white/10"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            <Link
              href="/schedule"
              className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-gradient-to-r from-gold-500 to-gold-400 text-[#1a1a2e] font-display font-semibold text-base rounded-xl shadow-lg shadow-gold-500/20 active:scale-[0.98] transition-transform"
            >
              <CalendarIcon className="w-5 h-5" />
              Schedule a Call
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
