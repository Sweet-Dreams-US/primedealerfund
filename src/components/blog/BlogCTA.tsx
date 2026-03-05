"use client";

import Link from "next/link";

export default function BlogCTA() {
  return (
    <div className="mt-16 border-t border-b border-navy-800/50 py-10">
      <p className="text-cream-100 text-sm leading-relaxed mb-1">
        Prime Dealer Equity Fund is a private equity vehicle co-investing with
        Coleman Automotive Group in the acquisition and optimization of
        automotive dealerships across the United States.
      </p>
      <p className="text-navy-400 text-sm mt-4">
        For qualified investor inquiries:
      </p>
      <Link
        href="/contact"
        className="inline-block mt-2 text-gold-400 font-mono text-sm tracking-wider hover:text-gold-300 transition-colors"
      >
        &rarr; Contact our investor relations team
      </Link>
    </div>
  );
}
