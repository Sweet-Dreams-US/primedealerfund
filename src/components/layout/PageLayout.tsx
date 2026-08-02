"use client";

import Header from "./Header";
import Footer from "./Footer";
import FloatingCTA from "./FloatingCTA";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <Header />
      {/* pb on mobile clears the sticky "Schedule a Call" bar in FloatingCTA */}
      <main className="pt-24 pb-24 lg:pb-0">{children}</main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
