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
      className="section-padding section-band-glass relative overflow-hidden"
      aria-labelledby="cta-banner-heading"
    >
      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-7xl px-6 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="glass-panel-liquid grid items-center gap-8 rounded-2xl px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1fr_auto] lg:gap-12 lg:px-10">
          <div className="max-w-3xl">
            <span className="glass-chip mb-5 inline-block rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              Start a conversation
            </span>
            <h2
              id="cta-banner-heading"
              className="text-3xl font-extrabold leading-[1.15] tracking-tight text-primary sm:text-4xl lg:text-5xl"
            >
              <SplitWordsRich
                className="justify-start"
                segments={[
                  { text: "Hire with clarity for your" },
                  {
                    text: "next stage of growth",
                    className: "text-accent",
                  },
                ]}
                stagger={0.04}
                delayStart={0.06}
                animate={headingSplit}
              />
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              Tell us about the role, market, and timeline. We&apos;ll come back with practical next steps,
              honest feasibility, and the places where experienced judgment can add the most value.
            </p>
          </div>
          <a
            href="mailto:info@w3sourcing.com"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_30px_color-mix(in_srgb,var(--accent)_34%,transparent)] transition-all duration-200 hover:bg-accent-hover sm:w-auto"
          >
            <Mail className="size-5" strokeWidth={2} aria-hidden />
            Email us directly
          </a>
        </div>
      </div>
    </section>
  );
}
