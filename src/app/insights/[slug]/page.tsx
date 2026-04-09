"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  CalloutNumbers,
  CalloutPrime,
  CalloutFloor,
} from "@/components/blog/CalloutBox";
import BlogCTA from "@/components/blog/BlogCTA";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { getBlogPost, blogPosts, type ContentBlock } from "@/lib/blog-data";

/* ---------- Legacy articles (simple paragraph format) ---------- */
const legacyArticles: Record<
  string,
  {
    title: string;
    category: string;
    date: string;
    readTime: string;
    content: string[];
  }
> = {
  "why-auto-dealerships-are-the-next-frontier": {
    title: "Why Auto Dealerships Are the Next Frontier in Private Equity",
    category: "Market Analysis",
    date: "January 2025",
    readTime: "8 min read",
    content: [
      "The U.S. automotive retail industry generates over $1.2 trillion in annual revenue, yet remains remarkably fragmented. The top 10 dealer groups control less than 10% of the market \u2014 a level of fragmentation that would be unthinkable in most industries of this scale.",
      "This fragmentation creates an extraordinary opportunity for well-capitalized, operationally savvy investors. Unlike technology or healthcare, where consolidation has been driven by massive PE firms for decades, automotive retail has largely been overlooked by institutional capital.",
      "Why? Historically, dealerships were family-run businesses passed down through generations. The expertise required to operate them \u2014 managing OEM relationships, floor plan financing, service operations, and complex F&I products \u2014 created a barrier to entry that kept financial buyers at bay.",
      "That\u2019s changing. A new generation of operator-investors is emerging, combining deep automotive expertise with institutional capital management. The result is a playbook for acquiring underperforming dealerships, implementing operational improvements, and generating consistent returns.",
      "The economics are compelling. Franchise dealerships operate seven distinct profit centers: new vehicle sales, used vehicle sales, finance & insurance, service, parts, body shop (some locations), and fleet. This diversification provides natural resilience \u2014 when new car sales slow, service and used vehicle departments typically strengthen.",
      "Add to this the hard asset backing (real estate, inventory, franchise rights), territorial exclusivity from OEM franchise agreements, and recession-resistant demand (Americans need vehicles regardless of economic cycles), and you have an asset class that deserves serious attention from sophisticated investors.",
    ],
  },
  "90-day-turnaround-methodology": {
    title:
      "The 90-Day Turnaround: How We Transform Underperforming Dealerships",
    category: "Operations",
    date: "December 2024",
    readTime: "12 min read",
    content: [
      "Every dealership acquisition begins with the same question: How quickly can we transform this underperforming operation into a market leader? At Coleman Prime, the answer is 90 days.",
      "Our methodology isn\u2019t theoretical \u2014 it was developed through hands-on experience acquiring and turning around franchise dealerships across the southeastern United States. The playbook is battle-tested and repeatable.",
      "Days 1-7: The Assessment Phase. Before we change anything, we listen and learn. Our team conducts a comprehensive operational audit covering every department, every process, every metric. We interview key staff, analyze historical financials, and benchmark performance against top-performing dealers in the same brand and market.",
      "Days 8-30: Quick Wins. Armed with data, we implement immediate high-impact improvements. This typically includes inventory right-sizing, pricing strategy optimization, digital marketing overhaul, and process standardization across departments. These changes often produce visible results within weeks.",
      "Days 31-60: The Transformation. This is where the real work happens. We restructure compensation plans to align incentives, implement comprehensive training programs, overhaul the F&I product menu, expand service department capacity, and upgrade the customer experience from first contact to delivery.",
      "Days 61-90: Optimization and Sustainment. With new systems in place, we focus on fine-tuning performance, establishing KPI dashboards for real-time management, and building the culture of accountability and excellence that sustains results long-term.",
    ],
  },
};

/* ---------- Helpers ---------- */
function toId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getSubheadings(content: ContentBlock[]) {
  return content
    .filter((b): b is ContentBlock & { type: "subheading" } => b.type === "subheading")
    .map((b) => ({ id: toId(b.text), text: b.text }));
}

/* ---------- Scroll-tracking hook ---------- */
function useActiveHeading(headings: { id: string; text: string }[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) current = h.id;
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return activeId;
}

