import Link from "next/link";
import type { CalloutButton } from "@/lib/blog";

function Arrow() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

const buttonClass =
  "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-[#1a1a2e] font-display font-semibold text-base tracking-wide text-center hover:from-gold-400 hover:to-gold-300 transition-all duration-300 shadow-lg shadow-gold-500/20";

/** The link inside a tip is a button under the tip text, never an inline link. */
function TipButton({ button }: { button: CalloutButton }) {
  if (button.external) {
    return (
      <a href={button.href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        {button.label}
        <Arrow />
      </a>
    );
  }
  // Internal links, the contact page included, go straight to the page. This
  // site has no contact popup; /contact is its contact route.
  return (
    <Link href={button.href} className={buttonClass}>
      {button.label}
      <Arrow />
    </Link>
  );
}

export function Tip({
  title,
  html,
  buttons,
}: {
  title: string;
  html: string;
  buttons: CalloutButton[];
}) {
  return (
    <aside className="rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-50 via-white to-white p-6 md:p-8">
      <p className="text-gold-600 font-mono text-xs tracking-[0.15em] uppercase mb-3">Tip</p>
      {title && (
        <p className="font-display text-xl md:text-2xl font-semibold text-cream-50 leading-snug mb-3">
          {title}
        </p>
      )}
      {html && <div className="blog-prose blog-callout-body" dangerouslySetInnerHTML={{ __html: html }} />}
      {buttons.length > 0 && (
        <div className="mt-5 flex flex-col sm:flex-row sm:flex-wrap gap-3">
          {buttons.map((b) => (
            <TipButton key={`${b.href}|${b.label}`} button={b} />
          ))}
        </div>
      )}
    </aside>
  );
}

export function Note({ title, html }: { title: string; html: string }) {
  return (
    <aside className="rounded-2xl border border-navy-700/50 bg-navy-900/60 p-6 md:p-8">
      <p className="text-navy-400 font-mono text-xs tracking-[0.15em] uppercase mb-3">Note</p>
      {title && (
        <p className="font-display text-xl md:text-2xl font-semibold text-cream-50 leading-snug mb-3">
          {title}
        </p>
      )}
      {html && <div className="blog-prose blog-callout-body" dangerouslySetInnerHTML={{ __html: html }} />}
    </aside>
  );
}
