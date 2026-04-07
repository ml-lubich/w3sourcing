"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { scrollToPageTop } from "@/lib/scroll-to-section";

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
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-40 hidden sm:inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/85 px-6 py-3 text-sm font-semibold text-foreground shadow-[0_8px_28px_rgb(15_23_42_/_0.12)] backdrop-blur-md transition-all duration-200 hover:bg-background hover:-translate-y-0.5 dark:border-white/35 dark:bg-slate-950/70 dark:text-white dark:shadow-[0_8px_28px_rgb(0_0_0_/_0.4)] dark:hover:bg-slate-950/85"
          aria-label="Back to top"
          onClick={() => scrollToPageTop()}
        >
          Back to top
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
