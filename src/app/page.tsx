"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { WhyUs } from "@/components/why-us";
import { HowWeWork } from "@/components/how-we-work";
import { Industries } from "@/components/industries";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <HowWeWork />
        <Industries />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
