"use client";

import { useRef, useState, useEffect } from "react";

const companies = [
  "Goldman Sachs",
  "Sequoia Capital",
  "Andreessen Horowitz",
  "Clifford Chance",
  "Stripe",
  "Linklaters",
  "Morgan Stanley",
  "Y Combinator",
  "Allen & Overy",
  "Revolut",
  "JP Morgan",
  "Freshfields",
  "Accel Partners",
  "Coinbase",
  "Slaughter and May",
  "Tiger Global",
];

function LogoItem({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center px-8 py-3 mx-3 whitespace-nowrap">
      <span className="text-gray font-semibold text-base tracking-wide">
        {name}
      </span>
    </div>
  );
}

export function TrustedBy() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-16 overflow-hidden bg-gray-light">
      {/* Gradient fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-light to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-light to-transparent z-10 pointer-events-none" />

      <div
        className={`text-center mb-8 transition-all duration-600 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="text-gray text-sm font-medium tracking-[0.15em] uppercase">
          Trusted by industry leaders
        </span>
      </div>

      {/* Marquee row 1 */}
      <div className="relative flex overflow-hidden mb-3">
        <div className="animate-marquee flex shrink-0">
          {companies.map((company) => (
            <LogoItem key={company} name={company} />
          ))}
          {companies.map((company) => (
            <LogoItem key={`dup-${company}`} name={company} />
          ))}
        </div>
      </div>

      {/* Marquee row 2 - reverse */}
      <div className="relative flex overflow-hidden">
        <div
          className="animate-marquee flex shrink-0"
          style={{ animationDirection: "reverse", animationDuration: "35s" }}
        >
          {[...companies].reverse().map((company) => (
            <LogoItem key={`rev-${company}`} name={company} />
          ))}
          {[...companies].reverse().map((company) => (
            <LogoItem key={`rev-dup-${company}`} name={company} />
          ))}
        </div>
      </div>
    </section>
  );
}
