"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-8"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple/[0.04] blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-cyan/[0.04] blur-3xl" />

      {/* Floating decorative shapes */}
      <div className="absolute top-[15%] right-[10%] w-16 h-16 rounded-2xl bg-gradient-to-br from-purple/[0.08] to-accent/[0.04] rotate-12 animate-floatY" />
      <div className="absolute bottom-[25%] left-[8%] w-12 h-12 rounded-full bg-cyan/[0.06] animate-floatY-slow" />
      <div className="absolute top-[40%] left-[15%] w-8 h-8 rounded-lg bg-accent/[0.06] rotate-45 animate-floatY" />
      <div className="absolute top-[20%] right-[20%] w-20 h-20 rounded-full bg-green/[0.04] animate-floatY-slow" />
      <div className="absolute bottom-[30%] right-[8%] w-6 h-6 rounded-full bg-pink/[0.08] animate-floatY" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-6xl px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-accent/[0.06] border border-accent/10"
        >
          <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
          <span className="text-accent text-sm font-semibold">
            Trusted by 500+ Companies Worldwide
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-primary leading-[1.08] tracking-tight mb-6"
        >
          Find Exceptional Talent
          <br />
          <span className="gradient-text-shimmer">Faster Than Ever</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="max-w-xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed mb-10"
        >
          W3 Sourcing connects world-class organisations with exceptional
          professionals across Tech, Legal & Finance. London to Singapore
          and beyond.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a href="#contact" className="btn-primary text-base rounded-xl">
            <span>Book a Demo</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="#features" className="btn-secondary text-base rounded-xl">
            See How It Works
          </a>
        </motion.div>

        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl"
        >
          <div className="mockup-gradient rounded-2xl aspect-[16/9] mockup-shadow-lg overflow-hidden ring-1 ring-accent/[0.08]">
            <div className="w-full h-full p-4 sm:p-6 lg:p-8 flex flex-col">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-pink/40" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow/40" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green/40" />
                </div>
                <div className="flex-1 mx-3 h-6 sm:h-7 bg-white/60 rounded-lg" />
              </div>
              {/* Dashboard content */}
              <div className="flex-1 grid grid-cols-5 gap-3 sm:gap-4">
                {/* Sidebar */}
                <div className="col-span-1 space-y-2 sm:space-y-3 hidden sm:block">
                  <div className="h-7 bg-accent/10 rounded-lg" />
                  <div className="h-5 bg-gray-border/50 rounded-lg" />
                  <div className="h-5 bg-gray-border/50 rounded-lg" />
                  <div className="h-5 bg-gray-border/50 rounded-lg" />
                  <div className="h-5 bg-purple/5 rounded-lg" />
                  <div className="h-5 bg-gray-border/50 rounded-lg" />
                </div>
                {/* Main area */}
                <div className="col-span-5 sm:col-span-4 space-y-3 sm:space-y-4">
                  {/* Metric cards row */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-white/80 rounded-xl border border-accent/[0.08] p-2 sm:p-3">
                      <div className="h-2 bg-gray-border/60 rounded w-1/2 mb-2" />
                      <div className="h-5 sm:h-6 bg-accent/15 rounded w-2/3" />
                    </div>
                    <div className="bg-white/80 rounded-xl border border-accent/[0.08] p-2 sm:p-3">
                      <div className="h-2 bg-gray-border/60 rounded w-2/3 mb-2" />
                      <div className="h-5 sm:h-6 bg-green/15 rounded w-3/4" />
                    </div>
                    <div className="bg-white/80 rounded-xl border border-accent/[0.08] p-2 sm:p-3">
                      <div className="h-2 bg-gray-border/60 rounded w-1/3 mb-2" />
                      <div className="h-5 sm:h-6 bg-purple/15 rounded w-1/2" />
                    </div>
                  </div>
                  {/* Table placeholder */}
                  <div className="flex-1 bg-white/60 rounded-xl border border-accent/[0.06] p-3 sm:p-4 space-y-2">
                    <div className="flex gap-4 mb-3">
                      <div className="h-3 bg-gray-border/70 rounded w-1/4" />
                      <div className="h-3 bg-gray-border/50 rounded w-1/5" />
                      <div className="h-3 bg-gray-border/50 rounded w-1/6" />
                      <div className="h-3 bg-gray-border/50 rounded w-1/5" />
                    </div>
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className="flex gap-4 py-1">
                        <div className="h-2.5 bg-gray-border/40 rounded w-1/4" />
                        <div className="h-2.5 bg-gray-border/30 rounded w-1/5" />
                        <div className="h-2.5 bg-gray-border/30 rounded w-1/6" />
                        <div className={`h-2.5 rounded w-12 ${row % 2 === 0 ? 'bg-green/20' : 'bg-accent/15'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
