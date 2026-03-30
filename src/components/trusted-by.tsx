"use client";

import { motion } from "framer-motion";

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
    <div className="flex items-center justify-center px-8 py-4 mx-4 whitespace-nowrap">
      <span className="text-white/15 font-semibold text-lg tracking-wide hover:text-white/30 transition-colors duration-500">
        {name}
      </span>
    </div>
  );
}

export function TrustedBy() {
  return (
    <section className="relative py-16 overflow-hidden bg-navy border-y border-white/[0.03]">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-transparent to-navy z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <span className="text-white/25 text-sm font-medium tracking-[0.2em] uppercase">
          Trusted by industry leaders
        </span>
      </motion.div>

      {/* Marquee row 1 */}
      <div className="relative flex overflow-hidden mb-4">
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
        <div className="animate-marquee flex shrink-0" style={{ animationDirection: "reverse", animationDuration: "35s" }}>
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
