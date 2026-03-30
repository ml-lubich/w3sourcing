"use client";

import { motion } from "framer-motion";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#why-us" },
  { label: "Industries", href: "#industries" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="relative bg-navy border-t border-white/[0.04] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue to-blue-dark flex items-center justify-center shadow-lg shadow-blue/15">
                <span className="text-white font-bold text-xs">W3</span>
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">W3<span className="text-blue-light">Sourcing</span></span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed max-w-xs">Global recruitment excellence for Tech, Legal & Finance. Offices in London and Singapore.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.8 }}>
            <h4 className="text-white/40 text-xs font-semibold tracking-[0.2em] uppercase mb-5">Navigation</h4>
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-white/30 hover:text-blue-light transition-colors duration-300 text-sm">{link.label}</a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }}>
            <h4 className="text-white/40 text-xs font-semibold tracking-[0.2em] uppercase mb-5">Get in Touch</h4>
            <div className="space-y-3">
              <a href="mailto:info@w3sourcing.com" className="block text-white/30 hover:text-blue-light transition-colors text-sm">info@w3sourcing.com</a>
              <p className="text-white/20 text-sm">London &middot; Singapore</p>
            </div>
            <div className="mt-5">
              <a href="#" className="inline-flex items-center gap-2 text-white/20 hover:text-blue-light transition-colors text-sm" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/15">&copy; {new Date().getFullYear()} W3 Sourcing. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/15 hover:text-white/30 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/15 hover:text-white/30 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
