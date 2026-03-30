"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "What sectors do you specialise in?",
    a: "We focus exclusively on three high-impact sectors: Technology (VC-backed and scale-ups), Legal (Magic Circle, US elite, and in-house), and Banking & Finance (investment banking, private equity, risk and compliance). This deep specialisation allows us to deliver candidates other generalist firms simply can't reach.",
  },
  {
    q: "How quickly can you fill a role?",
    a: "Our average time-to-shortlist is 14 days. For executive searches, we typically present a qualified shortlist within 2-3 weeks. Urgent hires can be fast-tracked, with candidates presented within 5-7 business days depending on the role complexity.",
  },
  {
    q: "What is your fee structure?",
    a: "We operate on a retained and contingency basis depending on the seniority and complexity of the search. Executive and leadership roles are typically retained, while mid-level positions can be handled on a contingency basis. We're happy to discuss the best model for your specific needs.",
  },
  {
    q: "Do you operate globally?",
    a: "Yes. While our offices are in London and Singapore, we place candidates across 45+ countries. Our strongest coverage is across the UK, US, EU, Middle East, and Asia Pacific, with particular depth in major financial centres.",
  },
  {
    q: "What makes W3 Sourcing different from other recruiters?",
    a: "Three things: deep sector expertise (our consultants are former industry practitioners), a genuinely global network built over 12+ years, and an honest, consultative approach. We'll tell you when a search is unrealistic and help you recalibrate — that candour is why 98% of our clients come back.",
  },
  {
    q: "Do you offer any guarantees?",
    a: "Yes. All placements come with a 12-month free replacement guarantee. If a candidate leaves or doesn't work out within the first year, we'll conduct a replacement search at no additional cost. Our 98% retention rate means we rarely need to use it.",
  },
];

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
    <div className="border-b border-gray-border last:border-b-0">
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
          className="w-8 h-8 rounded-full bg-gray-light flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-colors ${isOpen ? "text-accent" : "text-gray"}`}
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
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

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const leftColumn = faqs.slice(0, 3);
  const rightColumn = faqs.slice(3);

  return (
    <section id="faq" className="section-padding bg-gray-light overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-block text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full bg-cyan/10 text-cyan mb-6">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Frequently asked <span className="text-accent">questions</span>
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">
            Everything you need to know about working with W3 Sourcing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-0 md:gap-12 max-w-5xl mx-auto">
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
        </div>
      </div>
    </section>
  );
}
