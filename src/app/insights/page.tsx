"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { blogPosts } from "@/lib/blog-data";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  heroImage?: string;
  author?: string;
}

/* Build the combined article list — rich blog posts first, then legacy */
const legacyArticles: Article[] = [
  {
    slug: "why-auto-dealerships-are-the-next-frontier",
    title: "Why Auto Dealerships Are the Next Frontier in Private Equity",
    excerpt:
      "The automotive retail industry represents a $1.2 trillion opportunity that institutional capital is only beginning to discover. Here\u2019s why smart money is moving in.",
    category: "Market Analysis",
    date: "January 2025",
    readTime: "8 min read",
  },
  {
    slug: "90-day-turnaround-methodology",
    title:
      "The 90-Day Turnaround: How We Transform Underperforming Dealerships",
    excerpt:
      "Our proprietary methodology for turning bottom-quartile dealerships into top-decile performers. A deep dive into the operational playbook.",
    category: "Operations",
    date: "December 2024",
    readTime: "12 min read",
  },
];

const allArticles: Article[] = [
  ...blogPosts.map((bp) => ({
    slug: bp.slug,
    title: bp.title,
    excerpt: bp.excerpt,
    category: bp.category,
    date: bp.date,
    readTime: bp.readTime,
    heroImage: bp.heroImage.src,
    author: bp.author,
  })),
  ...legacyArticles,
];

const categories = [
  "All",
  ...Array.from(new Set(allArticles.map((a) => a.category))),
];

export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? allArticles
      : allArticles.filter((a) => a.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

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
            Insights
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6"
          >
            Market <span className="text-gold-gradient">Intelligence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            Analysis, insights, and perspectives on automotive retail investing
            from our team of operators and strategists.
          </motion.p>
        </div>
      </section>

      <GoldDivider />

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-12">
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

          {/* Featured article — large card with hero image */}
          {featured && featured.heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Link
                href={`/insights/${featured.slug}`}
                className="group block rounded-2xl overflow-hidden bg-navy-900/50 border border-navy-800/50 hover:border-gold-400/30 transition-all duration-500"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto lg:min-h-[360px]">
                    <Image
                      src={featured.heroImage}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-gold-400 font-mono text-xs tracking-wider uppercase">
                        {featured.category}
                      </span>
                      <span className="text-navy-700">&middot;</span>
                      <span className="text-navy-500 text-xs">
                        {featured.readTime}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-cream-50 mb-4 group-hover:text-gold-400 transition-colors leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-navy-400 text-sm leading-relaxed mb-4">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      {featured.author && (
                        <span className="text-cream-200 text-xs font-medium">
                          {featured.author}
                        </span>
                      )}
                      <span className="text-navy-600 text-xs">
                        {featured.date}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Article Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {(featured?.heroImage ? rest : filtered).map((article) => (
                <motion.div
                  key={article.slug}
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Link
                    href={`/insights/${article.slug}`}
                    className="block group rounded-2xl bg-navy-900/50 border border-navy-800/50 hover:border-gold-400/30 transition-all duration-500 h-full overflow-hidden"
                  >
                    {article.heroImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.heroImage}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-gold-400 font-mono text-xs tracking-wider uppercase">
                          {article.category}
                        </span>
                        <span className="text-navy-700">&middot;</span>
                        <span className="text-navy-500 text-xs">
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-cream-50 mb-3 group-hover:text-gold-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-navy-400 text-sm leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3">
                        {article.author && (
                          <span className="text-cream-200 text-xs font-medium">
                            {article.author}
                          </span>
                        )}
                        <span className="text-navy-500 text-xs">
                          {article.date}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
