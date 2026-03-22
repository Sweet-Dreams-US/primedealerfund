"use client";

import Image from "next/image";
import Link from "next/link";
import GoldDivider from "@/components/ui/GoldDivider";

const footerLinks = {
  Investment: [
    { label: "Opportunity", href: "/opportunity" },
    { label: "Media", href: "/media" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "FAQ", href: "/faq" },
  ],
  Company: [
    { label: "Our Story", href: "/story" },
    { label: "Team", href: "/team" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclosures", href: "/disclosures" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] border-t border-[#2d2d44]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png"
                alt="Prime Dealer Equity Fund"
                width={140}
                height={56}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-6">
              A private equity vehicle co-investing with Coleman Automotive Group
              in the acquisition and optimization of automotive dealerships across the U.S.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-white/80 mb-4 text-sm tracking-wide uppercase">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#9ca3af] hover:text-gold-400 transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <GoldDivider width="w-full" className="opacity-20 mb-8" />

        <div className="space-y-4">
          <p className="text-[#6b7280] text-xs leading-relaxed">
            <strong className="text-[#9ca3af]">Important Legal Notice:</strong> This
            website and all materials herein are for informational purposes only and
            are not intended to constitute an offer to sell any securities. Any
            offering of interests in Prime Dealer Equity Fund (the Fund) is made
            only to &ldquo;accredited investors&rdquo; (as defined in Rule 501 of
            Regulation D of the federal securities laws) pursuant to Regulation D,
            Rule 506(c) of the Securities Act of 1933, as amended, and applicable
            state securities laws, pursuant to the Fund&apos;s Private Placement
            Memorandum (PPM).
          </p>
          <p className="text-[#6b7280] text-xs leading-relaxed">
            Investing in private equity involves significant risk, including the
            potential loss of your investment. Past performance is not indicative of
            future results. Projected returns are targets only and are not
            guaranteed. Operational results cited on this website reflect the
            performance of specific Coleman Automotive Group dealerships and are
            provided as evidence of the operator&apos;s execution capabilities
            only. These results do not represent past or projected Fund assets or Fund returns.
          </p>
          <p className="text-[#6b7280] text-xs leading-relaxed">
            Prospective investors should review the PPM and consult with
            their own legal, tax, and financial advisors before making any
            investment decision.
          </p>
          <p className="text-[#6b7280] text-xs leading-relaxed">
            The Fund is managed by Prime Management Partners, LLC, an Indiana LLC
            and exempt reporting adviser located at 11117 Creekwood Ct., Fort Wayne,
            IN 46814.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <p className="text-[#4b5563] text-xs">
              &copy; {new Date().getFullYear()} Prime Dealer Equity Fund. All rights
              reserved.
            </p>
            <p className="text-[#4b5563] text-xs">
              Managed by Prime Management Partners, LLC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
