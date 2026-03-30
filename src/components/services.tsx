"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "VC-Backed Technology",
    description: "We partner with high-growth, venture-backed technology companies to build transformative teams. From mid-level engineers to C-suite leadership.",
    tags: ["Engineering", "Product", "AI/ML", "C-Suite", "GTM"],
    accent: "blue",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
      </svg>
    ),
    title: "Legal Recruitment",
    description: "Placing exceptional lawyers at the world's leading US and UK law firms. From associate hires through to partner-level lateral moves.",
    tags: ["Associates", "Counsel", "Partners", "In-House", "Practice Leaders"],
    accent: "gold",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: "Banking & Finance",
    description: "Connecting top-tier talent with global financial institutions. Investment banking, corporate finance, risk & compliance, and advisory.",
    tags: ["IB", "M&A", "Risk", "Compliance", "Private Banking"],
    accent: "emerald",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const accentColors: Record<string, { icon: string; tag: string; glow: string; border: string; line: string }> = {
  blue: {
    icon: "text-blue bg-blue/10 group-hover:bg-blue/20 group-hover:shadow-lg group-hover:shadow-blue/20",
    tag: "bg-blue/10 text-blue-light border-blue/10 hover:bg-blue/15",
    glow: "bg-blue/15", border: "group-hover:border-blue/15",
    line: "bg-gradient-to-r from-blue/50 to-blue-light/50",
  },
  gold: {
    icon: "text-gold bg-gold/10 group-hover:bg-gold/20 group-hover:shadow-lg group-hover:shadow-gold/20",
    tag: "bg-gold/10 text-gold-light border-gold/10 hover:bg-gold/15",
    glow: "bg-gold/15", border: "group-hover:border-gold/15",
    line: "bg-gradient-to-r from-gold/50 to-gold-light/50",
  },
  emerald: {
    icon: "text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/20",
    tag: "bg-emerald-500/10 text-emerald-300 border-emerald-500/10 hover:bg-emerald-500/15",
    glow: "bg-emerald-500/15", border: "group-hover:border-emerald-500/15",
    line: "bg-gradient-to-r from-emerald-500/50 to-emerald-300/50",
  },
};

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={sectionRef} id="services" className="relative py-28 sm:py-36 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-25" />
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue/[0.03] blur-[120px] rounded-full" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block text-blue font-semibold text-sm tracking-[0.2em] uppercase mb-4">Our Expertise</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
            Three Pillars of <span className="gradient-text-blue">Excellence</span>
          </h2>
          <p className="mt-5 text-lg text-white/35 max-w-2xl mx-auto leading-relaxed">
            Deep specialisation across three high-impact sectors, delivering exceptional talent to the world&apos;s most ambitious organisations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => {
            const colors = accentColors[service.accent];
            return (
              <motion.div
                key={service.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10, transition: { duration: 0.4, ease: "easeOut" } }}
                className={`group relative glass-card rounded-2xl p-8 lg:p-10 overflow-hidden cursor-pointer transition-colors duration-500 ${colors.border}`}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute top-0 left-0 right-0 h-[2px] origin-left ${colors.line}`}
                />
                <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full ${colors.glow} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.15 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 ${colors.icon}`}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-white/40 leading-relaxed text-sm mb-6">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-300 cursor-default ${colors.tag}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
