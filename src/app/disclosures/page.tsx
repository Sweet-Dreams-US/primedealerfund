import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";

export const metadata: Metadata = {
  title: "Disclosures",
  description:
    "Important disclosures regarding the Prime Dealer Equity Fund, its podcasts, marketing materials, and the limited offering of fund interests under Regulation D, Rule 506(c).",
  robots: { index: true, follow: true },
};

// Centralized, evergreen disclosures hub. Referenced by:
//   - Footer (sitewide link)
//   - PodcastDisclaimer component (inline on media surfaces)
//   - YouTube video descriptions (so off-site viewers reach it directly)
// Treat this page as the single source of truth. The podcast section
// reproduces counsel-authored language verbatim — do not edit it without
// going back through Squire Patton Boggs.
export default function DisclosuresPage() {
  return (
    <PageLayout>
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block text-gold-400 font-mono text-sm tracking-[0.2em] uppercase mb-6">
            Legal
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-cream-50 tracking-tight mb-6">
            Disclosures
          </h1>
          <p className="text-lg text-navy-300 leading-relaxed">
            Important disclosures regarding the Prime Dealer Equity Fund, LLC
            (the &ldquo;Fund&rdquo;), its manager Prime Management Partners LLC
            (the &ldquo;Fund Manager&rdquo;), and any podcasts, videos, or
            marketing materials published under the Prime Dealer brand.
          </p>
        </div>
      </section>

      <GoldDivider />

      {/* Podcast & video disclosures — counsel-authored, verbatim */}
      <section id="podcast" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-gold-400 font-mono text-xs tracking-[0.2em] uppercase">
            Section 1
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mt-2 mb-8">
            Podcast &amp; Video Disclosures
          </h2>

          <div className="space-y-5 text-navy-300 leading-relaxed text-[15px]">
            <p>
              The content of these podcasts expresses the views of its
              participants as of the date indicated and may not represent the
              views of the Prime Dealer Equity Fund, LLC (the &ldquo;Fund&rdquo;)
              or if its manager, Prime Management Partners LLC (the &ldquo;Fund
              Manager&rdquo;). Moreover, such views are subject to change
              without notice and neither the Fund nor the Fund Manager has a
              duty or obligation to update the information contained herein.
              Further, neither the Fund nor the Fund Manager makes any
              representation, and it should not be assumed that past investment
              performance is an indication of future results. Moreover, wherever
              there is the potential for profit there is also the possibility
              of loss.
            </p>
            <p>
              This podcast is being made available for informational and
              marketing purposes only and should not be used for any other
              purpose. The information contained herein does not constitute and
              should not be construed as an offering of advisory services or
              investment advice in any jurisdiction. Certain information
              contained herein concerning economic trends and performance is
              based on or derived from information provided by independent
              third-party sources.
            </p>
            <p>
              Neither the Fund nor the Fund Manager can guarantee the accuracy
              of the information in this podcast and has not independently
              verified the accuracy or completeness of such information or the
              assumptions on which such information is based.
            </p>
            <p>
              This podcast does not constitute a securities offering. Potential
              investors in the Fund are provided a Confidential Private
              Placement Memorandum and Agreements related to the Fund. All such
              offering information should be reviewed carefully and any
              potential investor should consult her financial advisor before
              making an investment decision.
            </p>
          </div>
        </div>
      </section>

      {/* General fund disclosures — 506(c), accredited-investor framing */}
      <section id="fund" className="py-16 md:py-24 bg-navy-900/20">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-gold-400 font-mono text-xs tracking-[0.2em] uppercase">
            Section 2
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mt-2 mb-8">
            General Fund Disclosures
          </h2>

          <div className="space-y-5 text-navy-300 leading-relaxed text-[15px]">
            <p>
              This website and all materials herein &mdash; including podcasts,
              videos, written content, and email communications &mdash; are for
              informational purposes only and are not intended to constitute an
              offer to sell, or a solicitation of an offer to buy, any
              securities. Any offering of interests in the Fund is made only to
              &ldquo;accredited investors&rdquo; as defined in Rule 501 of
              Regulation D under the Securities Act of 1933, as amended,
              pursuant to Regulation D, Rule 506(c), and applicable state
              securities laws, and only through the Fund&rsquo;s Confidential
              Private Placement Memorandum (the &ldquo;PPM&rdquo;) and related
              subscription documents.
            </p>
            <p>
              Investing in private equity, including the Fund, involves
              significant risk, including the potential loss of all or
              substantially all of the amount invested. Private investments are
              illiquid, are not subject to the same regulatory requirements as
              registered securities, and may employ leverage and other
              speculative practices. There is no assurance that the Fund will
              achieve its investment objectives.
            </p>
            <p>
              Past performance is not indicative of future results. Any
              projected, targeted, or hypothetical returns referenced are
              estimates only, are not guaranteed, and reflect the Fund
              Manager&rsquo;s assumptions, which are subject to change. Actual
              results may differ materially.
            </p>
            <p>
              Operational results, financial figures, and case studies cited
              for specific dealerships reflect the performance of Coleman
              Automotive Group properties under existing ownership and are
              provided as evidence of the operator&rsquo;s execution
              capabilities. These results do not represent past or projected
              Fund assets, Fund-level performance, or returns to Fund investors.
            </p>
            <p>
              Prospective investors should carefully review the PPM and consult
              with their own legal, tax, accounting, and financial advisors
              before making any investment decision. No information on this
              website or in any Fund material is intended as legal, tax, or
              investment advice.
            </p>
            <p>
              The Fund is managed by Prime Management Partners, LLC, an Indiana
              limited liability company and exempt reporting adviser, located
              at 11117 Creekwood Ct., Fort Wayne, IN 46814.
            </p>
          </div>
        </div>
      </section>

      {/* Forward-looking statements */}
      <section id="forward-looking" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-gold-400 font-mono text-xs tracking-[0.2em] uppercase">
            Section 3
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mt-2 mb-8">
            Forward-Looking Statements
          </h2>

          <div className="space-y-5 text-navy-300 leading-relaxed text-[15px]">
            <p>
              Certain statements made on this website, in Fund podcasts,
              videos, and other marketing materials constitute forward-looking
              statements. These statements include, without limitation,
              statements regarding intended acquisition activity, target
              returns, deployment timelines, operational improvements, and
              market conditions. Forward-looking statements involve known and
              unknown risks, uncertainties, and assumptions and are not
              guarantees of future performance. Actual results may differ
              materially from those expressed or implied by any forward-looking
              statement. Neither the Fund nor the Fund Manager undertakes any
              obligation to update or revise any forward-looking statement to
              reflect events or circumstances after the date on which it was
              made.
            </p>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section id="questions" className="py-16 md:py-24 bg-navy-900/20">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-gold-400 font-mono text-xs tracking-[0.2em] uppercase">
            Questions
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mt-2 mb-6">
            Get in touch
          </h2>
          <p className="text-navy-300 leading-relaxed text-[15px] mb-6">
            For questions about these disclosures, the PPM, or the Fund&rsquo;s
            offering process, please contact the Fund Manager directly. The
            offering of Fund interests is conducted only through the PPM and
            related subscription documents and only with verified accredited
            investors.
          </p>
          <div className="text-navy-400 text-sm font-mono space-y-1">
            <p>Prime Management Partners, LLC</p>
            <p>11117 Creekwood Ct., Fort Wayne, IN 46814</p>
            <p>
              <a
                href="mailto:Ralph@PrimeDealerFund.com"
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                Ralph@PrimeDealerFund.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
