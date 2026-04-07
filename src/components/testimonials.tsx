"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { SplitWordsRich } from "@/components/split-words";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import {
  SURFACE_REVEAL_DURATION_LITE,
  surfaceCardWhileHover,
  surfaceRevealEnterTransition,
} from "@/lib/surface-reveal-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

const testimonials = [
  {
    quote:
      "W3 Sourcing transformed our hiring process. They understood our culture from day one and delivered three exceptional engineering leaders within six weeks.",
    name: "Sarah Chen",
    title: "CTO, Series B Fintech",
    sector: "Technology",
    sectorColor: "text-accent",
  },
  {
    quote:
      "The level of discretion and market knowledge they bring to partner-level searches is unmatched. They've become our exclusive recruitment partner for lateral hires.",
    name: "James Morrison",
    title: "Managing Partner, Magic Circle Firm",
    sector: "Legal",
    sectorColor: "text-text-secondary",
  },
  {
    quote:
      "In a competitive market for quant talent, W3 Sourcing consistently delivers candidates that other firms simply can't reach. Their network is extraordinary.",
    name: "Priya Sharma",
    title: "Head of Talent, Global Investment Bank",
    sector: "Finance",
    sectorColor: "text-success",
  },
  {
    quote:
      "What sets W3 apart is their honesty. They'll tell you when a search is unrealistic and help you recalibrate. That kind of candour builds real trust.",
    name: "David Thompson",
    title: "VP Engineering, AI Startup",
    sector: "Technology",
    sectorColor: "text-accent",
  },
  {
    quote:
      "We needed a head of compliance who understood both UK and EU regulatory landscapes. W3 found exactly that person in under three weeks.",
    name: "Elena Rodriguez",
    title: "CFO, European Challenger Bank",
    sector: "Finance",
    sectorColor: "text-success",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;
  const headingSplit = useSplitWordsAnimate(visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
    resetTimer();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x;
    if (Math.abs(swipe) > 50) {
      if (swipe < 0) {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % testimonials.length);
      } else {
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
      resetTimer();
    }
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-padding section-band-glass overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="glass-chip inline-block text-xs font-semibold tracking-[0.12em] uppercase px-3 py-1.5 rounded-lg text-accent mb-6">
            Client voices
          </span>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-[1.15]"
          >
            <SplitWordsRich
              className="justify-center"
              segments={[
                { text: "Trusted by" },
                { text: "discerning", className: "text-accent" },
                { text: "teams" },
              ]}
              stagger={0.04}
              delayStart={0.06}
              animate={headingSplit}
            />
          </h2>
        </div>

        {/* Testimonial Slider */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={reduced ? false : { opacity: 0, y: liteMotion ? 10 : 16 }}
          animate={
            visible || reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: liteMotion ? 10 : 16 }
          }
          transition={surfaceRevealEnterTransition(liteMotion, reduced, {
            delay: reduced ? 0 : 0.1,
          })}
        >
          <div className="relative min-h-[320px] sm:min-h-[260px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: SURFACE_REVEAL_DURATION_LITE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                whileHover={surfaceCardWhileHover(liteMotion)}
                className="glass-panel rounded-2xl p-8 sm:p-10 cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <div className="text-accent text-5xl leading-none mb-3 select-none opacity-25 font-sans">
                  &ldquo;
                </div>
                <p className="text-primary text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8">
                  {testimonials[current].quote}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="glass-chip w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-xs">
                        {testimonials[current].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-primary text-sm">
                        {testimonials[current].name}
                      </div>
                      <div className="text-text-secondary text-xs sm:text-sm">
                        {testimonials[current].title}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`glass-chip text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-auto sm:ml-auto ${testimonials[current].sectorColor}`}
                  >
                    {testimonials[current].sector}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length)}
              className="glass-chip w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:border-accent/35"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "w-7 h-2.5 bg-accent"
                    : "w-2.5 h-2.5 bg-gray-border hover:bg-gray"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
            <button
              onClick={() => goTo((current + 1) % testimonials.length)}
              className="glass-chip w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:border-accent/35"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
