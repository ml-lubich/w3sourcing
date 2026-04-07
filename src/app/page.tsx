import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrustedBy } from "@/components/trusted-by";
import { HomeHashScroll } from "@/components/home-hash-scroll";
import { FloatingCTA } from "@/components/floating-cta";
import { HomeJsonLd } from "@/components/home-json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FounderSpotlight } from "@/components/founder-spotlight";
import { FounderSpotlightCard } from "@/components/founder-spotlight-card";
import { getSiteUrl } from "@/lib/site";

const PracticeAreas = dynamic(() =>
  import("@/components/practice-areas").then((m) => ({ default: m.PracticeAreas })),
);
const WhyW3 = dynamic(() =>
  import("@/components/why-w3").then((m) => ({ default: m.WhyW3 })),
);
const HowItWorks = dynamic(() =>
  import("@/components/how-it-works").then((m) => ({ default: m.HowItWorks })),
);
const IndustriesFunctions = dynamic(() =>
  import("@/components/industries-functions").then((m) => ({
    default: m.IndustriesFunctions,
  })),
);
const FeatureTabs = dynamic(() =>
  import("@/components/feature-tabs").then((m) => ({ default: m.FeatureTabs })),
);
const Stats = dynamic(() => import("@/components/stats").then((m) => ({ default: m.Stats })));
const Comparison = dynamic(() =>
  import("@/components/comparison").then((m) => ({ default: m.Comparison })),
);
const Testimonials = dynamic(() =>
  import("@/components/testimonials").then((m) => ({ default: m.Testimonials })),
);
const FAQ = dynamic(() => import("@/components/faq"));
const Contact = dynamic(() =>
  import("@/components/contact").then((m) => ({ default: m.Contact })),
);
const CTABanner = dynamic(() =>
  import("@/components/cta-banner").then((m) => ({ default: m.CTABanner })),
);
const Footer = dynamic(() =>
  import("@/components/footer").then((m) => ({ default: m.Footer })),
);

const homeOgTitle = "Human-led executive search in technology, legal & banking";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: getSiteUrl().href,
    title: homeOgTitle,
  },
  twitter: {
    title: homeOgTitle,
  },
};

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <HomeHashScroll />
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[100] -translate-y-[150vh] rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg outline-none transition-transform focus:translate-y-0 focus:ring-2 focus:ring-white/40"
      >
        Skip to main content
      </a>
      <Header />
      <FloatingCTA />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <ScrollReveal>
          <TrustedBy />
        </ScrollReveal>
        <ScrollReveal>
          <FounderSpotlight>
            <FounderSpotlightCard />
          </FounderSpotlight>
        </ScrollReveal>
        <ScrollReveal>
          <PracticeAreas />
        </ScrollReveal>
        <ScrollReveal>
          <WhyW3 />
        </ScrollReveal>
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal>
          <IndustriesFunctions />
        </ScrollReveal>
        <ScrollReveal>
          <FeatureTabs />
        </ScrollReveal>
        <ScrollReveal>
          <Stats />
        </ScrollReveal>
        <ScrollReveal>
          <Comparison />
        </ScrollReveal>
        <ScrollReveal>
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal>
          <FAQ />
        </ScrollReveal>
        <ScrollReveal>
          <Contact />
        </ScrollReveal>
        <ScrollReveal>
          <CTABanner />
        </ScrollReveal>
      </main>
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </>
  );
}
