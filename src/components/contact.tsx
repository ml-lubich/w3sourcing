"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative py-28 sm:py-36 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue/[0.03] blur-[120px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-16">
          <span className="text-blue font-semibold text-sm tracking-[0.2em] uppercase mb-4 block">Contact Us</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
            Let&apos;s Start a <span className="gradient-text-blue">Conversation</span>
          </h2>
          <p className="mt-5 text-lg text-white/35 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re looking to build a team or take your next career step, we&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-10 text-center border-blue/15">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} className="w-16 h-16 rounded-full bg-blue/15 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
                  <p className="text-white/40">Thank you for reaching out. We&apos;ll be in touch shortly.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[{ label: "First Name", ph: "John" }, { label: "Last Name", ph: "Smith" }].map((f, i) => (
                      <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                        <label className="block text-sm font-medium text-white/60 mb-1.5">{f.label}</label>
                        <input type="text" required className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue/30 focus:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm" placeholder={f.ph} />
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
                    <input type="email" required className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue/30 focus:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm" placeholder="john@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">I&apos;m looking for...</label>
                    <select className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue/30 focus:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm">
                      <option className="bg-navy">Hiring talent for my team</option>
                      <option className="bg-navy">Exploring career opportunities</option>
                      <option className="bg-navy">Partnership or collaboration</option>
                      <option className="bg-navy">General enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Message</label>
                    <textarea rows={4} required className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue/30 transition-all resize-none backdrop-blur-sm" placeholder="Tell us about your requirements..." />
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary text-white font-semibold px-8 py-3.5 rounded-full text-sm w-full sm:w-auto">
                    Send Message
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-xl p-6 hover:border-blue/15 transition-all duration-500">
              <h4 className="font-semibold text-white mb-3">Email Us</h4>
              <a href="mailto:info@w3sourcing.com" className="text-blue-light text-sm hover:text-blue transition-colors">info@w3sourcing.com</a>
            </div>
            <div className="glass-card rounded-xl p-6 hover:border-blue/15 transition-all duration-500">
              <h4 className="font-semibold text-white mb-3">Follow Us</h4>
              <a href="#" className="inline-flex items-center gap-2 text-white/40 hover:text-blue-light transition-colors text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                LinkedIn
              </a>
            </div>
            <div className="glass-card rounded-xl p-6 hover:border-blue/15 transition-all duration-500">
              <h4 className="font-semibold text-white mb-3">Response Time</h4>
              <p className="text-white/40 text-sm">We typically respond within 24 hours during business days.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
