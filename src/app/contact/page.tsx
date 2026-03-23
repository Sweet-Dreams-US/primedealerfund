"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Script from "next/script";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TURNSTILE_SITE_KEY = "0x4AAAAAACW5I5wl4r6AseVa";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  accredited: z.enum(["yes", "no", "unsure"], { message: "Please select one" }),
  investmentRange: z.string().min(1, "Please select an investment range"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    label: "Email",
    value: "Ralph@PrimeDealerFund.com",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "(260) 417-6016",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "Fort Wayne, Indiana",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const { ref, isInView } = useScrollAnimation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const renderTurnstile = useCallback(() => {
    if (turnstileRef.current && window.turnstile && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(null),
        theme: "dark",
      });
    }
  }, []);

  useEffect(() => {
    if (turnstileReady) {
      renderTurnstile();
    }
  }, [turnstileReady, renderTurnstile]);

  const onSubmit = async (data: ContactFormData) => {
    if (!turnstileToken) {
      setSubmitError("Please complete the verification check.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken }),
      });

      const result = await res.json();

      if (!res.ok) {
        setSubmitError(result.error || "Something went wrong.");
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
          setTurnstileToken(null);
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles =
    "w-full bg-navy-900/50 border border-navy-800/50 rounded-xl px-4 py-3 text-cream-100 placeholder:text-navy-600 focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-all duration-300 text-sm";

  return (
    <PageLayout>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        onReady={() => setTurnstileReady(true)}
      />

      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-gold-400 font-mono text-sm tracking-[0.2em] uppercase mb-6"
          >
            Contact
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6"
          >
            Start the <span className="text-gold-gradient">Conversation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            Whether you&apos;re ready to invest or just exploring, we&apos;d love to connect.
            Fill out the form below and our team will reach out within 24 hours.
          </motion.p>
        </div>
      </section>

      <GoldDivider />

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              ref={ref}
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-cream-50 mb-4">
                  Direct Contact
                </h2>
                <p className="text-navy-400 text-sm leading-relaxed">
                  Prefer a direct conversation? Reach out through any of the channels below.
                </p>
              </div>

              {contactInfo.map((info) => (
                <motion.div
                  key={info.label}
                  variants={staggerItem}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-400">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-navy-500 text-xs font-mono tracking-wider uppercase">
                      {info.label}
                    </p>
                    <p className="text-cream-100 text-sm">{info.value}</p>
                  </div>
                </motion.div>
              ))}

              <a
                href="/schedule"
                className="block p-6 rounded-2xl bg-navy-900/50 border border-navy-800/50 hover:border-gold-400/30 transition-all group"
              >
                <h3 className="font-display text-lg font-semibold text-cream-50 mb-2">
                  Schedule a Call
                </h3>
                <p className="text-navy-400 text-sm mb-4">
                  Schedule a 15-minute introduction call to learn more about the fund.
                </p>
                <span className="text-gold-400 text-sm font-mono group-hover:text-gold-300 transition-colors">
                  Book Now &rarr;
                </span>
              </a>
            </motion.div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 rounded-2xl bg-navy-900/50 border border-gold-400/20 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-cream-50 mb-2">
                    Thank You
                  </h3>
                  <p className="text-navy-300">
                    We&apos;ve received your information and will be in touch within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-8 md:p-12 rounded-2xl bg-navy-900/50 border border-navy-800/50 space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-navy-400 mb-2">First Name *</label>
                      <input
                        {...register("firstName")}
                        className={inputStyles}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-navy-400 mb-2">Last Name *</label>
                      <input
                        {...register("lastName")}
                        className={inputStyles}
                        placeholder="Smith"
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-navy-400 mb-2">Email *</label>
                      <input
                        {...register("email")}
                        type="email"
                        className={inputStyles}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-navy-400 mb-2">Phone</label>
                      <input
                        {...register("phone")}
                        type="tel"
                        className={inputStyles}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-navy-400 mb-2">Street Address</label>
                    <input
                      {...register("address")}
                      className={inputStyles}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm text-navy-400 mb-2">City</label>
                      <input
                        {...register("city")}
                        className={inputStyles}
                        placeholder="Fort Wayne"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-navy-400 mb-2">State</label>
                      <input
                        {...register("state")}
                        className={inputStyles}
                        placeholder="IN"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-navy-400 mb-2">ZIP</label>
                      <input
                        {...register("zip")}
                        className={inputStyles}
                        placeholder="46802"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-navy-400 mb-2">
                      Are you an accredited investor? *
                    </label>
                    <div className="flex gap-4">
                      {(["yes", "no", "unsure"] as const).map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            {...register("accredited")}
                            type="radio"
                            value={option}
                            className="w-4 h-4 text-gold-400 bg-navy-900 border-navy-700 focus:ring-gold-400"
                          />
                          <span className="text-cream-200 text-sm capitalize">{option}</span>
                        </label>
                      ))}
                    </div>
                    {errors.accredited && (
                      <p className="text-red-400 text-xs mt-1">{errors.accredited.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-navy-400 mb-2">
                      Investment Range *
                    </label>
                    <select {...register("investmentRange")} className={inputStyles}>
                      <option value="">Select a range</option>
                      <option value="100k-249k">$100,000 - $249,999</option>
                      <option value="250k-500k">$250,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="1m-5m">$1,000,000 - $5,000,000</option>
                      <option value="5m+">$5,000,000+</option>
                      <option value="exploring">Just Exploring</option>
                    </select>
                    {errors.investmentRange && (
                      <p className="text-red-400 text-xs mt-1">{errors.investmentRange.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-navy-400 mb-2">Message</label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      className={inputStyles}
                      placeholder="Tell us about your investment goals..."
                    />
                  </div>

                  {/* Cloudflare Turnstile */}
                  <div ref={turnstileRef} />

                  {submitError && (
                    <p className="text-red-400 text-sm">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-[#1a1a2e] font-display font-semibold rounded-xl hover:from-gold-400 hover:to-gold-300 transition-all duration-300 shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>

                  <p className="text-navy-600 text-xs text-center">
                    By submitting, you agree to our Privacy Policy. We will never share your information.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
