"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "W3 Sourcing transformed our hiring process. They understood our culture from day one and delivered three exceptional engineering leaders within six weeks.",
    name: "Sarah Chen",
    title: "CTO, Series B Fintech",
    sector: "Technology",
  },
  {
    quote:
      "The level of discretion and market knowledge they bring to partner-level searches is unmatched. They've become our exclusive recruitment partner for lateral hires.",
    name: "James Morrison",
    title: "Managing Partner, Magic Circle Firm",
    sector: "Legal",
  },
  {
    quote:
      "In a competitive market for quant talent, W3 Sourcing consistently delivers candidates that other firms simply can't reach. Their network is extraordinary.",
    name: "Priya Sharma",
    title: "Head of Talent, Global Investment Bank",
    sector: "Finance",
  },
  {
    quote:
      "What sets W3 apart is their honesty. They'll tell you when a search is unrealistic and help you recalibrate. That kind of candour builds real trust.",
    name: "David Thompson",
    title: "VP Engineering, AI Startup",
    sector: "Technology",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="relative py-28 sm:py-36 bg-navy overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue/3 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-blue font-semibold text-sm tracking-[0.2em] uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
            What Our <span className="gradient-text-blue">Clients</span> Say
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Quote icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-blue/10 text-[120px] leading-none font-serif text-center mb-[-40px] select-none"
          >
            &ldquo;
          </motion.div>

          {/* Carousel */}
          <div className="relative min-h-[250px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <p className="text-xl sm:text-2xl lg:text-3xl text-white/70 leading-relaxed font-light mb-10 italic">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>
                <div>
                  <div className="text-white font-semibold text-lg">
                    {testimonials[current].name}
                  </div>
                  <div className="text-white/35 text-sm mt-1">
                    {testimonials[current].title}
                  </div>
                  <div className="inline-block mt-3 px-3 py-1 rounded-full bg-blue/10 text-blue-light text-xs font-medium">
                    {testimonials[current].sector}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-500 rounded-full ${
                  i === current
                    ? "w-8 h-2 bg-blue"
                    : "w-2 h-2 bg-white/15 hover:bg-white/25"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
