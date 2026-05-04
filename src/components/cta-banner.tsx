"use client";

import { useRef, useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { SplitWordsRich } from "@/components/split-words";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

export function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const headingSplit = useSplitWordsAnimate(inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="section-cta-gradient relative overflow-hidden py-12 sm:py-16"
      aria-labelledby="cta-banner-heading"
    >
      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-4xl px-6 text-center transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2
          id="cta-banner-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-[1.15] tracking-tight mb-5"
        >
          <SplitWordsRich
            className="justify-center"
            segments={[
              { text: "Hire with the rigour your" },
              {
                text: "next inflection point deserves",
                className: "text-accent dark:text-sky-300",
              },
            ]}
            stagger={0.04}
            delayStart={0.06}
            animate={headingSplit}
          />
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Share the mandate, market, and timeline. We&apos;ll respond with how principal-led experts would run the
          search: sector mapping, milestones, candid feasibility, and where human judgment beats automation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:info@w3sourcing.com"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-[0_10px_30px_color-mix(in_srgb,var(--accent)_44%,transparent)] transition-all duration-200 hover:bg-accent-hover"
          >
            <Mail className="size-5" strokeWidth={2} aria-hidden />
            Email us directly
          </a>
        </div>
      </div>
    </section>
  );
}
