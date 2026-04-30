"use client";

import Link from "next/link";

interface CalloutNumbersProps {
  title: string;
  lines: string[];
  link?: { text: string; href: string };
}

export function CalloutNumbers({ title, lines, link }: CalloutNumbersProps) {
  return (
    <div className="my-10 rounded-2xl border border-gold-400/20 bg-navy-900/60 p-8">
      <p className="text-gold-400 font-mono text-xs tracking-[0.15em] uppercase mb-5">
        By the Numbers
      </p>
      <p className="text-cream-50 font-display text-lg font-semibold mb-4">
        {title}
      </p>
      <div className="space-y-2 mb-5">
        {lines.map((line, i) => (
          <p key={i} className="text-navy-300 text-sm font-mono">
            {line}
          </p>
        ))}
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-gold-400 text-sm font-mono tracking-wider hover:text-gold-300 transition-colors"
        >
          &rarr; {link.text}
        </Link>
      )}
    </div>
  );
}

interface CalloutPrimeProps {
  lines: string[];
  link?: { text: string; href: string };
}

export function CalloutPrime({ lines, link }: CalloutPrimeProps) {
  return (
    <div className="my-10 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/5 to-transparent p-8">
      <p className="text-gold-400 font-mono text-xs tracking-[0.15em] uppercase mb-5">
        Prime Insight
      </p>
      <div className="space-y-3 mb-5">
        {lines.map((line, i) => (
          <p key={i} className="text-cream-100 text-sm leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-gold-400 text-sm font-mono tracking-wider hover:text-gold-300 transition-colors"
        >
          &rarr; {link.text}
        </Link>
      )}
    </div>
  );
}

interface CalloutFloorProps {
  quote: string;
  attribution: string;
  stats?: string[];
  link?: { text: string; href: string };
  attributionPrefix?: string;
}

export function CalloutFloor({
  quote,
  attribution,
  stats,
  link,
  attributionPrefix = "— ",
}: CalloutFloorProps) {
  return (
    <div className="my-10 rounded-2xl border border-navy-700/50 bg-navy-950/60 p-8">
      <p className="text-navy-400 font-mono text-xs tracking-[0.15em] uppercase mb-5">
        From the Floor
      </p>
      <blockquote className="text-cream-100 text-lg leading-relaxed italic mb-3">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <p className="text-navy-400 text-sm mb-5">{attributionPrefix}{attribution}</p>
      {stats && stats.length > 0 && (
        <div className="space-y-1.5 border-t border-navy-800/50 pt-4 mb-5">
          {stats.map((stat, i) => (
            <p key={i} className="text-navy-300 text-sm font-mono">
              {stat}
            </p>
          ))}
        </div>
      )}
      {link && (
        <Link
          href={link.href}
          className="text-gold-400 text-sm font-mono tracking-wider hover:text-gold-300 transition-colors"
        >
          &rarr; {link.text}
        </Link>
      )}
    </div>
  );
}
