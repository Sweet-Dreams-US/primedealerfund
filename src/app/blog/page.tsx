import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import { SITE_URL, formatReleaseDate, getReleasedPosts } from "@/lib/blog";

// Hourly, so a post appears on its release date without a deploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Plain English articles on how auto dealerships work and how automotive retail makes money, from Prime Dealer Equity Fund.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: { "application/rss+xml": `${SITE_URL}/blog/feed.xml` },
  },
  openGraph: {
    title: "Blog | Prime Dealer Equity Fund",
    description:
      "Plain English articles on how auto dealerships work and how automotive retail makes money.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getReleasedPosts();

  return (
    <PageLayout>
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block text-gold-400 font-mono text-sm tracking-[0.2em] uppercase mb-6">
            Blog
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6">
            Auto Retail, <span className="text-gold-gradient">Explained</span>
          </h1>
          <p className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed">
            Plain English articles on how auto dealerships work and how automotive retail makes
            money, one topic at a time.
          </p>
        </div>
      </section>

      <GoldDivider />

      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="rounded-2xl bg-navy-900/50 border border-navy-800/50 p-10 text-center">
              <p className="font-display text-2xl text-cream-50 mb-2">No articles yet</p>
              <p className="text-navy-400 text-sm">New articles will appear here on their release dates.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-navy-900/50 border border-navy-800/50 hover:border-gold-400/30 transition-all duration-500"
                  >
                    {post.coverImage && (
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <p className="flex items-center gap-3 mb-3 text-gold-500 font-mono text-xs tracking-wider uppercase">
                        <time dateTime={post.releaseOn}>{formatReleaseDate(post.releaseOn)}</time>
                        <span className="text-navy-600" aria-hidden="true">
                          &middot;
                        </span>
                        <span>{post.readingMinutes} min read</span>
                      </p>
                      <h2 className="font-display text-xl md:text-2xl font-semibold text-cream-50 leading-snug mb-3 group-hover:text-gold-500 transition-colors">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p className="text-navy-400 text-sm leading-relaxed mb-4">{post.description}</p>
                      )}
                      <span className="mt-auto inline-flex items-center gap-2 text-gold-600 font-mono text-xs tracking-wider uppercase">
                        Read the article
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
