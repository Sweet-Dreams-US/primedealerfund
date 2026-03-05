"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import SectionHeader from "@/components/ui/SectionHeader";
import MagneticButton from "@/components/ui/MagneticButton";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const leaders = [
  {
    name: "Kyle Coleman",
    title: "CEO",
    photo: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/colemanpic1.jpg",
    summary:
      "Over 20 years in retail automotive and finance. Proven track record acquiring, turning around, and scaling franchise dealerships above industry benchmarks.",
    expertise: ["Dealership Operations", "M&A Strategy"],
  },
  {
    name: "Ralph Marcuccilli",
    title: "Manager",
    photo: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/ralphmarcuccilli1.jpg",
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
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {leaders.map((person) => (
            <motion.div
              key={person.name}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-2xl bg-navy-900/40 border border-navy-800/40 hover:border-gold-400/20 transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row items-end gap-0">
                {/* Info — left side, vertically centered */}
                <div className="flex-1 p-6 md:p-8">
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

                {/* Photo — right side, bottom-aligned */}
                <div className="relative w-full sm:w-48 md:w-56 shrink-0 h-56 sm:h-64 md:h-72 overflow-hidden sm:rounded-tl-2xl">
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, 224px"
                  />
                </div>
              </div>
            </motion.div>
          ))}
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
