"use client";

import { useEffect, useState } from "react";

function ParticleGrid() {
  const [dots, setDots] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setDots(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold/30"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            animation: `pulse-dot 4s ease-in-out infinite`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-navy-light to-indigo">
      {/* Background effects */}
      <div className="hero-grid absolute inset-0" />
      <ParticleGrid />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-light/20 blur-3xl floating-orb" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gold/5 blur-3xl floating-orb-delayed" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-gold/20 bg-gold/5">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-sm font-medium tracking-wide">
            Global Recruitment Excellence
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
          Global Recruitment{" "}
          <br className="hidden sm:block" />
          Excellence for{" "}
          <span className="gradient-text">
            Tech, Legal
            <br className="hidden sm:block" />
            & Finance
          </span>{" "}
          Leaders
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/60 leading-relaxed mb-10">
          Connecting exceptional talent with world-class organisations across
          the US, UK, EU, UAE, and Asia. Trusted by the world&apos;s most ambitious companies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="btn-primary text-navy font-semibold px-8 py-4 rounded-full text-base"
          >
            Get in Touch
          </a>
          <a
            href="#services"
            className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors px-6 py-4 text-base font-medium"
          >
            Explore Services
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-white/30 text-sm">
          <span>London</span>
          <span className="hidden sm:inline">·</span>
          <span>Singapore</span>
          <span className="hidden sm:inline">·</span>
          <span>New York</span>
          <span className="hidden sm:inline">·</span>
          <span>Dubai</span>
          <span className="hidden sm:inline">·</span>
          <span>Hong Kong</span>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
