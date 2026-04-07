"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqItems } from "@/content/faq-items";
import { SplitWordsRich } from "@/components/split-words";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { SURFACE_REVEAL_DURATION_LITE, SURFACE_REVEAL_EASE, surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-border/40 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-primary font-semibold text-base pr-8 group-hover:text-accent transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="glass-chip w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:border-accent/35 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-colors ${isOpen ? "text-accent" : "text-muted"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: SURFACE_REVEAL_DURATION_LITE, ease: SURFACE_REVEAL_EASE }}
            className="overflow-hidden"
          >
            <p className="text-text-secondary text-sm leading-relaxed pb-6 pr-12">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;
  const headingSplit = useSplitWordsAnimate(visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const leftColumn = faqItems.slice(0, 3);
  const rightColumn = faqItems.slice(3);

  return (
    <section id="faq" className="section-padding section-band-glass-muted overflow-hidden" aria-labelledby="faq-heading">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="glass-chip inline-block text-xs font-semibold tracking-[0.12em] uppercase px-3 py-1.5 rounded-lg text-text-secondary mb-6">
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-[1.15]"
          >
            <SplitWordsRich
              className="justify-center"
              segments={[
                { text: "Answers to" },
                { text: "common questions", className: "text-accent" },
              ]}
              stagger={0.04}
              delayStart={0.06}
              animate={headingSplit}
            />
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">
            Everything you need to know about working with W3 Sourcing.
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-0 md:gap-12 max-w-5xl mx-auto"
          initial={reduced ? false : { opacity: 0, y: liteMotion ? 10 : 16 }}
          animate={
            visible || reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: liteMotion ? 10 : 16 }
          }
          transition={surfaceRevealEnterTransition(liteMotion, reduced, {
            delay: reduced ? 0 : 0.1,
          })}
        >
          <div>
            {leftColumn.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
          <div>
            {rightColumn.map((faq, i) => {
              const idx = i + 3;
              return (
                <FAQItem
                  key={idx}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openIndex === idx}
                  onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
