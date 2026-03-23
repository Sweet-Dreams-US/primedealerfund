"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import GoldDivider from "@/components/ui/GoldDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const leadership = [
  {
    name: "Kyle Coleman",
    title: "CEO",
    photo: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/colemanpic1.jpg",
    bio: "Over 20 years of experience in the retail automotive industry and finance. Mr. Coleman is the CEO and majority owner of Coleman Automotive Group LLC. He has been the General Manager of multiple new car dealerships, consistently exceeding industry performance metrics. Mr. Coleman has a proven track record of acquiring, turning around, and optimizing automotive dealerships to perform above industry standards. He has also developed a talented team ready to relocate and take on key roles within dealerships that Coleman Automotive intends to optimize.",
    bio2: "Through Mr. Coleman's extensive industry relationships, he has built broker relationships within the automotive dealership and retail industry. The Fund Manager believes it enjoys a competitive advantage due to these broker relationships.",
    expertise: ["Dealership Operations", "OEM Relations", "M&A Strategy", "Turnaround Management"],
  },
  {
    name: "Ralph Marcuccilli",
    title: "Manager of the Fund Manager, Prime Management Partners, LLC",
    photo: "https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/ralphmarcuccilli1.jpg",
    bio: "Seasoned executive and investor with a strong track record of leadership in the banking, financial technology, and investing. With a career spanning over three decades, Ralph has been at the forefront of leveraging automation and cutting-edge technology to transform business. His expertise in developing user-centric, technology-driven solutions has helped organizations streamline operations, enhance customer experiences, and drive growth.",
    bio2: "Ralph is deeply committed to fostering innovation across all of the industries he spans, empowering organizations to adapt to the rapidly evolving technological landscape, and championing advancements that define his investment strategies.",
    expertise: ["Financial Technology", "Capital Markets", "Strategic Planning", "Business Innovation"],
  },
];

const operations = [
  {
    name: "Jami Langham",
    title: "Chief Operations Officer",
  },
  {
    name: "Ryan Coleman",
    title: "Director of Operations",
  },
  {
    name: "Jay Nelson",
    title: "Variable Operations Director",
  },
  {
    name: "Andrea Shockey",
    title: "Chief Financial Officer",
  },
];


function LeadershipSection() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Leadership"
          title="Meet Our Team"
          subtitle="Experienced operators and strategists with deep automotive industry expertise."
        />
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-12"
        >
          {leadership.map((person) => (
            <motion.div
              key={person.name}
              variants={staggerItem}
              className="flex flex-col lg:flex-row gap-8 p-8 md:p-12 rounded-2xl bg-navy-900/50 border border-navy-800/50"
            >
              <div className="w-full lg:w-56 shrink-0">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 224px"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-bold text-cream-50 mb-1">
                  {person.name}
                </h3>
                <p className="text-gold-400 font-mono text-sm tracking-wider mb-4">
                  {person.title}
                </p>
                <p className="text-navy-300 leading-relaxed mb-4">
                  {person.bio}
                </p>
                <p className="text-navy-300 leading-relaxed mb-6">
                  {person.bio2}
                </p>
                <div className="flex flex-wrap gap-2">
                  {person.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs font-mono tracking-wider text-gold-400 bg-gold-400/10 border border-gold-400/20 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function OperationsSection() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="py-24 md:py-32 bg-navy-900/30">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Operations"
          title="Operations Team"
          subtitle="The hands-on leaders who run our dealerships day to day."
        />
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {operations.map((person) => (
            <motion.div
              key={person.name}
              variants={staggerItem}
              className="p-8 rounded-2xl bg-navy-950/50 border border-navy-800/30 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-navy-800 flex items-center justify-center mx-auto mb-5">
                <span className="font-display text-xl text-gold-400">
                  {person.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-cream-50 mb-1">
                {person.name}
              </h3>
              <p className="text-gold-400 font-mono text-xs tracking-wider">
                {person.title}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


export default function TeamPage() {
  return (
    <PageLayout>
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-gold-400 font-mono text-sm tracking-[0.2em] uppercase mb-6"
          >
            The Team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-cream-50 tracking-tight mb-6"
          >
            Operators <span className="text-gold-gradient">First</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            Our team has collectively managed billions in dealership revenue. We don&apos;t
            just invest in dealerships — we know how to run them.
          </motion.p>
        </div>
      </section>

      <GoldDivider />
      <LeadershipSection />
      <OperationsSection />

      <section className="py-24 md:py-32 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-50 mb-6">
            Want to Connect?
          </h2>
          <p className="text-navy-300 mb-8">
            Schedule a conversation with our leadership team.
          </p>
          <MagneticButton href="/contact" variant="primary" size="lg">
            Get in Touch
          </MagneticButton>
        </div>
      </section>
    </PageLayout>
  );
}
