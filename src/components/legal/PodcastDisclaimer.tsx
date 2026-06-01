"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Inline disclaimer block placed adjacent to podcast/video embeds.
 *
 * SEC guidance for Reg D 506(c) marketing is that disclosures should be
 * "clear, conspicuous, and proximate to the marketing claim" — so this
 * component sits with the media itself, not just in the site footer.
 *
 * Layout: a short always-visible summary that doesn't overpower the page,
 * a toggle to expand counsel-authored full text inline, and a permanent
 * link to /disclosures (the canonical evergreen page that off-site YouTube
 * viewers can land on directly from the video description).
 *
 * The expanded long-form text reproduces Cassandra (Squire Patton Boggs)
 * verbatim — do not edit without going back through counsel.
 */
export default function PodcastDisclaimer({
  variant = "default",
}: {
  /**
   * "default" — full styled card with chevron toggle (use on /media page).
   * "compact" — single-line reference link (use under homepage videos
   *   where a full card would crowd the layout).
   */
  variant?: "default" | "compact";
}) {
  const [open, setOpen] = useState(false);

  if (variant === "compact") {
    return (
      <p className="text-xs text-navy-500 text-center mt-4 leading-relaxed">
        Informational only — not an offer to sell securities, not investment
        advice.{" "}
        <Link
          href="/disclosures#podcast"
          className="text-gold-400 hover:text-gold-300 underline-offset-2 hover:underline transition-colors"
        >
          View full disclosures
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-navy-800/40 bg-navy-950/40 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-gold-400 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-gold-400/90 mb-1.5">
            Important Disclosure
          </p>
          <p className="text-sm text-navy-300 leading-relaxed">
            These podcasts and videos are made available for{" "}
            <span className="text-cream-100">
              informational and marketing purposes only
            </span>{" "}
            and do not constitute a securities offering, investment advice, or
            an offer to sell any interest in the Prime Dealer Equity Fund. Past
            performance is not indicative of future results. Wherever there is
            the potential for profit there is also the possibility of loss.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cream-100 hover:text-gold-400 transition-colors"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              {open ? "Hide full text" : "Read full disclosure"}
            </button>
            <Link
              href="/disclosures"
              className="text-xs font-mono uppercase tracking-wider text-navy-400 hover:text-gold-400 transition-colors"
            >
              All fund disclosures →
            </Link>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-navy-800/40 space-y-4 text-[13px] text-navy-300 leading-relaxed">
                  <p>
                    The content of these podcasts expresses the views of its
                    participants as of the date indicated and may not represent
                    the views of the Prime Dealer Equity Fund, LLC (the
                    &ldquo;Fund&rdquo;) or if its manager, Prime Management
                    Partners LLC (the &ldquo;Fund Manager&rdquo;). Moreover,
                    such views are subject to change without notice and neither
                    the Fund nor the Fund Manager has a duty or obligation to
                    update the information contained herein. Further, neither
                    the Fund nor the Fund Manager makes any representation, and
                    it should not be assumed that past investment performance
                    is an indication of future results. Moreover, wherever
                    there is the potential for profit there is also the
                    possibility of loss.
                  </p>
                  <p>
                    This podcast is being made available for informational and
                    marketing purposes only and should not be used for any
                    other purpose. The information contained herein does not
                    constitute and should not be construed as an offering of
                    advisory services or investment advice in any jurisdiction.
                    Certain information contained herein concerning economic
                    trends and performance is based on or derived from
                    information provided by independent third-party sources.
                  </p>
                  <p>
                    Neither the Fund nor the Fund Manager can guarantee the
                    accuracy of the information in this podcast and has not
                    independently verified the accuracy or completeness of such
                    information or the assumptions on which such information
                    is based.
                  </p>
                  <p>
                    This podcast does not constitute a securities offering.
                    Potential investors in the Fund are provided a Confidential
                    Private Placement Memorandum and Agreements related to the
                    Fund. All such offering information should be reviewed
                    carefully and any potential investor should consult her
                    financial advisor before making an investment decision.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
