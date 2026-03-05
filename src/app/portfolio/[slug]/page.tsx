"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import { getDealershipBySlug } from "@/lib/dealerships";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function DealershipPage() {
  const { slug } = useParams<{ slug: string }>();
  const dealership = getDealershipBySlug(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { ref, isInView } = useScrollAnimation();

  if (!dealership) {
    return (
      <PageLayout>
        <section className="py-32 text-center">
          <h1 className="font-display text-4xl font-bold text-cream-50 mb-4">
            Dealership Not Found
          </h1>
          <p className="text-navy-400 mb-8">
            We couldn&apos;t find that dealership in our portfolio.
          </p>
          <MagneticButton href="/portfolio" variant="outline">
            Back to Portfolio
          </MagneticButton>
        </section>
      </PageLayout>
    );
  }

  const hasPhotos = dealership.gallery.length > 0;

  return (
    <PageLayout>
      {/* Hero — full photo showcase */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden">
        {dealership.heroImage ? (
          <>
            <Image
              src={dealership.heroImage}
              alt={dealership.name}
              fill
              className="object-cover"
              priority
            />
            {/* Only darken the bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#2d2d44] to-[#1a1a2e]" />
        )}

        <div className="relative w-full max-w-5xl mx-auto px-6 pb-12 md:pb-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-white/70 font-mono text-sm tracking-wider hover:text-gold-400 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Portfolio
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-wide mb-4"
          >
            {dealership.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <span className="text-white/70">{dealership.location}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              {dealership.status}
            </span>
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* Info */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl font-semibold text-cream-50 mb-4">
                About
              </h2>
              <p className="text-navy-300 leading-relaxed">
                {dealership.description}
              </p>
              {dealership.disclaimer && (
                <p className="text-navy-500 text-sm italic mt-4 border-t border-navy-800/30 pt-4">
                  {dealership.disclaimer}
                </p>
              )}
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-cream-50 mb-3">
                Brands
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {dealership.brands.map((brand) => (
                  <span
                    key={brand}
                    className="px-3 py-1 text-xs font-mono text-navy-300 bg-navy-800/50 rounded-lg border border-navy-700/30"
                  >
                    {brand}
                  </span>
                ))}
              </div>
              {dealership.website && (
                <a
                  href={dealership.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold-400 font-mono text-sm tracking-wider hover:text-gold-300 transition-colors"
                >
                  Visit Website
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video */}
      {dealership.video && (
        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display text-2xl font-semibold text-cream-50 mb-8">
              Featured Video
            </h2>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
              <iframe
                src={`https://customer-w6h9o08eg118alny.cloudflarestream.com/${dealership.video.id}/iframe`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="py-16 md:py-24 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-2xl font-semibold text-cream-50 mb-8">
            {hasPhotos ? "Photo Gallery" : "Photos"}
          </h2>

          {hasPhotos ? (
            <motion.div
              ref={ref}
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {dealership.gallery.map((src, i) => (
                <motion.button
                  key={i}
                  variants={staggerItem}
                  onClick={() => setLightboxIndex(i)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={src}
                    alt={`${dealership.name} photo ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/20 transition-colors duration-300" />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <div className="w-full py-20 rounded-2xl bg-navy-950/50 border border-navy-800/30 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-navy-800/50 flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-navy-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                  />
                </svg>
              </div>
              <p className="text-navy-500 text-sm font-mono tracking-wider uppercase">
                Photos Coming Soon
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && hasPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl aspect-[3/2]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={dealership.gallery[lightboxIndex]}
                alt={`${dealership.name} photo ${lightboxIndex + 1}`}
                fill
                className="object-contain rounded-lg"
                sizes="100vw"
              />

              {/* Close */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold-300 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Prev */}
              {lightboxIndex > 0 && (
                <button
                  onClick={() => setLightboxIndex(lightboxIndex - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white hover:text-gold-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
              )}

              {/* Next */}
              {lightboxIndex < dealership.gallery.length - 1 && (
                <button
                  onClick={() => setLightboxIndex(lightboxIndex + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white hover:text-gold-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              )}

              {/* Counter */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-navy-400 text-sm font-mono">
                {lightboxIndex + 1} / {dealership.gallery.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-24 md:py-32 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mb-6">
            Invest in the Portfolio
          </h2>
          <p className="text-navy-300 mb-8">
            {dealership.name} is one of six dealerships in the Prime Dealer Equity Fund.
            Request detailed fund performance data and portfolio metrics.
          </p>
          <MagneticButton href="/contact" variant="primary" size="lg">
            Request Portfolio Details
          </MagneticButton>
        </div>
      </section>
    </PageLayout>
  );
}
