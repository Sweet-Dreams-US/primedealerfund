"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    number: "01",
    title: "Learn",
    description: "Review our investment thesis, fund structure, and track record through our materials and team.",
  },
  {
    number: "02",
    title: "Qualify",
    description: "Complete accredited investor verification and schedule a private consultation with our team.",
  },
  {
    number: "03",
    title: "Invest",
    description: "Choose your allocation and complete subscription documents. Minimum investment starts at $100K.",
  },
  {
    number: "04",
    title: "Returns",
    description: "Receive annual distributions from dealership operations. Transparent reporting on every metric.",
  },
  {
    number: "05",
    title: "Growth",
    description: "As the portfolio grows, so does your investment. Participate in value creation across the platform.",
  },
];

export default function HowItWorks() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          label="The Process"
          title="How It Works"
          subtitle="A transparent, five-step journey from initial inquiry to ongoing returns."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={staggerItem}
                className="group relative text-center lg:text-center"
              >
                <motion.div
                  variants={fadeInUp}
                  className="w-12 h-12 rounded-full bg-navy-900 border-2 border-gold-400/50 flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:bg-gold-400 group-hover:border-gold-400 transition-all duration-300 cursor-default"
                >
                  <span className="font-mono text-gold-400 text-sm font-bold group-hover:text-[#1a1a2e] transition-colors duration-300">
                    {step.number}
                  </span>
                </motion.div>
                <h3 className="font-display text-xl font-semibold text-cream-50 mb-2">
                  {step.title}
                </h3>
                <p className="text-navy-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="lg:hidden w-px h-8 bg-gold-400/20 mx-auto mt-6" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
