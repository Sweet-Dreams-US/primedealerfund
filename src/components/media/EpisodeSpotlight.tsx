"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import PodcastDisclaimer from "@/components/legal/PodcastDisclaimer";
import { featuredEpisode, type EpisodePlatform } from "@/lib/featured-episode";

/** Brand glyphs for the listen-on links. */
function PlatformIcon({ id }: { id: EpisodePlatform["id"] }) {
  const cls = "w-4 h-4 shrink-0";

  if (id === "youtube") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3 3 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3 3 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.14c.5-1.87.5-5.8.5-5.8s0-3.93-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
      </svg>
    );
  }

  if (id === "spotify") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0Zm5.5 17.3c-.2.4-.7.5-1 .3-2.8-1.7-6.4-2.1-10.6-1.1-.4.1-.8-.2-.9-.5-.1-.4.2-.8.5-.9 4.6-1 8.5-.6 11.7 1.3.3.2.4.6.3.9Zm1.5-3.3c-.3.4-.8.6-1.2.3-3.2-2-8.2-2.6-12-1.4-.5.1-1-.1-1.1-.6-.1-.5.1-1 .6-1.1 4.4-1.3 9.8-.7 13.5 1.6.4.2.5.8.2 1.2Zm.1-3.4C15.2 8.5 8.8 8.2 5.1 9.4c-.6.2-1.2-.2-1.4-.7-.2-.6.2-1.2.7-1.4 4.3-1.3 11.3-1 15.7 1.6.5.3.7 1 .4 1.6-.3.4-1 .6-1.4.2Z" />
      </svg>
    );
  }

  if (id === "apple") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 15a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v7a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V22h2v-3.07A7 7 0 0 0 19 12h-2Z" />
      </svg>
    );
  }

  return (
    <svg
      className={cls}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H18v4.5M17.5 6.5 10 14M15 13.5V18H6V9h4.5"
      />
    </svg>
  );
}

/**
 * Featured external podcast appearance — the fund's leadership on someone
 * else's show. Rendered at the top of the homepage content and again at the
 * top of /media, both driven by lib/featured-episode.ts.
 *
 * showDisclaimer defaults on because the homepage carries no page-level
 * disclosure. /media already renders the full PodcastDisclaimer card above
 * this section, so it passes false rather than repeat it.
 */
export default function EpisodeSpotlight({
  showDisclaimer = true,
}: {
  showDisclaimer?: boolean;
}) {
  const { ref, isInView } = useScrollAnimation();
  const ep = featuredEpisode;
  const [primary, ...rest] = ep.platforms;

  return (
    <section className="py-14 md:py-20 bg-navy-950/50 border-b border-navy-800/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center"
        >
          {/* Episode meta */}
          <div className="order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
              <span className="inline-flex items-center gap-2 text-gold-400 font-mono text-[10px] tracking-[0.25em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                New Episode
              </span>
              <span className="text-navy-700">&middot;</span>
              <span className="text-navy-400 text-xs font-mono tracking-wider">
                {ep.show} w/ {ep.host}
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold text-cream-50 leading-tight tracking-tight mb-3">
              {ep.title}
            </h2>

            <p className="text-navy-500 text-xs font-mono tracking-wider mb-5">
              {ep.guests} &middot; {ep.dateLabel} &middot; {ep.duration}
            </p>

            <p className="text-navy-300 text-base leading-relaxed mb-5">
              {ep.blurb}
            </p>

            {/* What they covered */}
            <ul className="flex flex-wrap gap-2 mb-6">
              {ep.topics.map((t) => (
                <li
                  key={t}
                  className="px-2.5 py-1 rounded-md border border-navy-800/70 bg-navy-900/40 text-navy-400 text-[11px] font-mono tracking-wide"
                >
                  {t}
                </li>
              ))}
            </ul>

            {/* Listen / watch links */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-400 text-[#1a1a2e] font-mono text-sm tracking-wider font-semibold hover:bg-gold-300 transition-colors"
              >
                <PlatformIcon id={primary.id} />
                Watch on {primary.label}
              </a>
              {rest.map((p) => (
                <a
                  key={p.id}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-navy-700 text-cream-100 font-mono text-sm tracking-wider hover:border-gold-400/50 hover:text-gold-400 transition-colors"
                >
                  <PlatformIcon id={p.id} />
                  {p.label}
                </a>
              ))}
            </div>
          </div>

          {/* Player */}
          <div className="order-1 lg:order-2">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-navy-800/50 shadow-2xl shadow-black/30">
              <iframe
                src={`https://www.youtube.com/embed/${ep.embedId}?rel=0`}
                title={`${ep.show} — ${ep.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </motion.div>

        {showDisclaimer && <PodcastDisclaimer variant="compact" />}
      </div>
    </section>
  );
}
