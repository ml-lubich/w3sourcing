"use client";

import { useRef, useState, useEffect } from "react";

export function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-gradient-cta relative overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-purple/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan/[0.03] blur-3xl" />

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-4xl px-6 text-center transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
          Ready to build your{" "}
          <span className="bg-gradient-to-r from-accent-light to-cyan bg-clip-text text-transparent">dream team?</span>
        </h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10">
          Join 500+ companies who trust W3 Sourcing to find exceptional talent
          across Tech, Legal & Finance. Book a free consultation today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="bg-gradient-to-r from-purple to-accent text-white font-semibold text-base py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <span>Book a Demo</span>
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
            className="text-white/50 hover:text-white font-medium text-base transition-colors duration-200 inline-flex items-center gap-2"
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
