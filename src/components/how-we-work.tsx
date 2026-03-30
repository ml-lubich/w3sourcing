"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  { number: "01", title: "Discovery", description: "We deeply understand your organisation, culture, team dynamics, and the specific qualities that define success in the role." },
  { number: "02", title: "Targeted Search", description: "Leveraging sector-specific networks and rigorous assessment methodology, we identify and engage exceptional candidates." },
  { number: "03", title: "Collaboration", description: "You're involved at every stage. Clear timelines, honest feedback, and regular updates — no black boxes, no surprises." },
  { number: "04", title: "Partnership", description: "Our relationship doesn't end at placement. We ensure successful integration and continue to support your talent strategy." },
];

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} id="process" className="relative py-28 sm:py-36 bg-navy-light overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />
      </motion.div>
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-blue font-semibold text-sm tracking-[0.2em] uppercase mb-4 block">Our Process</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
            How We <span className="gradient-text-blue">Work</span>
          </h2>
          <p className="mt-5 text-lg text-white/35 max-w-2xl mx-auto leading-relaxed">
            A proven, transparent process built on partnership — not transactions.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="hidden lg:block absolute top-[42px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px origin-left"
            style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.4), rgba(139,92,246,0.2), rgba(59,130,246,0.4))" }}
          />

          <div className="grid lg:grid-cols-4 gap-10 lg:gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.number} custom={i} variants={stepVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="relative group">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue to-blue-dark flex items-center justify-center mb-6 mx-auto lg:mx-0 shadow-lg shadow-blue/20 group-hover:shadow-blue/40 transition-shadow duration-500"
                >
                  <span className="text-white font-bold text-sm tracking-wide">{step.number}</span>
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="lg:hidden absolute left-1/2 top-16 w-px h-10 -translate-x-1/2 bg-gradient-to-b from-blue/30 to-transparent" />
                )}
                <div className="text-center lg:text-left">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-light transition-colors duration-300">{step.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed group-hover:text-white/45 transition-colors duration-500">{step.description}</p>
                </div>

                {/* Step connector pulse - desktop */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
                    className="hidden lg:block absolute top-[28px] -right-3 w-6 h-6"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="w-1.5 h-1.5 rounded-full bg-blue/40 mx-auto"
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
