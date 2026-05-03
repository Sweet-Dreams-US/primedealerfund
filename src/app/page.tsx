"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import Hero from "@/components/home/Hero";
import LatestNews from "@/components/home/LatestNews";
import VideoSpotlight from "@/components/home/VideoSpotlight";
import PortfolioShowcase from "@/components/home/PortfolioShowcase";
import ThesisCards from "@/components/home/ThesisCards";
import NumbersThatMatter from "@/components/home/NumbersThatMatter";
import Leadership from "@/components/home/Leadership";
import HowItWorks from "@/components/home/HowItWorks";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LatestNews />
        <VideoSpotlight />
        <PortfolioShowcase />
        <ThesisCards />
        <NumbersThatMatter />
        <Leadership />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
