"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import MagneticButton from "@/components/ui/MagneticButton";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function FinalCTA() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-32 md:py-40 relative overflow-hidden bg-[#1a1a2e]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-3xl" />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <motion.span
          variants={fadeInUp}
          className="inline-block text-gold-400 font-mono text-sm tracking-[0.2em] uppercase mb-6"
        >
          Start Your Journey
        </motion.span>

        <motion.h2
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
        >
          Ready to Invest in the
          <br />
          <span className="text-gold-gradient">Future of Automotive Retail?</span>
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-lg text-[#9ca3af] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Schedule a private consultation with our team to learn how Prime Dealer
          Equity Fund can fit into your portfolio. Minimum investment: $100,000.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton href="/contact" variant="primary" size="lg">
            Request Private Consultation
          </MagneticButton>
          <MagneticButton href="/calculator" variant="outline" size="lg">
            Model Your Investment
          </MagneticButton>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="mt-8 text-[#6b7280] text-xs"
        >
          For accredited investors only. Securities offered under Regulation D exemptions.
        </motion.p>
      </motion.div>
    </section>
  );
}
