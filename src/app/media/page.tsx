"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const primeDealerPodcast = [
  {
    title: "Episode 1: The Prime Dealer Fund Thesis",
    tag: "Episode 1",
    description:
      "Kyle Coleman introduces the fund, the automotive retail opportunity, and why franchise dealerships are the most overlooked asset class in private equity.",
    embedId: "gdaCqwucYys",
  },
  {
    title: "Episode 2: Inside the Acquisition Playbook",
    tag: "Episode 2",
    description:
      "A deep dive into how Coleman Automotive evaluates, acquires, and transforms underperforming dealerships into top-performing assets.",
    embedId: "9y6EHjpb4Fg",
  },
];

const podcasts = [
  {
    title: "Podcast Episode 1",
    embedId: "_S9KY1dk-_4",
  },
  {
    title: "Podcast Episode 2",
    embedId: "IdQtd72ipzs",
  },
  {
    title: "Podcast Episode 3",
    embedId: "IocrK4o65kI",
  },
];

const videos = [
  {
    title: "Prime Dealer Equity Fund Thesis",
    tag: "Fund Overview",
    description:
      "The core thesis behind the fund — why franchise dealerships, how we structure capital, and the returns we target.",
    embedId: "mGkuIhzrqBk",
  },
  {
    title: "Vision & Governance",
    tag: "Leadership",
    description:
      "Our long-term vision for the fund and the governance framework that protects investor interests.",
    embedId: "b86dElfEtvw",
  },
  {
    title: "How We Transform Dealerships",
    tag: "Operations",
    description:
      "Inside our operational playbook — what happens after we acquire a dealership and how we drive performance.",
    embedId: "P2rzZSi8vZg",
  },
  {
    title: "Investor Pitch",
    tag: "Investment",
    description:
      "A direct overview of the opportunity, target returns, and why this fund exists for accredited investors.",
    embedId: "rr7KEoxSGyU",
  },
  {
    title: "The 90 Day Playbook",
    tag: "Execution",
    description:
      "How we integrate a new acquisition in the first 90 days — from staffing to inventory to profit optimization.",
    embedId: "LsqwEj4oLJk",
  },
];

