"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { staggerContainer, fadeIn } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1a1a2e]">
      {/* Background photo — more visible */}
      <Image
        src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/MtPleasent/ChargerOutFront.webp"
        alt=""
        fill
        className="object-cover opacity-40"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/40 via-[#1a1a2e]/30 to-[#1a1a2e]/90 z-[1]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl w-full mx-auto px-6 text-center overflow-hidden"
      >
        <motion.div variants={fadeIn} className="mb-6">
          <span className="inline-block px-4 py-1.5 text-gold-400 font-mono text-xs tracking-[0.25em] uppercase border border-gold-400/20 rounded-full">
            Automotive Dealership Investment Fund
          </span>
        </motion.div>

        {/* Animated headline — always single line, auto-shrinks to fit */}
        <div className="mb-6 w-full">
          <div
            className="font-normal leading-[1] tracking-tight flex items-center justify-center gap-[0.2em] whitespace-nowrap text-[clamp(1rem,4.2vw,8rem)]"
            style={{
              fontFamily: "var(--font-zalando), var(--font-inter), system-ui, sans-serif",
            }}
          >
            {/* PRIME — outline text, fills on hover */}
            <motion.span
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="hero-outline inline-block cursor-default"
            >
              PRIME
            </motion.span>

            {/* DEALER EQUITY FUND — gold with shimmer */}
            <motion.span
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="hero-gold-wrap cursor-default"
            >
              <span>DEALER</span>
              <span>EQUITY</span>
              <span>FUND</span>
            </motion.span>
          </div>
        </div>

        {/* Animated line sweep */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-32 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-8 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-lg md:text-xl text-[#c5c9d1] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Prime Dealer Equity Fund is a private equity vehicle co-investing with
          Coleman Automotive Group in the acquisition and optimization of
          automotive dealerships across the U.S. Fund interest targeting a minimum of 8% annual distribution.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton href="/opportunity" variant="primary" size="lg">
            Explore the Opportunity
          </MagneticButton>
          <MagneticButton href="/story" variant="outline" size="lg">
            Our Story
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-12 flex items-center justify-center gap-8 text-[#9ca3af] text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Actively Deploying Capital</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#3d4355]" />
          <span className="hidden sm:inline">Accredited Investors Only</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
