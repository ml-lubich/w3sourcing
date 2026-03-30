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
    <div className="flex items-center justify-center px-8 py-3 mx-3 whitespace-nowrap">
      <span className="text-gray font-semibold text-base tracking-wide hover:text-accent/50 transition-colors duration-300">
        {name}
      </span>
    </div>
  );
}

export function TrustedBy() {
  return (
    <section className="relative py-16 overflow-hidden bg-white">
      {/* Gradient fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <span className="text-gray text-sm font-medium tracking-[0.15em] uppercase">
          Trusted by industry leaders
        </span>
      </motion.div>

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
