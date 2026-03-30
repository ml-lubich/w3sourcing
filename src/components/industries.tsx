"use client";

import { motion } from "framer-motion";

const industries = [
  {
    category: "Technology",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    accent: "blue",
    roles: [
      "Product Management",
      "Software Engineering",
      "Data & Analytics",
      "AI / Machine Learning",
      "DevOps & Infrastructure",
      "Cyber Security",
      "Go-to-Market & Sales",
      "CTO & VP Engineering",
    ],
  },
  {
    category: "Legal",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97z" />
      </svg>
    ),
    accent: "gold",
    roles: [
      "Associates",
      "Senior Associates",
      "Counsel",
      "Partners",
      "Practice Group Leaders",
      "General Counsel",
      "Legal Operations",
      "Compliance Officers",
    ],
  },
  {
    category: "Finance",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    accent: "emerald",
    roles: [
      "Private Banking",
      "Investment Banking",
      "Risk & Compliance",
      "Corporate Advisory",
      "M&A",
      "Venture Capital",
      "Private Equity",
      "Quantitative Analysis",
    ],
  },
];

const accentMap: Record<string, { badge: string; dot: string; hover: string; iconBg: string }> = {
  blue: {
    badge: "text-blue-light bg-blue/10 border-blue/15",
    dot: "bg-blue/50",
    hover: "group-hover:border-blue/20",
    iconBg: "text-blue bg-blue/10",
  },
  gold: {
    badge: "text-gold-light bg-gold/10 border-gold/15",
    dot: "bg-gold/50",
    hover: "group-hover:border-gold/20",
    iconBg: "text-gold bg-gold/10",
  },
  emerald: {
    badge: "text-emerald-300 bg-emerald-500/10 border-emerald-500/15",
    dot: "bg-emerald-400/50",
    hover: "group-hover:border-emerald-500/20",
    iconBg: "text-emerald-400 bg-emerald-500/10",
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function Industries() {
  return (
    <section id="industries" className="relative py-28 sm:py-36 bg-navy-light overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-blue font-semibold text-sm tracking-[0.2em] uppercase mb-4 block">
            Sectors & Functions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
            Industries & <span className="gradient-text-blue">Functions</span>
          </h2>
          <p className="mt-5 text-lg text-white/35 max-w-2xl mx-auto leading-relaxed">
            Specialist knowledge across the functions that matter most to your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {industries.map((industry, i) => {
            const colors = accentMap[industry.accent];
            return (
              <motion.div
                key={industry.category}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`group glass-card rounded-2xl p-8 transition-all duration-500 ${colors.hover}`}
              >
                <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-8 ${colors.badge}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
                    {industry.icon}
                  </div>
                  <span className="text-sm font-semibold">{industry.category}</span>
                </div>

                <div className="space-y-3">
                  {industry.roles.map((role, ri) => (
                    <motion.div
                      key={role}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + ri * 0.05, duration: 0.5 }}
                      className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors duration-300 group/item cursor-default"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-300 group-hover/item:scale-150 ${colors.dot}`} />
                      {role}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
