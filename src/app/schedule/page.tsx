"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Script from "next/script";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import GoldDivider from "@/components/ui/GoldDivider";

const TURNSTILE_SITE_KEY = "0x4AAAAAACW5I5wl4r6AseVa";

/* ---------- Pre-qual schema ---------- */
const preQualSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Required"),
  investorType: z.string().min(1, "Please select one"),
  accredited: z.enum(["yes", "no", "unsure"], {
    message: "Please select one",
  }),
  capitalRange: z.string().min(1, "Please select a range"),
  timeline: z.string().min(1, "Please select one"),
  referralSource: z.string().min(1, "Please select one"),
});

type PreQualData = z.infer<typeof preQualSchema>;

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

/* ---------- Date helpers ---------- */
function getNext14Days(): { date: string; label: string; dayName: string }[] {
  const days = [];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    days.push({
      date: `${yyyy}-${mm}-${dd}`,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

const inputStyles =
  "w-full bg-navy-900/50 border border-navy-800/50 rounded-xl px-4 py-3 text-cream-100 placeholder:text-navy-600 focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/20 transition-all duration-300 text-sm";

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */
export default function SchedulePage() {
  const [step, setStep] = useState<
    "prequal" | "disqualified" | "calendar" | "confirm" | "done"
  >("prequal");
  const [preQualData, setPreQualData] = useState<PreQualData | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Guest state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Booking state
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const dates = getNext14Days();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreQualData>({
    resolver: zodResolver(preQualSchema),
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
    if (turnstileReady) renderTurnstile();
  }, [turnstileReady, renderTurnstile]);

  /* ---- Pre-qual submit ---- */
  const onPreQualSubmit = async (data: PreQualData) => {
    if (!turnstileToken) {
      setSubmitError("Please complete the verification check.");
      return;
    }
    setSubmitError(null);
    setPreQualData(data);

    if (data.accredited === "no") {
      // Save to Google Sheets but don't allow scheduling
      try {
        await fetch("/api/calendar/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            turnstileToken,
            date: "",
            time: "",
            source: "disqualified",
          }),
        });
      } catch {
        // silent — best-effort save
      }
      setStep("disqualified");
    } else {
      setStep("calendar");
    }
  };

  /* ---- Fetch slots when date is selected ---- */
  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/calendar/availability?date=${date}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  /* ---- Book the meeting ---- */
  const handleBook = async () => {
    if (!preQualData || !selectedDate || !selectedTime || !turnstileToken)
      return;

    setBooking(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/calendar/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...preQualData,
          turnstileToken,
          date: selectedDate,
          time: selectedTime,
          guestName: guestName || undefined,
          guestEmail: guestEmail || undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setBookingError(
          result.error || "Unable to book. Please try again."
        );
      } else {
        setStep("done");
      }
    } catch {
      setBookingError("Network error. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  /* ===== RENDER ===== */
  return (
    <PageLayout>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        onReady={() => setTurnstileReady(true)}
      />

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-gold-400 font-mono text-sm tracking-[0.2em] uppercase mb-6"
          >
            Schedule a Consultation
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6"
          >
            Book a <span className="text-gold-gradient">Private Meeting</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            Schedule a 30-minute consultation with our investment team.
            Answer a few quick questions and pick a time that works for you.
          </motion.p>
        </div>
      </section>

      <GoldDivider />

      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-12">
            {["Qualify", "Select Time", "Confirm"].map((label, i) => {
              const stepIndex =
                step === "prequal" || step === "disqualified"
                  ? 0
                  : step === "calendar"
                    ? 1
                    : 2;
              return (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                      i <= stepIndex
                        ? "bg-gold-400 text-[#1a1a2e]"
                        : "bg-navy-900/50 text-navy-500 border border-navy-800"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-xs hidden sm:inline ${
                      i <= stepIndex ? "text-cream-200" : "text-navy-600"
                    }`}
                  >
                    {label}
                  </span>
                  {i < 2 && (
                    <div className="w-8 h-px bg-navy-800" />
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* ===================== STEP 1: PRE-QUAL ===================== */}
            {step === "prequal" && (
              <motion.form
                key="prequal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit(onPreQualSubmit)}
                className="p-8 md:p-12 rounded-2xl bg-navy-900/50 border border-navy-800/50 space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl font-bold text-cream-50 mb-2">
                    Investor Qualification
                  </h2>
                  <p className="text-navy-400 text-sm">
                    Help us prepare for a productive conversation.
                  </p>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-navy-400 mb-2">
                      First Name *
                    </label>
                    <input
                      {...register("firstName")}
                      className={inputStyles}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-navy-400 mb-2">
                      Last Name *
                    </label>
                    <input
                      {...register("lastName")}
                      className={inputStyles}
                      placeholder="Smith"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-navy-400 mb-2">
                      Email *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className={inputStyles}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-navy-400 mb-2">
                      Phone *
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className={inputStyles}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Investor Type */}
                <div>
                  <label className="block text-sm text-navy-400 mb-2">
                    I am a... *
                  </label>
                  <select {...register("investorType")} className={inputStyles}>
                    <option value="">Select investor type</option>
                    <option value="individual">Individual / Personal Investor</option>
                    <option value="business">Business Entity</option>
                    <option value="family-office">Family Office</option>
                    <option value="institutional">Institutional Investor</option>
                  </select>
                  {errors.investorType && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.investorType.message}
                    </p>
                  )}
                </div>

                {/* Accredited */}
                <div>
                  <label className="block text-sm text-navy-400 mb-2">
                    Are you an accredited investor? *
                  </label>
                  <div className="flex gap-4">
                    {(["yes", "no", "unsure"] as const).map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          {...register("accredited")}
                          type="radio"
                          value={option}
                          className="w-4 h-4 text-gold-400 bg-navy-900 border-navy-700 focus:ring-gold-400"
                        />
                        <span className="text-cream-200 text-sm capitalize">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.accredited && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.accredited.message}
                    </p>
                  )}
                  <p className="text-navy-600 text-xs mt-2">
                    An accredited investor has $1M+ net worth (excl. primary
                    residence) or $200K+ annual income ($300K+ with spouse).
                  </p>
                </div>

                {/* Capital Range */}
                <div>
                  <label className="block text-sm text-navy-400 mb-2">
                    Investable capital for this opportunity? *
                  </label>
                  <select
                    {...register("capitalRange")}
                    className={inputStyles}
                  >
                    <option value="">Select a range</option>
                    <option value="100k-249k">$100,000 - $249,999</option>
                    <option value="250k-500k">$250,000 - $500,000</option>
                    <option value="500k-1m">$500,000 - $1,000,000</option>
                    <option value="1m-5m">$1,000,000 - $5,000,000</option>
                    <option value="5m+">$5,000,000+</option>
                  </select>
                  {errors.capitalRange && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.capitalRange.message}
                    </p>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm text-navy-400 mb-2">
                    Investment timeline? *
                  </label>
                  <select {...register("timeline")} className={inputStyles}>
                    <option value="">Select timeline</option>
                    <option value="immediate">Ready to invest now</option>
                    <option value="30-days">Within 30 days</option>
                    <option value="1-3-months">1 - 3 months</option>
                    <option value="exploring">Just exploring</option>
                  </select>
                  {errors.timeline && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.timeline.message}
                    </p>
                  )}
                </div>

                {/* Referral */}
                <div>
                  <label className="block text-sm text-navy-400 mb-2">
                    How did you hear about us? *
                  </label>
                  <select
                    {...register("referralSource")}
                    className={inputStyles}
                  >
                    <option value="">Select one</option>
                    <option value="referral">Referral</option>
                    <option value="podcast">Podcast</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="search">Google / Search</option>
                    <option value="social">Social Media</option>
                    <option value="event">Conference / Event</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.referralSource && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.referralSource.message}
                    </p>
                  )}
                </div>

                {/* Turnstile */}
                <div ref={turnstileRef} />

                {submitError && (
                  <p className="text-red-400 text-sm">{submitError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-[#1a1a2e] font-display font-semibold rounded-xl hover:from-gold-400 hover:to-gold-300 transition-all duration-300 shadow-lg shadow-gold-500/20"
                >
                  Continue to Scheduling
                </button>
              </motion.form>
            )}

            {/* ===================== DISQUALIFIED ===================== */}
            {step === "disqualified" && (
              <motion.div
                key="disqualified"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="p-12 rounded-2xl bg-navy-900/50 border border-navy-800/50 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-navy-800/50 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-navy-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-cream-50 mb-4">
                  Thank You for Your Interest
                </h3>
                <p className="text-navy-300 max-w-lg mx-auto mb-6">
                  This fund is currently limited to accredited investors under
                  SEC Regulation D. We&apos;ve saved your information and will
                  reach out if our eligibility criteria change.
                </p>
                <p className="text-navy-400 text-sm">
                  Questions? Contact us at{" "}
                  <a
                    href="mailto:ralph@PrimeDealerFund.com"
                    className="text-gold-400 hover:underline"
                  >
                    ralph@PrimeDealerFund.com
                  </a>
                </p>
              </motion.div>
            )}

            {/* ===================== STEP 2: CALENDAR ===================== */}
            {step === "calendar" && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8 md:p-12 rounded-2xl bg-navy-900/50 border border-navy-800/50 space-y-8"
              >
                <div>
                  <h2 className="font-display text-2xl font-bold text-cream-50 mb-2">
                    Select a Date & Time
                  </h2>
                  <p className="text-navy-400 text-sm">
                    All times are Eastern Time (ET). Meetings are 30 minutes.
                  </p>
                </div>

                {/* Date picker — horizontal scroll */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                  {dates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => handleDateSelect(d.date)}
                      className={`flex-shrink-0 w-20 py-3 rounded-xl text-center transition-all ${
                        selectedDate === d.date
                          ? "bg-gold-400 text-[#1a1a2e]"
                          : "bg-navy-950/50 border border-navy-800/50 text-cream-200 hover:border-gold-400/30"
                      }`}
                    >
                      <p
                        className={`text-xs font-mono ${
                          selectedDate === d.date
                            ? "text-[#1a1a2e]/70"
                            : "text-navy-500"
                        }`}
                      >
                        {d.dayName}
                      </p>
                      <p className="font-display font-semibold text-sm">
                        {d.label}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div>
                    {loadingSlots ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="text-navy-400 text-center py-8">
                        No available slots on this date. Please try another day.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2.5 px-3 rounded-lg text-sm font-mono transition-all ${
                              selectedTime === slot
                                ? "bg-gold-400 text-[#1a1a2e] font-semibold"
                                : "bg-navy-950/50 border border-navy-800/50 text-cream-200 hover:border-gold-400/30"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("prequal")}
                    className="px-6 py-3 border border-navy-700 text-navy-300 rounded-xl hover:border-navy-600 transition-all text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-[#1a1a2e] font-display font-semibold rounded-xl hover:from-gold-400 hover:to-gold-300 transition-all duration-300 shadow-lg shadow-gold-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* ===================== STEP 3: CONFIRM ===================== */}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8 md:p-12 rounded-2xl bg-navy-900/50 border border-navy-800/50 space-y-8"
              >
                <div>
                  <h2 className="font-display text-2xl font-bold text-cream-50 mb-2">
                    Confirm Your Consultation
                  </h2>
                  <p className="text-navy-400 text-sm">
                    Review your details and confirm the booking.
                  </p>
                </div>

                {/* Summary */}
                <div className="p-6 rounded-xl bg-navy-950/50 border border-navy-800/30 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-navy-400 text-sm">Date</span>
                    <span className="text-cream-100 text-sm font-medium">
                      {selectedDate &&
                        new Date(selectedDate + "T12:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-400 text-sm">Time</span>
                    <span className="text-cream-100 text-sm font-medium">
                      {selectedTime} ET (30 min)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-400 text-sm">With</span>
                    <span className="text-cream-100 text-sm font-medium">
                      Prime Dealer Fund Investment Team
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-400 text-sm">Format</span>
                    <span className="text-cream-100 text-sm font-medium">
                      Microsoft Teams (link in calendar invite)
                    </span>
                  </div>
                </div>

                {/* Invite a guest */}
                <div className="p-6 rounded-xl bg-navy-950/50 border border-navy-800/30">
                  <h3 className="text-cream-100 text-sm font-medium mb-4">
                    Invite a partner or advisor (optional)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-navy-500 mb-1">
                        Guest Name
                      </label>
                      <input
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className={inputStyles}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-navy-500 mb-1">
                        Guest Email
                      </label>
                      <input
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        type="email"
                        className={inputStyles}
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                </div>

                {bookingError && (
                  <p className="text-red-400 text-sm">{bookingError}</p>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("calendar")}
                    className="px-6 py-3 border border-navy-700 text-navy-300 rounded-xl hover:border-navy-600 transition-all text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={booking}
                    className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-[#1a1a2e] font-display font-semibold rounded-xl hover:from-gold-400 hover:to-gold-300 transition-all duration-300 shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {booking ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ===================== DONE ===================== */}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-12 rounded-2xl bg-navy-900/50 border border-gold-400/20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-gold-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-cream-50 mb-2">
                  You&apos;re Booked
                </h3>
                <p className="text-navy-300 mb-2">
                  Your consultation is confirmed for{" "}
                  <span className="text-cream-100 font-medium">
                    {selectedDate &&
                      new Date(
                        selectedDate + "T12:00:00"
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                    at {selectedTime} ET
                  </span>
                  .
                </p>
                <p className="text-navy-400 text-sm mb-8">
                  A calendar invitation with a Microsoft Teams link has been
                  sent to your email. We look forward to speaking with you.
                </p>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-[#1a1a2e] font-display font-semibold rounded-xl hover:from-gold-400 hover:to-gold-300 transition-all duration-300"
                >
                  Back to Home
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageLayout>
  );
}
