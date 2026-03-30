"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const headlineWords = [
  { text: "Recruitment", highlight: false },
  { text: "for", highlight: false },
  { text: "Tech,", highlight: true },
  { text: "Legal", highlight: true },
  { text: "&", highlight: true },
  { text: "Finance", highlight: true },
  { text: "Leaders", highlight: false },
];

function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 1.5, duration: 1.5, ease: "easeOut" }}
      className={className}
    />
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 0.85]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy"
    >
      <div className="absolute inset-0 bg-grid opacity-40" />

      <motion.div style={{ y: blobY }} className="absolute inset-0 pointer-events-none">
        <FloatingShape className="absolute top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue/[0.07] blur-[120px] animate-mesh" delay={0} />
        <FloatingShape className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-[120px] animate-mesh-alt" delay={0.3} />
        <FloatingShape className="absolute bottom-[10%] left-[25%] w-[700px] h-[700px] rounded-full bg-gold/[0.03] blur-[140px] animate-mesh" delay={0.6} />
        <FloatingShape className="absolute -bottom-[15%] right-[20%] w-[400px] h-[400px] rounded-full bg-blue-light/[0.05] blur-[100px] animate-mesh-alt" delay={0.2} />
      </motion.div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[15%] left-[10%] w-3 h-3 border border-blue/20 rotate-45" />
        <motion.div animate={{ y: [10, -10, 10], rotate: [360, 180, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[25%] right-[15%] w-4 h-4 border border-gold/15 rounded-full" />
        <motion.div animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute bottom-[35%] left-[20%] w-2 h-2 bg-blue/20 rounded-full" />
        <motion.div animate={{ y: [5, -20, 5], rotate: [0, 90, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute top-[40%] right-[8%] w-5 h-5 border border-accent/10 rotate-12" />
        <motion.div animate={{ y: [-8, 12, -8] }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} className="absolute bottom-[25%] right-[25%] w-2.5 h-2.5 bg-gold/15 rotate-45" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[60%] left-[8%] w-20 h-20 border border-blue/5 rounded-full" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[12%] right-[30%] w-32 h-32 border border-accent/5 rounded-full" />
      </div>

      <motion.div style={{ y, opacity, scale }} className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 mb-10 px-5 py-2.5 rounded-full border border-blue/20 bg-blue/5 backdrop-blur-sm"
        >
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="w-2 h-2 rounded-full bg-blue shadow-lg shadow-blue/50" />
          <span className="text-blue-light text-sm font-medium tracking-wide">Global Recruitment Excellence</span>
        </motion.div>

        <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.08] tracking-tight mb-6 sm:mb-8">
          <span className="flex flex-wrap justify-center gap-x-[0.3em]">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, filter: "blur(12px)", rotateX: -30 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`inline-block ${word.highlight ? "gradient-text" : ""}`}
                style={{ willChange: "transform, opacity, filter" }}
              >
                {word.text}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/40 leading-relaxed mb-10 sm:mb-12 px-2 sm:px-0"
        >
          Connecting exceptional talent with world-class organisations across
          the US, UK, EU, UAE, and Asia. Trusted by the world&apos;s most ambitious companies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="btn-primary text-white font-semibold px-10 py-4 rounded-full text-base"
          >
            Start a Conversation
          </motion.a>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="btn-secondary text-white/70 font-medium px-10 py-4 rounded-full text-base group flex items-center gap-2"
          >
            Explore Services
            <motion.svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
              <path d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {["London", "Singapore", "New York", "Dubai", "Hong Kong"].map((city, i) => (
            <motion.span
              key={city}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1 + i * 0.08, duration: 0.5 }}
              className="text-white/20 text-sm font-medium tracking-wide flex items-center gap-2"
            >
              <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }} className="w-1 h-1 rounded-full bg-blue/50" />
              {city}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Radial gradient spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-1.5">
          <motion.div animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-1.5 h-1.5 rounded-full bg-blue/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
