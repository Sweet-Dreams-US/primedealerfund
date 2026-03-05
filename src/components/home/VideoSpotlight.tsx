"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionHeader from "@/components/ui/SectionHeader";

export default function VideoSpotlight() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-navy-900/30">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Watch"
          title="The Fund in Focus"
          subtitle="Learn about our strategy, operations, and vision for building the nation's premier dealership platform."
        />

        <motion.div
          ref={ref}
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative w-full aspect-video rounded-2xl overflow-hidden border border-navy-800/50 mb-8"
        >
          <iframe
            src="https://www.youtube.com/embed/VX4L9ydnVDA?si=xoj0LomFD-qK74Pz"
            title="Prime Dealer Equity Fund"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>

        <div className="text-center">
          <MagneticButton href="/media" variant="outline">
            View All Media
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
