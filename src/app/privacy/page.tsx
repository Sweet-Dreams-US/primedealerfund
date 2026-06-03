import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Prime Dealer Equity Fund collects, uses, and shares information from visitors to primedealerfund.com, including website analytics and visitor identification.",
  robots: { index: true, follow: true },
};

const UPDATED = "June 3, 2026";

// NOTE FOR COUNSEL REVIEW: this policy is a baseline drafted to cover the
// site's current data practices (forms, analytics, and third-party visitor
// identification via LeadPipe). It should be reviewed/finalized by Squire
// Patton Boggs before being treated as final. The "Website Visitor
// Identification" section is required because the LeadPipe pixel resolves
// anonymous visitors to person-level identity.
function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-10 border-t border-navy-800/30 first:border-t-0">
      <span className="text-gold-400 font-mono text-xs tracking-[0.2em] uppercase">{n}</span>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-cream-50 mt-2 mb-4">{title}</h2>
      <div className="space-y-4 text-navy-300 leading-relaxed text-[15px]">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <PageLayout>
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block text-gold-400 font-mono text-sm tracking-[0.2em] uppercase mb-6">Legal</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-cream-50 tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-lg text-navy-300 leading-relaxed">
            This policy explains how Prime Dealer Equity Fund, LLC and its
            manager, Prime Management Partners LLC (together, &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or the &ldquo;Fund&rdquo;), collect, use, and share
            information in connection with primedealerfund.com (the
            &ldquo;Site&rdquo;).
          </p>
          <p className="text-sm text-navy-500 mt-4">Last updated: {UPDATED}</p>
        </div>
      </section>

      <GoldDivider />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <Section id="collect" n="Section 1" title="Information We Collect">
          <p><strong className="text-cream-100">Information you provide.</strong> When you submit a contact form, request information, schedule a call, or otherwise communicate with us, we collect the details you provide — such as your name, email address, phone number, and any information you include in your message.</p>
          <p><strong className="text-cream-100">Information collected automatically.</strong> When you visit the Site, we and our service providers automatically collect certain technical and usage information, including your IP address, device and browser type, pages viewed, referring URLs, and the dates and times of your visits, through cookies and similar technologies.</p>
          <p><strong className="text-cream-100">Information from third-party identification providers.</strong> We use a third-party visitor-identification service that may match your visit to business-contact and firmographic information from its own data sources. See &ldquo;Website Visitor Identification&rdquo; below.</p>
        </Section>

        <Section id="use" n="Section 2" title="How We Use Information">
          <p>We use the information we collect to operate and improve the Site; to respond to inquiries and scheduling requests; to communicate with prospective and current investors about the Fund; to evaluate interest in the Fund and conduct outreach; to maintain the security and integrity of the Site; and to comply with legal and regulatory obligations.</p>
          <p>Because the Fund conducts a private offering under Regulation D, Rule 506(c), any investment-related communications and any eventual offering of interests are directed only to verified accredited investors and are made solely through the Fund&rsquo;s Confidential Private Placement Memorandum and related subscription documents.</p>
        </Section>

        <Section id="visitor-id" n="Section 3" title="Website Visitor Identification">
          <p>We use a third-party visitor-identification provider (LeadPipe) that places a pixel on the Site. This technology may resolve an otherwise anonymous visit into identifying information — such as a name, business email address, job title, company, and professional profile — by matching technical signals from your visit against the provider&rsquo;s independent data sources.</p>
          <p>We use this information to understand who is interested in the Fund and to enable our team to follow up with individuals who may qualify as accredited investors. Identification occurs at the company level only for visitors in the European Union. You may opt out as described in &ldquo;Your Privacy Rights&rdquo; below, and you can prevent most identification by using privacy tools that block third-party pixels.</p>
        </Section>

        <Section id="analytics" n="Section 4" title="Cookies &amp; Analytics">
          <p>We use cookies and similar technologies for analytics and measurement, including Vercel Analytics (privacy-friendly traffic measurement) and the LinkedIn Insight Tag (advertising measurement and audience analytics). These tools help us understand how the Site is used and the effectiveness of our marketing.</p>
          <p>Most browsers let you refuse or delete cookies through their settings. Disabling cookies may affect how parts of the Site function.</p>
        </Section>

        <Section id="share" n="Section 5" title="How We Share Information">
          <p>We do not sell your personal information for money. We share information with service providers who perform functions on our behalf, under contracts that limit their use of the information, including: hosting and analytics (Vercel), database and infrastructure (Supabase), email delivery (Resend), email and calendaring (Microsoft), advertising measurement (LinkedIn), and visitor identification (LeadPipe).</p>
          <p>We may also share information to comply with law, respond to legal process, protect our rights, or in connection with a corporate transaction. Some sharing of identifiers for cross-context behavioral advertising or with data providers may be considered a &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; under certain state laws; see your rights below.</p>
        </Section>

        <Section id="rights" n="Section 6" title="Your Privacy Rights">
          <p>Depending on where you live, you may have the right to request access to, correction of, or deletion of your personal information, and to opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of your personal information or its use for targeted advertising or visitor identification.</p>
          <p>To exercise any of these rights — including to opt out of visitor identification — contact us at the address below and we will respond as required by applicable law. We will not discriminate against you for exercising your rights.</p>
        </Section>

        <Section id="retention" n="Section 7" title="Data Retention &amp; Security">
          <p>We retain personal information for as long as needed for the purposes described in this policy, to comply with our legal obligations, and to maintain our investor and outreach records. We use reasonable administrative, technical, and physical safeguards designed to protect the information we hold; however, no method of transmission or storage is completely secure.</p>
        </Section>

        <Section id="misc" n="Section 8" title="Children, Third-Party Links &amp; Changes">
          <p>The Site is intended for accredited investors and other business users and is not directed to children. We do not knowingly collect information from children under 16.</p>
          <p>The Site may link to third-party websites we do not control; their privacy practices are governed by their own policies. We may update this policy from time to time; the &ldquo;Last updated&rdquo; date above reflects the most recent revision.</p>
        </Section>

        <Section id="contact" n="Section 9" title="Contact Us">
          <p>For privacy questions or to exercise your rights, contact:</p>
          <div className="text-navy-400 text-sm font-mono space-y-1">
            <p>Prime Management Partners, LLC</p>
            <p>11117 Creekwood Ct., Fort Wayne, IN 46814</p>
            <p>
              <a href="mailto:Ralph@PrimeDealerFund.com" className="text-gold-400 hover:text-gold-300 transition-colors">Ralph@PrimeDealerFund.com</a>
            </p>
          </div>
          <p className="text-sm text-navy-500">
            See also our{" "}
            <a href="/disclosures" className="text-gold-400 hover:text-gold-300 underline">Disclosures</a>{" "}
            page for important information about the Fund and its offering.
          </p>
        </Section>
      </div>
    </PageLayout>
  );
}
