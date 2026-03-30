"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureSection {
  id: string;
  badge: string;
  badgeColor: string;
  headline: string;
  headlineAccent: string;
  description: string;
  tabs: {
    label: string;
    title: string;
    body: string;
    bullets: string[];
  }[];
}

const featureSections: FeatureSection[] = [
  {
    id: "source",
    badge: "Source & Outreach",
    badgeColor: "bg-accent/[0.08] text-accent",
    headline: "Source top talent",
    headlineAccent: "before anyone else",
    description:
      "Our proprietary network and deep sector expertise let us identify and engage exceptional candidates who aren't actively looking.",
    tabs: [
      {
        label: "Executive Search",
        title: "Precision headhunting for leadership roles",
        body: "We map entire markets to find the exact candidate profile your organisation needs, from C-suite to VP-level hires.",
        bullets: [
          "Comprehensive market mapping across Tech, Legal & Finance",
          "Access to passive candidates through trusted relationships",
          "Average time-to-shortlist of just 14 days",
        ],
      },
      {
        label: "Talent Pipeline",
        title: "Build a continuous pipeline of pre-vetted talent",
        body: "Stay ahead of hiring needs with a curated bench of candidates ready to interview at short notice.",
        bullets: [
          "Ongoing relationship management with top-tier candidates",
          "Real-time market intelligence and salary benchmarking",
          "Quarterly talent reports tailored to your sector",
        ],
      },
    ],
  },
  {
    id: "screen",
    badge: "Screen & Assess",
    badgeColor: "bg-green/[0.08] text-green",
    headline: "Assess candidates",
    headlineAccent: "with confidence",
    description:
      "Multi-stage screening ensures only the most qualified, culturally aligned candidates reach your interview room.",
    tabs: [
      {
        label: "Technical Assessment",
        title: "Rigorous competency-based evaluation",
        body: "Our sector-specialist consultants evaluate candidates across technical skills, leadership qualities, and cultural fit.",
        bullets: [
          "Structured interviews aligned to your role specifications",
          "Technical assessments designed with industry experts",
          "Psychometric profiling for senior hires",
        ],
      },
      {
        label: "Culture Mapping",
        title: "Match candidates to your unique culture",
        body: "We go beyond skills to understand motivations, values, and working style to ensure long-term success.",
        bullets: [
          "Deep-dive into your team dynamics and culture",
          "Values-based interview frameworks",
          "98% retention rate at 12-month mark",
        ],
      },
    ],
  },
  {
    id: "place",
    badge: "Place & Integrate",
    badgeColor: "bg-purple/[0.08] text-purple",
    headline: "Seamless placements",
    headlineAccent: "that stick",
    description:
      "From offer negotiation to onboarding support, we ensure every placement is set up for long-term success.",
    tabs: [
      {
        label: "Offer Management",
        title: "Navigate complex offer negotiations",
        body: "We manage the entire offer process, handling counteroffers, competing packages, and notice period challenges.",
        bullets: [
          "Salary benchmarking against live market data",
          "Stakeholder alignment on compensation packages",
          "95% offer acceptance rate across all sectors",
        ],
      },
      {
        label: "Onboarding Support",
        title: "Support that continues after day one",
        body: "Our relationship doesn't end at placement. We provide structured check-ins to ensure smooth integration.",
        bullets: [
          "30/60/90 day structured check-in programme",
          "Dedicated account manager for ongoing support",
          "Free replacement guarantee for 12 months",
        ],
      },
    ],
  },
  {
    id: "tech",
    badge: "Technology",
    badgeColor: "bg-cyan/[0.08] text-cyan",
    headline: "VC-backed tech",
    headlineAccent: "hiring specialists",
    description:
      "We partner with the world's most ambitious technology companies to build transformative engineering, product, and leadership teams.",
    tabs: [
      {
        label: "Engineering",
        title: "Build world-class engineering teams",
        body: "From individual contributors to engineering directors, we understand what great technical talent looks like.",
        bullets: [
          "Full-stack, backend, frontend, DevOps, ML/AI specialists",
          "Deep network in Series A through IPO-stage companies",
          "Average 3 weeks from brief to accepted offer",
        ],
      },
      {
        label: "Product & Leadership",
        title: "Product leaders who ship",
        body: "We place product managers, designers, and technical leaders who drive real business outcomes.",
        bullets: [
          "CPO, VP Product, Head of Design placements",
          "GTM and growth leadership for scaling companies",
          "C-Suite advisory for technical founder teams",
        ],
      },
    ],
  },
  {
    id: "legal",
    badge: "Legal",
    badgeColor: "bg-yellow/[0.08] text-yellow",
    headline: "Elite legal",
    headlineAccent: "talent placement",
    description:
      "Placing exceptional lawyers at Magic Circle firms, US elite, and top-tier in-house legal teams globally.",
    tabs: [
      {
        label: "Private Practice",
        title: "Lateral moves at the highest level",
        body: "From NQ associates to partner-level laterals, we handle the most sensitive and complex legal searches.",
        bullets: [
          "Deep relationships across Magic Circle and US elite firms",
          "Specialist focus on M&A, PE, Finance, and Disputes",
          "Discretion and confidentiality as standard",
        ],
      },
      {
        label: "In-House",
        title: "Build your in-house legal function",
        body: "From General Counsel to legal operations, we help organisations build and scale their in-house teams.",
        bullets: [
          "GC, Deputy GC, and Head of Legal placements",
          "Legal operations and compliance specialists",
          "Cross-border legal team builds",
        ],
      },
    ],
  },
  {
    id: "finance",
    badge: "Finance",
    badgeColor: "bg-green/[0.08] text-green",
    headline: "Banking & finance",
    headlineAccent: "recruitment experts",
    description:
      "Connecting elite finance professionals with leading global banks, hedge funds, private equity, and corporate advisory firms.",
    tabs: [
      {
        label: "Investment Banking",
        title: "Top-tier investment banking talent",
        body: "We place analysts through to MDs across bulge bracket, boutique, and middle-market investment banks.",
        bullets: [
          "M&A, ECM, DCM, and Restructuring specialists",
          "Private Equity and Venture Capital placements",
          "Cross-border deal team assembly",
        ],
      },
      {
        label: "Risk & Compliance",
        title: "Regulatory expertise you can trust",
        body: "As regulation intensifies, we help financial institutions hire the risk and compliance leaders they need.",
        bullets: [
          "CRO, Head of Compliance, and MLRO placements",
          "Quantitative risk and model validation specialists",
          "Regulatory change and financial crime experts",
        ],
      },
    ],
  },
];

