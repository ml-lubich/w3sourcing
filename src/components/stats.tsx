"use client";

import { useState, useEffect, useRef } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Placements Made", color: "text-accent" },
  { value: 98, suffix: "%", label: "Client Retention", color: "text-green" },
  { value: 45, suffix: "+", label: "Countries Reached", color: "text-pink" },
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
              setTimeout(() => setPopped(false), 400);
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
    <div
      ref={ref}
      className="bg-white rounded-2xl border border-gray-border p-8 text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,64,0.06)] hover:-translate-y-1"
    >
      <div
        className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tabular-nums ${color} ${
          popped ? "animate-pop-scale" : ""
        }`}
      >
        {count}
        {suffix}
      </div>
      <div className="text-text-secondary text-sm font-medium">{label}</div>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" className="section-padding bg-gray-light overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-block text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full bg-accent/10 text-accent mb-6">
            Our Track Record
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Results that <span className="text-accent">speak for themselves</span>
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">
            Trusted by over 500 companies worldwide, our numbers reflect a
            commitment to excellence in every placement.
          </p>
        </div>

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
