"use client";

import { useRef, useState, useEffect } from "react";
import { SplitWordsRich } from "@/components/split-words";
import { PERRY_LINKEDIN_URL } from "@/content/contact-links";
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
            href={PERRY_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_30px_color-mix(in_srgb,var(--accent)_34%,transparent)] transition-all duration-200 hover:bg-accent-hover sm:w-auto"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Message us on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
