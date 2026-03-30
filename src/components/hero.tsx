"use client";

import { useRef, useEffect, useState } from "react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-white pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      <div
        className={`relative z-10 mx-auto max-w-5xl px-6 text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-gray-light border border-gray-border">
          <span className="w-2 h-2 rounded-full bg-green" />
          <span className="text-text-secondary text-sm font-medium">
            Trusted by 500+ Companies Worldwide
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.08] tracking-tight mb-6">
          Connecting Exceptional Talent
          <br />
          <span className="text-accent">With World-Class Organisations</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed mb-10">
          W3 Sourcing is a global recruitment firm specialising in Tech, Legal &
          Finance — placing exceptional professionals across the US, UK, EU, UAE, and Asia.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a
            href="#contact"
            className="bg-accent text-white font-semibold text-base py-3.5 px-8 rounded-full transition-all duration-200 hover:opacity-90 inline-flex items-center gap-2"
          >
            Book a Call
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#features"
            className="text-primary font-semibold text-base py-3.5 px-8 rounded-full border-2 border-gray-border transition-all duration-200 hover:border-accent hover:text-accent"
          >
            See How It Works
          </a>
        </div>

        {/* Dashboard Mockup */}
        <div className="mx-auto max-w-4xl">
          <div className="bg-gray-light rounded-2xl border border-gray-border overflow-hidden shadow-[0_20px_60px_rgba(0,0,64,0.08)]">
            <div className="w-full p-4 sm:p-6 lg:p-8 flex flex-col">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-pink/40" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow/40" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green/40" />
                </div>
                <div className="flex-1 mx-3 h-6 sm:h-7 bg-white rounded-lg" />
              </div>
              {/* Dashboard content */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div className="bg-white rounded-xl border border-gray-border p-3">
                  <div className="h-2 bg-gray-border rounded w-1/2 mb-2" />
                  <div className="h-5 bg-accent/15 rounded w-2/3" />
                </div>
                <div className="bg-white rounded-xl border border-gray-border p-3">
                  <div className="h-2 bg-gray-border rounded w-2/3 mb-2" />
                  <div className="h-5 bg-green/15 rounded w-3/4" />
                </div>
                <div className="bg-white rounded-xl border border-gray-border p-3">
                  <div className="h-2 bg-gray-border rounded w-1/3 mb-2" />
                  <div className="h-5 bg-cyan/15 rounded w-1/2" />
                </div>
              </div>
              {/* Table */}
              <div className="bg-white rounded-xl border border-gray-border p-3 sm:p-4 space-y-2">
                <div className="flex gap-4 mb-3">
                  <div className="h-3 bg-gray-border rounded w-1/4" />
                  <div className="h-3 bg-gray-border/60 rounded w-1/5" />
                  <div className="h-3 bg-gray-border/60 rounded w-1/6" />
                  <div className="h-3 bg-gray-border/60 rounded w-1/5" />
                </div>
                {[1, 2, 3, 4].map((row) => (
                  <div key={row} className="flex gap-4 py-1">
                    <div className="h-2.5 bg-gray-border/50 rounded w-1/4" />
                    <div className="h-2.5 bg-gray-border/40 rounded w-1/5" />
                    <div className="h-2.5 bg-gray-border/40 rounded w-1/6" />
                    <div className={`h-2.5 rounded w-12 ${row % 2 === 0 ? "bg-green/20" : "bg-accent/15"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
