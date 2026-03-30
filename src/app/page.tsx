"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrustedBy } from "@/components/trusted-by";
import { Services } from "@/components/services";
import { HowWeWork } from "@/components/how-we-work";
import { Stats } from "@/components/stats";
import { WhyUs } from "@/components/why-us";
import { Industries } from "@/components/industries";
import { Testimonials } from "@/components/testimonials";
import { GlobalOffices } from "@/components/global-offices";
import { CTA } from "@/components/cta";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Services />
        <HowWeWork />
        <Stats />
        <WhyUs />
        <Industries />
        <Testimonials />
        <GlobalOffices />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
