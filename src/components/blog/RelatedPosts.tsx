"use client";

import Link from "next/link";

interface RelatedPost {
  slug: string;
  title: string;
}

export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-12">
      <p className="text-navy-400 font-mono text-xs tracking-[0.15em] uppercase mb-4">
        Related Reading
      </p>
      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/insights/${post.slug}`}
            className="block text-cream-100 text-sm hover:text-gold-400 transition-colors"
          >
            &rarr; {post.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