export default function MediaPage() {
  const [activeVideo, setActiveVideo] = useState(videos[0]);
  const { ref, isInView } = useScrollAnimation();

  return (
    <PageLayout>
      {/* Hero header */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-gold-400 font-mono text-sm tracking-[0.2em] uppercase mb-6"
          >
            Media
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6"
          >
            Video <span className="text-gold-gradient">Library</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to know about the fund — strategy, operations,
            governance, and the investment opportunity.
          </motion.p>
        </div>
      </section>

      <GoldDivider />

      {/* Featured player + sidebar selector */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6"
          >
            {/* Main player */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVideo.embedId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/10"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.embedId}?rel=0`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Now playing info */}
              <motion.div
                key={activeVideo.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-6"
              >
                <span className="text-gold-400 font-mono text-xs tracking-[0.15em] uppercase">
                  Now Playing
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-cream-50 mt-1 mb-2">
                  {activeVideo.title}
                </h2>
                <p className="text-navy-400 leading-relaxed max-w-2xl">
                  {activeVideo.description}
                </p>
              </motion.div>
            </div>

            {/* Playlist sidebar */}
            <div className="lg:border-l lg:border-navy-800/50 lg:pl-6">
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-navy-400 mb-4">
                All Videos
              </h3>
              <div className="flex flex-col gap-2">
                {videos.map((v, i) => {
                  const isActive = v.embedId === activeVideo.embedId;
                  return (
                    <button
                      key={v.embedId}
                      onClick={() => setActiveVideo(v)}
                      className={`group relative text-left p-4 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gold-400/10 border border-gold-400/30"
                          : "bg-navy-900/30 border border-transparent hover:bg-navy-900/60 hover:border-navy-800/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Number */}
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono ${
                            isActive
                              ? "bg-gold-400 text-[#1a1a2e] font-bold"
                              : "bg-navy-800/50 text-navy-400"
                          }`}
                        >
                          {i + 1}
                        </span>

                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-[10px] font-mono tracking-widest uppercase ${
                              isActive ? "text-gold-400" : "text-navy-500"
                            }`}
                          >
                            {v.tag}
                          </span>
                          <h4
                            className={`font-display text-sm font-semibold leading-tight mt-0.5 ${
                              isActive ? "text-cream-50" : "text-navy-300 group-hover:text-cream-50"
                            } transition-colors`}
                          >
                            {v.title}
                          </h4>
                        </div>

                        {/* Playing indicator */}
                        {isActive && (
                          <div className="flex-shrink-0 flex items-center gap-0.5 mt-2">
                            <span className="w-0.5 h-3 bg-gold-400 rounded-full animate-pulse" />
                            <span className="w-0.5 h-4 bg-gold-400 rounded-full animate-pulse [animation-delay:150ms]" />
                            <span className="w-0.5 h-2 bg-gold-400 rounded-full animate-pulse [animation-delay:300ms]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid below — all videos at a glance */}
      <section className="py-16 md:py-24 bg-navy-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="font-display text-2xl font-bold text-cream-50 mb-2">
            Browse All
          </h3>
          <p className="text-navy-400 text-sm mb-8">
            Jump to any video directly.
          </p>

          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {videos.map((v) => (
              <motion.button
                key={v.embedId}
                variants={staggerItem}
                onClick={() => {
                  setActiveVideo(v);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group relative rounded-xl overflow-hidden text-left"
              >
                {/* YouTube thumbnail */}
                <div className="relative aspect-video bg-navy-950/50 overflow-hidden rounded-xl">
                  <img
                    src={`https://img.youtube.com/vi/${v.embedId}/mqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-4 h-4 text-[#1a1a2e] ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400">
                    {v.tag}
                  </span>
                  <h4 className="font-display text-sm font-semibold text-cream-50 leading-tight mt-0.5 group-hover:text-gold-400 transition-colors">
                    {v.title}
                  </h4>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Prime Dealer Podcast */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-gold-400 font-mono text-xs tracking-[0.15em] uppercase">
              Prime Dealer Podcast
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mt-2 mb-2">
              Our <span className="text-gold-gradient">Podcast</span>
            </h3>
            <p className="text-navy-400 max-w-xl">
              Straight from the operators. Kyle Coleman and the team break down
              dealership acquisitions, fund strategy, and what it really takes
              to build an automotive portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {primeDealerPodcast.map((ep) => (
              <div
                key={ep.embedId}
                className="rounded-2xl overflow-hidden bg-navy-900/30 border border-navy-800/30"
              >
                <div className="relative w-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${ep.embedId}?rel=0`}
                    title={ep.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <span className="text-gold-400 font-mono text-[10px] tracking-widest uppercase">
                    {ep.tag}
                  </span>
                  <h4 className="font-display text-sm font-semibold text-cream-50 mt-1">
                    {ep.title}
                  </h4>
                  {ep.description && (
                    <p className="text-navy-400 text-xs mt-1 leading-relaxed">
                      {ep.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Appearances */}
      <section className="py-16 md:py-24 bg-navy-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-gold-400 font-mono text-xs tracking-[0.15em] uppercase">
              Featured Appearances
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mt-2 mb-2">
              As Seen On
            </h3>
            <p className="text-navy-400 max-w-xl">
              Kyle Coleman and the team featured on industry-leading podcasts
              and shows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {podcasts.map((p) => (
              <div key={p.embedId} className="rounded-2xl overflow-hidden bg-navy-900/30 border border-navy-800/30">
                <div className="relative w-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${p.embedId}?rel=0`}
                    title={p.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-display text-sm font-semibold text-cream-50">
                    {p.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
