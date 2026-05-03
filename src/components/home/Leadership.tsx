"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import SectionHeader from "@/components/ui/SectionHeader";
import MagneticButton from "@/components/ui/MagneticButton";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Two-person leadership card. Kyle and Ralph share a single photo
 * (taken together at the Nissan of Elgin closing), with each person's
 * mini-bio stacked vertically alongside the image. The shared photo
 * reinforces the partnership framing of Coleman Prime — Operator + Fund.
 */
const partnership = {
  photo:
    "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/NissanElgin/Kyle%26Ralph%20(1).jpg",
  alt: "Kyle Coleman and Ralph Marcuccilli at Nissan of Elgin",
  caption: "Kyle Coleman and Ralph Marcuccilli — Coleman Prime partnership",
};

const leaders = [
  {
    name: "Kyle Coleman",
    title: "CEO",
    summary:
      "Over 20 years in retail automotive and finance. Proven track record acquiring, turning around, and scaling franchise dealerships above industry benchmarks.",
    expertise: ["Dealership Operations", "M&A Strategy"],
  },
  {
    name: "Ralph Marcuccilli",
    title: "Manager",
    summary:
      "Three decades of leadership in banking, fintech, and investing. Expert in leveraging technology and automation to transform business operations and drive growth.",
    expertise: ["Financial Technology", "Capital Markets"],
  },
];

export default function Leadership() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Leadership"
          title="Who's Behind the Fund"
          subtitle="Operators and investors with decades of hands-on experience."
        />

        <motion.div
          ref={ref}
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="overflow-hidden rounded-2xl bg-navy-900/40 border border-navy-800/40 hover:border-gold-400/20 transition-all duration-500 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-[420px_1fr]">
            {/* Shared photo — left on desktop, top on mobile */}
            <div className="relative w-full h-72 sm:h-96 md:h-auto md:min-h-[520px]">
              <Image
                src={partnership.photo}
                alt={partnership.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 420px"
              />
              {/* Soft fade so the divider into bios feels integrated */}
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-navy-900/40 hidden md:block" />
            </div>

            {/* Two stacked bios — right on desktop, below on mobile */}
            <div className="divide-y divide-navy-800/40">
              {leaders.map((person) => (
                <div key={person.name} className="p-6 md:p-8">
                  <h3 className="font-display text-2xl font-bold text-cream-50 mb-0.5">
                    {person.name}
                  </h3>
                  <p className="text-gold-400 font-mono text-xs tracking-wider uppercase mb-3">
                    {person.title}
                  </p>
                  <p className="text-navy-300 text-sm leading-relaxed mb-4">
                    {person.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {person.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider text-gold-400 bg-gold-400/10 border border-gold-400/20 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="text-center">
          <MagneticButton href="/team" variant="outline">
            Meet the Full Team
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
