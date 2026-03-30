"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 500, suffix: "+", label: "Placements Made", color: "text-accent" },
  { value: 98, suffix: "%", label: "Client Retention", color: "text-green" },
  { value: 45, suffix: "+", label: "Countries Reached", color: "text-purple" },
  { value: 14, suffix: " days", label: "Avg. Time to Shortlist", color: "text-cyan" },
];

function AnimatedCounter({
  value,
  suffix,
  color,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  color: string;
  label: string;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const [popped, setPopped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const duration = 2000;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setCount(value);
              setPopped(true);
              setTimeout(() => setPopped(false), 500);
            }
          };

          setTimeout(() => requestAnimationFrame(tick), delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="stat-card group">
      <div
        className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tabular-nums transition-transform duration-300 ${color} ${
          popped ? "animate-pop-scale" : ""
        }`}
      >
        {count}
        {suffix}
      </div>
      <div className="text-text-secondary text-xs sm:text-sm font-medium">{label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <section id="stats" className="section-padding bg-gradient-section overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full bg-accent/[0.08] text-accent mb-6">
            Our Track Record
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Results that <span className="gradient-text">speak for themselves</span>
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">
            Trusted by over 500 companies worldwide, our numbers reflect a
            commitment to excellence in every placement.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              color={stat.color}
              label={stat.label}
              delay={i * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