/* ---------- Desktop TOC sidebar ---------- */
function DesktopTOC({ headings, activeId }: { headings: { id: string; text: string }[]; activeId: string }) {
  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-24 self-start" aria-label="Table of contents">
      <p className="text-gold-400 font-mono text-[10px] tracking-[0.2em] uppercase mb-4">
        In This Article
      </p>
      <ul className="space-y-2 border-l border-navy-800/50">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`block pl-4 py-1 text-sm leading-snug transition-all duration-200 border-l-2 -ml-px ${
                activeId === h.id
                  ? "border-gold-400 text-cream-50"
                  : "border-transparent text-navy-500 hover:text-navy-300"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- Mobile TOC bottom bar ---------- */
function MobileTOC({ headings, activeId }: { headings: { id: string; text: string }[]; activeId: string }) {
  if (headings.length === 0) return null;

  return (
    <AnimatePresence>
      {activeId && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#1a1a2e]/90 backdrop-blur-md border-t border-navy-800/50 px-4 py-2.5"
        >
          <p className="text-[11px] text-navy-500 font-mono tracking-wider uppercase">
            Reading
          </p>
          <p className="text-cream-100 text-sm font-medium truncate">
            {headings.find((h) => h.id === activeId)?.text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Render a single content block ---------- */
function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-navy-300 leading-relaxed text-lg">{block.text}</p>
      );
    case "subheading":
      return (
        <h2
          id={toId(block.text)}
          className="font-display text-2xl md:text-3xl font-bold text-cream-50 mt-12 mb-4 scroll-mt-24"
        >
          {block.text}
        </h2>
      );
    case "image":
      return (
        <figure className="my-10">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          <figcaption className="text-navy-500 text-xs mt-3 italic">
            {block.caption}
          </figcaption>
        </figure>
      );
    case "callout-numbers":
      return (
        <CalloutNumbers
          title={block.title}
          lines={block.lines}
          link={block.link}
        />
      );
    case "callout-prime":
      return <CalloutPrime lines={block.lines} link={block.link} />;
    case "callout-floor":
      return (
        <CalloutFloor
          quote={block.quote}
          attribution={block.attribution}
          stats={block.stats}
          link={block.link}
        />
      );
  }
}

/* ---------- Rich blog post wrapper (needs hooks) ---------- */
function RichBlogPost({ blog }: { blog: NonNullable<ReturnType<typeof getBlogPost>> }) {
  const headings = getSubheadings(blog.content);
  const activeId = useActiveHeading(headings);

  const relatedPosts = blog.relatedSlugs
    .map((s) => {
      const bp = blogPosts.find((p) => p.slug === s);
      if (bp) return { slug: bp.slug, title: bp.title };
      const la = legacyArticles[s];
      if (la) return { slug: s, title: la.title };
      return null;
    })
    .filter(Boolean) as { slug: string; title: string }[];

  return (
    <PageLayout>
      {/* Hero image */}
      <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <Image
          src={blog.heroImage.src}
          alt={blog.heroImage.alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-8 md:p-16 z-10">
          <p className="text-navy-400 text-xs italic">
            {blog.heroImage.caption}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/insights"
              className="text-navy-400 hover:text-gold-400 transition-colors text-sm flex items-center gap-2"
            >
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
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Insights
            </Link>
          </motion.div>

          {/* Header block — full width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gold-400 font-mono text-xs tracking-wider uppercase">
                {blog.category}
              </span>
              <span className="text-navy-700">&middot;</span>
              <span className="text-navy-500 text-xs">{blog.readTime}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-50 tracking-tight mb-4 leading-tight">
              {blog.title}
            </h1>

            <p className="text-navy-300 text-lg mb-6">{blog.subtitle}</p>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-cream-200 text-sm font-medium">
                {blog.author}
              </span>
              <span className="text-navy-600 text-xs">
                {blog.authorRole}
              </span>
              <span className="text-navy-700">&middot;</span>
              <span className="text-navy-500 text-xs">{blog.date}</span>
            </div>
          </motion.div>

          <GoldDivider className="mb-12" />

          {/* Content + TOC grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
            {/* Content blocks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6 min-w-0"
            >
              {blog.content.map((block, i) => (
                <RenderBlock key={i} block={block} />
              ))}

              {/* CTA */}
              <BlogCTA />

              {/* Related posts */}
              <RelatedPosts posts={relatedPosts} />
            </motion.div>

            {/* Desktop TOC sidebar */}
            <DesktopTOC headings={headings} activeId={activeId} />
          </div>
        </div>
      </section>

      {/* Mobile TOC bar — outside the grid, at page level */}
      <MobileTOC headings={headings} activeId={activeId} />
    </PageLayout>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  /* Try rich blog first, then legacy, then placeholder */
  const blog = getBlogPost(slug);
  const legacy = legacyArticles[slug];

  /* ---- Rich blog post ---- */
  if (blog) {
    return <RichBlogPost blog={blog} />;
  }

  /* ---- Legacy article ---- */
  if (legacy) {
    return (
      <PageLayout>
        <section className="py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link
                href="/insights"
                className="text-navy-400 hover:text-gold-400 transition-colors text-sm flex items-center gap-2"
              >
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
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back to Insights
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gold-400 font-mono text-xs tracking-wider uppercase">
                  {legacy.category}
                </span>
                <span className="text-navy-700">&middot;</span>
                <span className="text-navy-500 text-xs">
                  {legacy.readTime}
                </span>
                <span className="text-navy-700">&middot;</span>
                <span className="text-navy-500 text-xs">{legacy.date}</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-50 tracking-tight mb-8 leading-tight">
                {legacy.title}
              </h1>
            </motion.div>

            <GoldDivider className="mb-12" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              {legacy.content.map((paragraph, i) => (
                <p key={i} className="text-navy-300 leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </motion.div>

            <div className="mt-16 p-8 rounded-2xl bg-navy-900/50 border border-navy-800/50 text-center">
              <h3 className="font-display text-xl font-semibold text-cream-50 mb-2">
                Interested in Learning More?
              </h3>
              <p className="text-navy-400 text-sm mb-6">
                Schedule a consultation to discuss how these insights apply to
                your investment goals.
              </p>
              <MagneticButton href="/contact" variant="primary">
                Request Consultation
              </MagneticButton>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  /* ---- Placeholder for articles not yet written ---- */
  return (
    <PageLayout>
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/insights"
              className="text-navy-400 hover:text-gold-400 transition-colors text-sm flex items-center gap-2"
            >
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
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Insights
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center py-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-50 tracking-tight mb-6">
              Article Coming Soon
            </h1>
            <p className="text-navy-300 text-lg mb-8">
              This article is being written. Check back soon for the full
              content.
            </p>
            <MagneticButton href="/insights" variant="outline">
              Browse Other Insights
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
