"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 bg-navy overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue/[0.08] blur-[100px] animate-mesh" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/[0.06] blur-[80px] animate-mesh-alt" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.03] blur-[120px] animate-mesh" />
      </motion.div>

      <motion.div style={{ scale }} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <div className="inline-block mb-6 px-5 py-2 rounded-full bg-blue/10 border border-blue/15">
            <span className="text-blue-light text-sm font-medium">Ready to get started?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
            Let&apos;s Build Your <span className="gradient-text">Dream Team</span>
          </h2>

          <p className="text-lg sm:text-xl text-white/35 max-w-2xl mx-auto leading-relaxed mb-10">
            Whether you&apos;re scaling a team or making a strategic hire, we&apos;re here to deliver exceptional talent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary text-white font-semibold px-10 py-4 rounded-full text-base">
              Start a Conversation
            </motion.a>
            <motion.a href="mailto:info@w3sourcing.com" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary text-white/70 font-medium px-10 py-4 rounded-full text-base">
              Email Us Directly
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
