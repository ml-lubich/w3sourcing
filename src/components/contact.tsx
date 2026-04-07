"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplitWords, SplitWordsRich } from "@/components/split-words";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";
import {
  W3_LONDON_ADDRESS,
  W3_SINGAPORE_ADDRESS,
  W3_SINGAPORE_REGISTRATION,
} from "@/content/offices";
import { surfaceCardWhileHover, surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;
  const headingSplit = useSplitWordsAnimate(visible);
  const successSplit = useSplitWordsAnimate(submitted);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="section-padding section-band-glass overflow-hidden" aria-labelledby="contact-heading">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-[1.15]"
          >
            <SplitWordsRich
              className="justify-center"
              segments={[
                { text: "Get in" },
                { text: "Touch", className: "text-accent" },
              ]}
              stagger={0.045}
              delayStart={0.06}
              animate={headingSplit}
            />
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">
            Whether you&apos;re scaling a team, exploring new opportunities, or planning strategic leadership hires,
            W3 Sourcing is your partner for outcomes that need taste and accountability—not software acting alone.
          </p>
        </div>

        <motion.div
          className="grid lg:grid-cols-5 gap-12 lg:gap-16 max-w-6xl mx-auto"
          initial={reduced ? false : { opacity: 0, y: liteMotion ? 10 : 18 }}
          animate={
            visible || reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: liteMotion ? 10 : 18 }
          }
          transition={surfaceRevealEnterTransition(liteMotion, reduced, {
            delay: reduced ? 0 : 0.08,
          })}
        >
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={surfaceCardWhileHover(liteMotion)}
                  className="glass-panel rounded-2xl p-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    <SplitWords
                      as="span"
                      text="Message Sent"
                      className="justify-center"
                      stagger={0.045}
                      animate={successSplit}
                    />
                  </h3>
                  <p className="text-text-secondary">
                    Thank you for reaching out. We&apos;ll be in touch within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { label: "First Name", placeholder: "John", type: "text" },
                      { label: "Last Name", placeholder: "Smith", type: "text" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-sm font-medium text-primary mb-1.5">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          required
                          className="glass-control w-full rounded-xl px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/25 focus:shadow-[0_4px_18px_rgb(79_70_229_/_0.14)] transition-all"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="glass-control w-full rounded-xl px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/25 focus:shadow-[0_4px_18px_rgb(79_70_229_/_0.14)] transition-all"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      I&apos;m looking for...
                    </label>
                    <select className="glass-control w-full rounded-xl px-4 py-3 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/25 focus:shadow-[0_4px_18px_rgb(79_70_229_/_0.14)] transition-all">
                      <option>Hiring talent for my team</option>
                      <option>Exploring career opportunities</option>
                      <option>Partnership or collaboration</option>
                      <option>General enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      className="glass-control w-full rounded-xl px-4 py-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/25 focus:shadow-[0_4px_18px_rgb(79_70_229_/_0.14)] transition-all resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-accent text-white font-semibold text-sm py-3 px-8 rounded-xl shadow-[0_4px_16px_rgb(79_70_229_/_0.25)] transition-all duration-200 hover:bg-accent-hover inline-flex items-center gap-2"
                  >
                    Send Message
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel rounded-xl p-6 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary mb-1 inline-block max-w-full">
                <SplitWords as="span" text="Email Us" stagger={0.05} animate={headingSplit} />
              </h4>
              <a
                href="mailto:info@w3sourcing.com"
                className="text-accent text-sm hover:underline"
              >
                info@w3sourcing.com
              </a>
            </div>

            <div className="glass-panel rounded-xl p-6 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary mb-3 inline-block max-w-full">
                <SplitWords
                  as="span"
                  text="W3 Sourcing — London"
                  stagger={0.035}
                  delayStart={0.02}
                  animate={headingSplit}
                />
              </h4>
              <address className="text-text-secondary text-sm not-italic leading-relaxed">
                {W3_LONDON_ADDRESS.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <h4 className="font-semibold text-primary mb-3 mt-6 inline-block max-w-full">
                <SplitWords
                  as="span"
                  text="W3 Sourcing — Singapore"
                  stagger={0.035}
                  delayStart={0.02}
                  animate={headingSplit}
                />
              </h4>
              <address className="text-text-secondary text-sm not-italic leading-relaxed">
                {W3_SINGAPORE_ADDRESS.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block mt-3 text-xs text-muted">
                  UEN: {W3_SINGAPORE_REGISTRATION.uen}
                  <br />
                  EA: {W3_SINGAPORE_REGISTRATION.ea}
                </span>
              </address>
            </div>

            <div className="glass-panel rounded-xl p-6 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary mb-1 inline-block max-w-full">
                <SplitWords as="span" text="Response Time" stagger={0.045} animate={headingSplit} />
              </h4>
              <p className="text-text-secondary text-sm">
                We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
