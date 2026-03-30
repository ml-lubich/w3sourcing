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

function SectionDivider() {
  return <div className="section-divider" />;
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <HowWeWork />
        <Stats />
        <SectionDivider />
        <WhyUs />
        <SectionDivider />
        <Industries />
        <SectionDivider />
        <Testimonials />
        <SectionDivider />
        <GlobalOffices />
        <SectionDivider />
        <CTA />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
