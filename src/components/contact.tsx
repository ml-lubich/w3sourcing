"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
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

  return (
    <section id="contact" className="section-padding bg-white overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-block text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full bg-green/10 text-green mb-6">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Ready to find your <span className="text-accent">next hire?</span>
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto">
            Whether you&apos;re building a team or exploring your next career move,
            let&apos;s start the conversation.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-light rounded-2xl p-10 text-center border border-gray-border"
                >
                  <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    Message Sent
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
                          className="w-full rounded-xl border border-gray-border bg-white px-4 py-3 text-sm text-primary placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
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
                      className="w-full rounded-xl border border-gray-border bg-white px-4 py-3 text-sm text-primary placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      I&apos;m looking for...
                    </label>
                    <select className="w-full rounded-xl border border-gray-border bg-white px-4 py-3 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all">
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
                      className="w-full rounded-xl border border-gray-border bg-white px-4 py-3 text-sm text-primary placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-accent text-white font-semibold text-sm py-3 px-8 rounded-full transition-all duration-200 hover:opacity-90 inline-flex items-center gap-2"
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
            <div className="bg-gray-light rounded-xl p-6 border border-gray-border transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,64,0.04)]">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary mb-1">Email Us</h4>
              <a
                href="mailto:info@w3sourcing.com"
                className="text-accent text-sm hover:underline"
              >
                info@w3sourcing.com
              </a>
            </div>

            <div className="bg-gray-light rounded-xl p-6 border border-gray-border transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,64,0.04)]">
              <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary mb-1">Our Offices</h4>
              <p className="text-text-secondary text-sm">London &middot; Singapore</p>
            </div>

            <div className="bg-gray-light rounded-xl p-6 border border-gray-border transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,64,0.04)]">
              <div className="w-10 h-10 rounded-lg bg-pink/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary mb-1">Response Time</h4>
              <p className="text-text-secondary text-sm">
                We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
