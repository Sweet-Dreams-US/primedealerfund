import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import BlogContents from "@/components/blog/BlogContents";
import { Note, Tip } from "@/components/blog/Callout";
import {
  SITE_URL,
  formatReleaseDate,
  getReleasedPost,
  getReleasedPosts,
  postUrl,
  renderPost,
} from "@/lib/blog";

// Hourly, so a post appears on its release date without a deploy. Only
// released posts are prebuilt; any other slug is checked at request time and
// is a 404 until its date.
export const revalidate = 3600;

const LOGO =
  "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getReleasedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getReleasedPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: postUrl(post.slug) },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl(post.slug),
      type: "article",
      publishedTime: post.releaseOn,
      ...(post.coverImage
        ? { images: [post.coverImage.startsWith("/") ? `${SITE_URL}${post.coverImage}` : post.coverImage] }
        : {}),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getReleasedPost(slug);
  if (!post) notFound();

  const { headings, segments } = renderPost(post);
  const image = post.coverImage
    ? post.coverImage.startsWith("/")
      ? `${SITE_URL}${post.coverImage}`
      : post.coverImage
    : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.releaseOn,
    dateModified: post.releaseOn,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl(post.slug) },
    url: postUrl(post.slug),
    inLanguage: "en-US",
    ...(image ? { image: [image] } : {}),
    author: { "@type": "Organization", name: "Prime Dealer Equity Fund", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Prime Dealer Equity Fund",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: LOGO },
    },
    ...(post.sources.length
      ? {
          citation: post.sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.title,
            url: s.url,
            ...(s.author ? { author: { "@type": "Organization", name: s.author } } : {}),
          })),
        }
      : {}),
  };

  // Content column: left aligned beside the fixed contents panel on lg, centred from xl up.
  const column = "max-w-[44rem] lg:mr-[16rem] xl:mx-auto";

  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <article>
        <header className="pt-8 md:pt-14 pb-8 md:pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className={column}>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-navy-400 hover:text-gold-500 transition-colors text-sm mb-8"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Blog
              </Link>

              <p className="flex items-center gap-3 mb-4 text-gold-500 font-mono text-xs tracking-wider uppercase">
                <time dateTime={post.releaseOn}>{formatReleaseDate(post.releaseOn)}</time>
                <span className="text-navy-600" aria-hidden="true">
                  &middot;
                </span>
                <span>{post.readingMinutes} min read</span>
              </p>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-50 tracking-tight leading-[1.1] mb-5">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-navy-300 text-lg leading-relaxed">{post.description}</p>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6">
          <div className={column}>
            <GoldDivider className="!mx-0" />
          </div>
        </div>

        <div id="blog-article" className="max-w-7xl mx-auto px-6 pt-10 pb-32 lg:pb-20">
          <div className={column}>
            {image && (
              <div className="relative w-full aspect-[16/9] mb-10 rounded-2xl overflow-hidden bg-navy-900">
                <Image
                  src={post.coverImage as string}
                  alt=""
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 704px"
                />
              </div>
            )}

            <div className="flex flex-col gap-8">
              {segments.map((seg, i) =>
                seg.kind === "html" ? (
                  <div key={i} className="blog-prose" dangerouslySetInnerHTML={{ __html: seg.html }} />
                ) : seg.variant === "tip" ? (
                  <Tip key={i} title={seg.title} html={seg.html} buttons={seg.buttons} />
                ) : (
                  <Note key={i} title={seg.title} html={seg.html} />
                )
              )}
            </div>

            {post.sources.length > 0 && (
              <section aria-labelledby="blog-sources" className="mt-14 pt-8 border-t border-navy-800/60">
                <h2
                  id="blog-sources"
                  className="text-gold-600 font-mono text-xs tracking-[0.2em] uppercase mb-4"
                >
                  Sources
                </h2>
                <ol className="list-decimal pl-5 space-y-3 text-sm leading-relaxed text-navy-300 marker:text-gold-500">
                  {post.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cream-100 underline decoration-gold-400/50 underline-offset-2 hover:text-gold-600 hover:decoration-gold-500 break-words"
                      >
                        {s.title || s.url}
                      </a>
                      {s.author ? `, ${s.author}` : ""}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-500 transition-colors font-mono text-xs tracking-wider uppercase"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                More articles
              </Link>
            </div>
          </div>
        </div>
      </article>

      <BlogContents headings={headings} targetId="blog-article" />
    </PageLayout>
  );
}
