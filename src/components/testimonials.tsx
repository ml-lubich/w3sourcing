"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  { quote: "W3 Sourcing transformed our hiring process. They understood our culture from day one and delivered three exceptional engineering leaders within six weeks.", name: "Sarah Chen", title: "CTO, Series B Fintech", sector: "Technology" },
  { quote: "The level of discretion and market knowledge they bring to partner-level searches is unmatched. They've become our exclusive recruitment partner for lateral hires.", name: "James Morrison", title: "Managing Partner, Magic Circle Firm", sector: "Legal" },
  { quote: "In a competitive market for quant talent, W3 Sourcing consistently delivers candidates that other firms simply can't reach. Their network is extraordinary.", name: "Priya Sharma", title: "Head of Talent, Global Investment Bank", sector: "Finance" },
  { quote: "What sets W3 apart is their honesty. They'll tell you when a search is unrealistic and help you recalibrate. That kind of candour builds real trust.", name: "David Thompson", title: "VP Engineering, AI Startup", sector: "Technology" },
];

const AUTOPLAY_MS = 6000;

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setProgress(0);
  }, [current]);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setDirection(1);
          setCurrent((c) => (c + 1) % testimonials.length);
          return 0;
        }
        return p + (100 / (AUTOPLAY_MS / 50));
      });
    }, 50);
    return () => clearInterval(id);
  }, [current]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, filter: "blur(6px)" }),
    center: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, filter: "blur(6px)" }),
  };

  return (
    <section id="testimonials" className="relative py-28 sm:py-36 bg-navy overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue/[0.03] blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-16">
          <span className="text-blue font-semibold text-sm tracking-[0.2em] uppercase mb-4 block">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
            What Our <span className="gradient-text-blue">Clients</span> Say
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8, type: "spring" }} className="text-blue/[0.08] text-[140px] leading-none font-serif text-center mb-[-50px] select-none pointer-events-none">
            &ldquo;
          </motion.div>

          <div className="relative min-h-[280px] sm:min-h-[250px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={current} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-center absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl sm:text-2xl lg:text-3xl text-white/60 leading-relaxed font-light mb-10">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>
                <div>
                  <div className="text-white font-semibold text-lg">{testimonials[current].name}</div>
                  <div className="text-white/30 text-sm mt-1">{testimonials[current].title}</div>
                  <div className="inline-block mt-3 px-3 py-1 rounded-full bg-blue/10 border border-blue/10 text-blue-light text-xs font-medium">
                    {testimonials[current].sector}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="relative h-2 transition-all duration-500 rounded-full overflow-hidden" style={{ width: i === current ? 40 : 8 }} aria-label={`Testimonial ${i + 1}`}>
                <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${i === current ? "bg-blue/30" : "bg-white/10 hover:bg-white/20"}`} />
                {i === current && <motion.div className="absolute inset-y-0 left-0 bg-blue rounded-full" style={{ width: `${progress}%` }} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
