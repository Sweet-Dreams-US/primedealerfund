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
              Institutional-quality automotive dealership investment. Acquiring,
              optimizing, and scaling franchise dealerships across America.
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
            <strong className="text-[#9ca3af]">Important Disclaimer:</strong> The
            information provided in this Investment Summary does not constitute or
            form a part of any offer to sell or issue, or the solicitation of any
            offer to purchase, subscribe for, or otherwise acquire, any securities
            in the U.S. or in any jurisdiction in which such an offer or
            solicitation would be unlawful. The General Partner (GP) is the
            investment advisor to the private equity special purpose vehicle (SPV)
            that operates under an exemption from registration in the State of
            Indiana, where its principal office is located.
          </p>
          <p className="text-[#6b7280] text-xs leading-relaxed">
            Securities offered through applicable exemptions under Regulation D of
            the Securities Act of 1933, as amended. Available only to accredited
            investors as defined in Rule 501 of Regulation D.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <p className="text-[#4b5563] text-xs">
              &copy; {new Date().getFullYear()} Prime Dealer Equity Fund. All rights
              reserved.
            </p>
            <p className="text-[#4b5563] text-xs">
              A Coleman Prime Automotive venture.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
