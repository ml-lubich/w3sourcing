"use client";

import { motion } from "framer-motion";

const offices = [
  { city: "London", country: "United Kingdom", address: "128 City Road, London, EC1V 2NX", timezone: "GMT / BST", flag: "\ud83c\uddec\ud83c\udde7" },
  { city: "Singapore", country: "Republic of Singapore", address: "Far East Finance Building, 14 Robinson Road #08-01", timezone: "SGT (UTC+8)", flag: "\ud83c\uddf8\ud83c\uddec" },
];

export function GlobalOffices() {
  return (
    <section className="relative py-28 sm:py-36 bg-navy-light overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue/[0.03] blur-[120px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-20">
          <span className="text-blue font-semibold text-sm tracking-[0.2em] uppercase mb-4 block">Global Presence</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">Our <span className="gradient-text-blue">Offices</span></h2>
          <p className="mt-5 text-lg text-white/35 max-w-2xl mx-auto leading-relaxed">Strategically positioned in two of the world&apos;s leading financial centres.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="relative mb-16">
          <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="flex items-center justify-center gap-4 sm:gap-0">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }} className="flex-1 text-center sm:text-right sm:pr-12">
                <div className="inline-flex items-center gap-3 mb-3">
                  <span className="text-3xl">{offices[0].flag}</span>
                  <div className="text-left">
                    <div className="text-white font-bold text-xl">{offices[0].city}</div>
                    <div className="text-white/30 text-xs">{offices[0].country}</div>
                  </div>
                </div>
              </motion.div>
              <div className="relative flex-shrink-0 w-20 sm:w-40">
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="h-px bg-gradient-to-r from-blue/50 via-blue to-blue/50 origin-left" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue shadow-lg shadow-blue/50" />
                {/* Traveling dot animation */}
                <motion.div
                  animate={{ left: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-light/60"
                />
              </div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }} className="flex-1 text-center sm:text-left sm:pl-12">
                <div className="inline-flex items-center gap-3 mb-3">
                  <span className="text-3xl">{offices[1].flag}</span>
                  <div className="text-left">
                    <div className="text-white font-bold text-xl">{offices[1].city}</div>
                    <div className="text-white/30 text-xs">{offices[1].country}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {offices.map((office, i) => (
            <motion.div key={office.city} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -4, transition: { duration: 0.3 } }} className="glass-card rounded-2xl p-8 group hover:border-blue/15 transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">{office.flag}</span>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-light transition-colors duration-300">{office.city}</h3>
                  <p className="text-white/30 text-sm">{office.country}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-blue/50 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  <span className="text-white/40 text-sm leading-relaxed">{office.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-blue/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-white/40 text-sm">{office.timezone}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
