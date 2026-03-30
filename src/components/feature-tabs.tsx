"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FeatureSection {
  id: string;
  badge: string;
  badgeColor: string;
  headline: string;
  headlineAccent: string;
  accentColor: string;
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
    badgeColor: "bg-accent/10 text-accent",
    headline: "Source top talent ",
    headlineAccent: "before anyone else",
    accentColor: "text-accent",
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
    badgeColor: "bg-green/10 text-green",
    headline: "Assess candidates ",
    headlineAccent: "with confidence",
    accentColor: "text-green",
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
    badgeColor: "bg-pink/10 text-pink",
    headline: "Seamless placements ",
    headlineAccent: "that stick",
    accentColor: "text-pink",
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
    badgeColor: "bg-cyan/10 text-cyan",
    headline: "VC-backed tech ",
    headlineAccent: "hiring specialists",
    accentColor: "text-cyan",
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
    badgeColor: "bg-yellow/10 text-yellow",
    headline: "Elite legal ",
    headlineAccent: "talent placement",
    accentColor: "text-yellow",
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
    badgeColor: "bg-green/10 text-green",
    headline: "Banking & finance ",
    headlineAccent: "recruitment experts",
    accentColor: "text-accent",
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

function FeatureBlock({ section, index }: { section: FeatureSection; index: number }) {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isReversed = index % 2 === 1;
  const bgClass = index % 2 === 0 ? "bg-white" : "bg-gray-light";

  return (
    <div ref={ref} className={`section-padding ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
            isReversed ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Text side */}
          <div
            className={`flex-1 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span
              className={`inline-block text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-6 ${section.badgeColor}`}
            >
              {section.badge}
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-bold text-primary leading-tight mb-4">
              {section.headline}
              <span className={section.accentColor}>{section.headlineAccent}</span>
            </h2>

            <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
              {section.description}
            </p>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-gray-border">
              {section.tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px ${
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
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

          {/* Card side */}
          <div
            className={`flex-1 w-full transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="bg-white rounded-2xl border border-gray-border p-6 shadow-[0_8px_30px_rgba(0,0,64,0.06)]">
              <div className="space-y-4">
                {section.tabs.map((tab, i) => (
                  <div
                    key={tab.label}
                    className={`rounded-xl p-4 border transition-all duration-200 cursor-pointer ${
                      activeTab === i
                        ? "border-accent/30 bg-accent/[0.03]"
                        : "border-gray-border bg-gray-light hover:border-gray"
                    }`}
                    onClick={() => setActiveTab(i)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.badgeColor}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          {i === 0 ? (
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          ) : (
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </div>
                      <span className="font-semibold text-primary text-sm">{tab.label}</span>
                    </div>
                    <p className="text-text-secondary text-xs leading-relaxed pl-11">
                      {tab.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
