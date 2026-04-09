"use client";

import Image from "next/image";
import Link from "next/link";
import GoldDivider from "@/components/ui/GoldDivider";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/prime-dealer-equity-fund",
    hoverColor: "#0A66C2",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@PrimeDealerEquityFund",
    hoverColor: "#FF0000",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/primedealerequityfund/",
    hoverColor: "#E4405F",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/p/Prime-Dealer-Equity-Fund-61577255588261/",
    hoverColor: "#1877F2",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/1HKo2seiNq8iRj4iQZCZua?si=861523615a2e4b97",
    hoverColor: "#1DB954",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    label: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/prime-dealer-podcast/id1887343379",
    hoverColor: "#9933CC",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c4.988 0 7.399 3.378 7.399 6.588a6.457 6.457 0 01-1.272 3.943c-.439.594-.678.801-.678 1.307 0 .368.186.81.432 1.354l.009.02c.391.88.921 2.073.921 2.81 0 .455-.103.81-.431 1.139-.373.375-.814.541-1.311.541-.705 0-1.236-.348-1.68-.897-.587-.726-.998-1.678-1.281-2.595-.354-1.147-.517-1.31-1.235-1.536a6.085 6.085 0 00-.873-.19 6.907 6.907 0 00-.866-.06 7.544 7.544 0 00-.94.06c-.29.04-.588.106-.872.19-.718.226-.881.39-1.235 1.536-.283.917-.694 1.869-1.281 2.595-.444.549-.975.897-1.68.897-.497 0-.938-.166-1.311-.541-.328-.329-.431-.684-.431-1.139 0-.737.53-1.93.921-2.81l.009-.02c.246-.544.432-.986.432-1.354 0-.506-.239-.713-.678-1.307A6.457 6.457 0 014.16 9.156c0-3.21 2.411-6.588 7.399-6.588h.306zM12 7.151a2.663 2.663 0 00-2.66 2.66A2.663 2.663 0 0012 12.47a2.663 2.663 0 002.66-2.66A2.663 2.663 0 0012 7.15zm0 6.56c-1.465 0-2.593.995-2.593 2.253v.627c0 .2.05.382.152.535.39.588 1.277.897 2.441.897 1.164 0 2.051-.309 2.441-.897.101-.153.152-.336.152-.535v-.627c0-1.258-1.128-2.253-2.593-2.253z" />
      </svg>
    ),
  },
];

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
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-[#9ca3af] transition-colors duration-300"
                  onMouseEnter={(e) => (e.currentTarget.style.color = social.hoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  {social.icon}
                </a>
              ))}
            </div>
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
