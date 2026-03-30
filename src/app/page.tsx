"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrustedBy } from "@/components/trusted-by";
import { FeatureTabs } from "@/components/feature-tabs";
import { Stats } from "@/components/stats";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { Contact } from "@/components/contact";
import { CTABanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";
import { FloatingCTA } from "@/components/floating-cta";

export default function Home() {
  return (
    <>
      <Header />
      <FloatingCTA />
      <main>
        <Hero />
        <TrustedBy />
        <FeatureTabs />
        <Stats />
        <Testimonials />
        <FAQ />
        <Contact />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
