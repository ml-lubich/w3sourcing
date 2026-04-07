"use client";

import { useRef, useState, useEffect } from "react";
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
      className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-br from-footer via-gray-light to-indigo-100/85 dark:via-slate-900 dark:to-indigo-950"
      aria-labelledby="cta-banner-heading"
    >
      <div
        className="absolute inset-0 opacity-25 dark:opacity-40 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%\,rgba(79\,70\,229\,0.45)\,transparent)]"
        aria-hidden
      />
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
                text: "next chapter deserves",
                className: "text-accent dark:text-indigo-300",
              },
            ]}
            stagger={0.04}
            delayStart={0.06}
            animate={headingSplit}
          />
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Share your mandate and timeline. We&apos;ll respond with how principal-led experts would run the
          search—sector mapping, milestones, candid feasibility, and where human judgment matters more than automation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="bg-accent text-white font-semibold text-base py-3.5 px-8 rounded-xl shadow-[0_8px_28px_rgb(79_70_229_/_0.4)] transition-all duration-200 hover:bg-accent-hover inline-flex items-center gap-2"
          >
            Get in touch
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="mailto:info@w3sourcing.com"
            className="text-muted hover:text-foreground font-medium text-base transition-colors duration-200 inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Or email us directly
          </a>
        </div>
      </div>
    </section>
  );
}