const mockupLayouts = [
  // Layout 0: Card grid (Source)
  (badgeColor: string) => (
    <div className="w-full h-full bg-white/70 rounded-xl border border-accent/[0.06] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3 mb-1">
        <div className={`w-8 h-8 rounded-lg ${badgeColor}`} />
        <div className="h-3 bg-gray-border rounded w-1/3" />
        <div className="ml-auto h-3 bg-accent/10 rounded-full w-16" />
      </div>
      <div className="flex-1 grid grid-cols-2 gap-3">
        {["accent", "green", "purple", "cyan"].map((c, i) => (
          <div key={i} className="bg-gray-light rounded-lg p-3 space-y-2">
            <div className="h-2.5 bg-gray-border rounded w-3/4" />
            <div className="h-2 bg-gray-border/60 rounded w-full" />
            <div className="h-2 bg-gray-border/60 rounded w-2/3" />
            <div className={`h-5 bg-${c}/10 rounded-md w-16 mt-1`} />
          </div>
        ))}
      </div>
    </div>
  ),
  // Layout 1: Pipeline/Kanban (Screen)
  (badgeColor: string) => (
    <div className="w-full h-full bg-white/70 rounded-xl border border-accent/[0.06] p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg ${badgeColor}`} />
        <div className="h-3 bg-gray-border rounded w-1/4" />
      </div>
      <div className="flex-1 grid grid-cols-3 gap-3">
        {["Screening", "Interview", "Offer"].map((stage, i) => (
          <div key={stage} className="flex flex-col gap-2">
            <div className="text-[10px] font-semibold text-gray uppercase tracking-wider">{stage}</div>
            {Array.from({ length: 3 - i }).map((_, j) => (
              <div key={j} className="bg-gray-light rounded-lg p-2.5 space-y-1.5">
                <div className="h-2 bg-gray-border rounded w-4/5" />
                <div className="h-1.5 bg-gray-border/50 rounded w-full" />
                <div className={`h-4 rounded-md w-12 mt-1 ${i === 0 ? 'bg-yellow/15' : i === 1 ? 'bg-accent/10' : 'bg-green/15'}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
  // Layout 2: Profile card (Place)
  (badgeColor: string) => (
    <div className="w-full h-full bg-white/70 rounded-xl border border-accent/[0.06] p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${badgeColor}`} />
        <div className="h-3 bg-gray-border rounded w-1/3" />
        <div className="ml-auto flex gap-2">
          <div className="h-7 w-7 bg-green/10 rounded-lg" />
          <div className="h-7 w-7 bg-gray-light rounded-lg" />
        </div>
      </div>
      <div className="flex gap-4 flex-1">
        <div className="w-1/3 space-y-3">
          <div className="w-16 h-16 bg-gray-light rounded-full mx-auto" />
          <div className="h-2.5 bg-gray-border rounded w-2/3 mx-auto" />
          <div className="h-2 bg-gray-border/50 rounded w-1/2 mx-auto" />
          <div className="h-6 bg-green/10 rounded-full w-20 mx-auto" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="bg-gray-light rounded-lg p-3 space-y-1.5">
            <div className="h-2 bg-gray-border rounded w-1/4" />
            <div className="h-1.5 bg-gray-border/50 rounded w-full" />
            <div className="h-1.5 bg-gray-border/50 rounded w-3/4" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-light rounded-lg p-2 space-y-1">
              <div className="h-1.5 bg-gray-border/50 rounded w-1/2" />
              <div className="h-3 bg-accent/10 rounded w-3/4" />
            </div>
            <div className="bg-gray-light rounded-lg p-2 space-y-1">
              <div className="h-1.5 bg-gray-border/50 rounded w-2/3" />
              <div className="h-3 bg-purple/10 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  // Layout 3: Dashboard metrics (Tech)
  (badgeColor: string) => (
    <div className="w-full h-full bg-white/70 rounded-xl border border-accent/[0.06] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${badgeColor}`} />
        <div className="h-3 bg-gray-border rounded w-1/4" />
        <div className="ml-auto flex gap-1.5">
          <div className="h-6 w-14 bg-accent/10 rounded-md" />
          <div className="h-6 w-14 bg-gray-light rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { color: "accent", w: "w-2/3" },
          { color: "green", w: "w-3/4" },
          { color: "cyan", w: "w-1/2" },
        ].map((m, i) => (
          <div key={i} className="bg-gray-light rounded-lg p-3 text-center space-y-1">
            <div className={`h-5 bg-${m.color}/15 rounded ${m.w} mx-auto`} />
            <div className="h-1.5 bg-gray-border/50 rounded w-2/3 mx-auto" />
          </div>
        ))}
      </div>
      <div className="flex-1 bg-gray-light rounded-lg p-3">
        <div className="flex items-end gap-1.5 h-full">
          {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-accent/20 to-purple/10 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  ),
  // Layout 4: List view (Legal)
  (badgeColor: string) => (
    <div className="w-full h-full bg-white/70 rounded-xl border border-accent/[0.06] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3 mb-1">
        <div className={`w-8 h-8 rounded-lg ${badgeColor}`} />
        <div className="h-3 bg-gray-border rounded w-1/4" />
        <div className="ml-auto h-7 w-20 bg-gray-light rounded-lg" />
      </div>
      <div className="flex-1 space-y-2">
        {[
          { status: "bg-green/15", w1: "w-1/3", w2: "w-2/3" },
          { status: "bg-yellow/15", w1: "w-1/4", w2: "w-3/4" },
          { status: "bg-accent/10", w1: "w-2/5", w2: "w-1/2" },
          { status: "bg-green/15", w1: "w-1/3", w2: "w-3/5" },
          { status: "bg-purple/10", w1: "w-1/4", w2: "w-2/3" },
        ].map((row, i) => (
          <div key={i} className="bg-gray-light rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-border/40 rounded-full shrink-0" />
            <div className="flex-1 space-y-1">
              <div className={`h-2 bg-gray-border rounded ${row.w1}`} />
              <div className={`h-1.5 bg-gray-border/50 rounded ${row.w2}`} />
            </div>
            <div className={`h-5 w-14 ${row.status} rounded-full shrink-0`} />
          </div>
        ))}
      </div>
    </div>
  ),
  // Layout 5: Analytics (Finance)
  (badgeColor: string) => (
    <div className="w-full h-full bg-white/70 rounded-xl border border-accent/[0.06] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${badgeColor}`} />
        <div className="h-3 bg-gray-border rounded w-1/3" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-light rounded-lg p-3 space-y-1">
          <div className="h-1.5 bg-gray-border/50 rounded w-1/2" />
          <div className="h-5 bg-green/15 rounded w-3/4" />
        </div>
        <div className="bg-gray-light rounded-lg p-3 space-y-1">
          <div className="h-1.5 bg-gray-border/50 rounded w-2/3" />
          <div className="h-5 bg-accent/10 rounded w-2/3" />
        </div>
      </div>
      <div className="flex-1 bg-gray-light rounded-lg p-3 flex flex-col justify-end">
        <div className="flex items-end gap-2 h-full">
          {[30, 50, 40, 70, 55, 80, 65, 90, 75, 85].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col gap-0.5" style={{ height: `${h}%` }}>
              <div className="flex-1 bg-gradient-to-t from-green/20 to-green/5 rounded-t" />
              <div className="h-1/3 bg-gradient-to-t from-accent/15 to-accent/5 rounded-b" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
];

function MockupVariant({ index, badgeColor }: { index: number; badgeColor: string }) {
  const layoutFn = mockupLayouts[index % mockupLayouts.length];
  return (
    <div className="mockup-gradient rounded-2xl aspect-[4/3] mockup-shadow-lg overflow-hidden p-4 sm:p-5 lg:p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_90px_rgba(79,70,229,0.12)] ring-1 ring-accent/[0.06]">
      {layoutFn(badgeColor)}
    </div>
  );
}

function FeatureBlock({ section, index }: { section: FeatureSection; index: number }) {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isReversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`section-padding ${index % 2 === 0 ? "bg-white" : "bg-gradient-section"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
            isReversed ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Text side */}
          <div
            className={`flex-1 ${
              inView ? "animate-slideUp" : "opacity-0"
            }`}
          >
            {/* Badge */}
            <span
              className={`inline-block text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-6 ${section.badgeColor}`}
            >
              {section.badge}
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary leading-tight mb-4">
              {section.headline}{" "}
              <span className="gradient-text">{section.headlineAccent}</span>
            </h2>

            <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
              {section.description}
            </p>

            {/* Tabs */}
            <div className="flex gap-0 sm:gap-1 mb-5 sm:mb-6 border-b border-gray-border overflow-x-auto">
              {section.tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-200 border-b-[3px] -mb-px whitespace-nowrap ${
                    activeTab === i
                      ? "text-accent border-accent"
                      : "text-gray border-transparent hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-bold text-primary mb-2">
                  {section.tabs[activeTab].title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {section.tabs[activeTab].body}
                </p>
                <ul className="space-y-2.5">
                  {section.tabs[activeTab].bullets.map((bullet, bi) => (
                    <li key={bi} className="flex items-start gap-3 text-sm text-text-secondary">
                      <svg
                        className="w-5 h-5 text-green shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mockup side */}
          <div
            className={`flex-1 w-full ${
              inView ? "animate-slideUp" : "opacity-0"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            <MockupVariant index={index} badgeColor={section.badgeColor} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureTabs() {
  return (
    <div id="features">
      {featureSections.map((section, i) => (
        <FeatureBlock key={section.id} section={section} index={i} />
      ))}
    </div>
  );
}
