"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 bg-accent text-white font-semibold text-sm py-3 px-6 rounded-full shadow-[0_8px_24px_rgba(77,101,255,0.3)] transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
        >
          Book a Call
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
