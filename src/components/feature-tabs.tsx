"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import { SplitWords, SplitWordsRich } from "@/components/split-words";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import {
  SURFACE_REVEAL_DURATION_FULL,
  SURFACE_REVEAL_DURATION_LITE,
  SURFACE_REVEAL_EASE,
  surfaceRevealEnterTransition,
} from "@/lib/surface-reveal-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

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
    badge: "Source & engage",
    badgeColor: "text-accent",
    headline: "Source leaders ",
    headlineAccent: "others miss",
    accentColor: "text-accent",
    description:
      "Our proprietary network and deep sector expertise let us identify and engage exceptional candidates who aren't actively looking—relationships and judgment that no automation pipeline can substitute for.",
    tabs: [
      {
        label: "Executive Search",
        title: "Precision headhunting for leadership roles",
        body: "We map entire markets to find the exact candidate profile your organisation needs, from C-suite to VP-level hires.",
        bullets: [
          "Comprehensive market mapping across Tech, Legal & Finance",
          "Access to passive candidates through trusted relationships—not inbox automation alone",
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
    badge: "Qualify & assess",
    badgeColor: "text-text-secondary",
    headline: "Assess candidates ",
    headlineAccent: "with rigour",
    accentColor: "text-accent",
    description:
      "Multi-stage screening ensures only the most qualified, culturally aligned candidates reach your interview room—with consultants who read between the lines, because software has no taste for fit.",
    tabs: [
      {
        label: "Technical Assessment",
        title: "Rigorous competency-based evaluation",
        body: "Our sector-specialist consultants evaluate candidates across technical skills, leadership qualities, and cultural fit—the nuances algorithms flatten or miss.",
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
    badge: "Place & integrate",
    badgeColor: "text-accent",
    headline: "Offers and onboarding ",
    headlineAccent: "that stick",
    accentColor: "text-accent",
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
];

const EASE_PRO = [0.16, 1, 0.3, 1] as const;

function FeatureBlock({ section, index }: { section: FeatureSection; index: number }) {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12, margin: "0px 0px -10% 0px" });
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;
  const headingSplit = useSplitWordsAnimate(inView);
  const tabPanelAnimate = headingSplit;

  const isReversed = index % 2 === 1;
  const bgClass = index % 2 === 0 ? "section-band-glass" : "section-band-glass-muted";

  const tabSpring = liteMotion
    ? { type: "tween" as const, duration: 0.18, ease: EASE_PRO }
    : { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.85 };

  const panelVariants = {
    initial: liteMotion
      ? { opacity: 0, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 14, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: liteMotion
      ? { opacity: 0, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: -10, filter: "blur(4px)" },
  };

  const listContainer = {
    show: {
      transition: { staggerChildren: 0.055, delayChildren: 0.06 },
    },
    hidden: {},
  } as const;

  const listItem: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: SURFACE_REVEAL_DURATION_FULL, ease: SURFACE_REVEAL_EASE },
    },
  };

  return (
    <div ref={ref} className={`section-padding ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-20 ${
            isReversed ? "lg:flex-row-reverse" : ""
          }`}
        >
          <motion.div
            className="flex-1"
            initial={reduced ? false : { opacity: 0, y: liteMotion ? 10 : 22 }}
            animate={
              inView
                ? { opacity: 1, y: 0 }
                : reduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: liteMotion ? 10 : 22 }
            }
            transition={surfaceRevealEnterTransition(liteMotion, reduced, {
              delay: liteMotion ? 0 : 0.04 * index,
            })}
          >
            <motion.span
              className={`glass-chip mb-5 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${section.badgeColor}`}
              initial={reduced ? false : { opacity: 0, scale: 0.94, y: 8 }}
              animate={
                inView
                  ? { opacity: 1, scale: 1, y: 0 }
                  : reduced
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.94, y: 8 }
              }
              transition={surfaceRevealEnterTransition(liteMotion, reduced, {
                delay: liteMotion ? 0 : 0.08 + index * 0.04,
              })}
            >
              {section.badge}
            </motion.span>

            <h2 className="mb-3 text-xl font-extrabold leading-[1.22] tracking-tight text-primary sm:text-2xl lg:text-3xl xl:text-[2.2rem]">
              <SplitWordsRich
                segments={[
                  { text: section.headline },
                  { text: section.headlineAccent, className: section.accentColor },
                ]}
                stagger={liteMotion ? 0.028 : 0.036}
                delayStart={0.04}
                animate={headingSplit}
              />
            </h2>

            <motion.p
              className="mb-6 max-w-lg text-sm leading-relaxed text-text-secondary sm:mb-7 sm:text-[0.9375rem]"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={
                inView
                  ? { opacity: 1, y: 0 }
                  : reduced
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
              }
              transition={surfaceRevealEnterTransition(liteMotion, reduced, {
                delay: liteMotion ? 0 : 0.14 + index * 0.04,
              })}
            >
              {section.description}
            </motion.p>

            <LayoutGroup id={`feature-tabs-${section.id}`}>
              <div className="glass-chip mb-5 flex flex-wrap gap-1 rounded-xl p-1">
                {section.tabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={`relative z-10 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors duration-200 sm:px-4 sm:text-[13px] ${
                      activeTab === i ? "text-accent" : "text-muted hover:text-primary"
                    }`}
                  >
                    {activeTab === i && (
                      <motion.span
                        layoutId={`feature-tab-pill-${section.id}`}
                        className="glass-panel glass-panel--chrome absolute inset-0 -z-10 rounded-lg"
                        transition={tabSpring}
                      />
                    )}
                    <span className="relative">{tab.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${section.id}-${activeTab}`}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={panelVariants}
                transition={
                  liteMotion
                    ? { duration: SURFACE_REVEAL_DURATION_LITE, ease: EASE_PRO }
                    : { duration: SURFACE_REVEAL_DURATION_FULL, ease: EASE_PRO }
                }
              >
                <h3 className="mb-1.5 text-base font-bold text-primary">
                  <SplitWords
                    as="span"
                    text={section.tabs[activeTab].title}
                    stagger={liteMotion ? 0.026 : 0.032}
                    delayStart={0.02}
                    variant="textLoad"
                    animate={tabPanelAnimate}
                  />
                </h3>
                <motion.p
                  className="mb-3 text-xs leading-relaxed text-text-secondary sm:text-sm"
                  initial={reduced || !tabPanelAnimate ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={surfaceRevealEnterTransition(liteMotion, reduced, {
                    delay: liteMotion ? 0 : 0.08,
                  })}
                >
                  {section.tabs[activeTab].body}
                </motion.p>
                {liteMotion ? (
                  <ul className="space-y-2">
                    {section.tabs[activeTab].bullets.map((bullet, bi) => (
                      <li
                        key={`${activeTab}-${bi}`}
                        className="flex items-start gap-2.5 text-xs text-text-secondary sm:text-[13px]"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-success section-card-icon-glow"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          aria-hidden
                        >
                          <path d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <motion.ul
                    className="space-y-2"
                    initial="hidden"
                    animate="show"
                    variants={listContainer}
                  >
                    {section.tabs[activeTab].bullets.map((bullet, bi) => (
                      <motion.li
                        key={`${activeTab}-${bi}`}
                        className="flex items-start gap-2.5 text-xs text-text-secondary sm:text-[13px]"
                        variants={listItem}
                      >
                      <motion.svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-success section-card-icon-glow"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 22,
                            delay: 0.12 + bi * 0.05,
                          }}
                          aria-hidden
                        >
                          <path d="M4.5 12.75l6 6 9-13.5" />
                        </motion.svg>
                        {bullet}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="flex-1 w-full"
            initial={reduced ? false : { opacity: 0, y: liteMotion ? 12 : 28 }}
            animate={
              inView
                ? { opacity: 1, y: 0 }
                : reduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: liteMotion ? 12 : 28 }
            }
            transition={surfaceRevealEnterTransition(liteMotion, reduced, {
              delay: liteMotion ? 0 : 0.1 + index * 0.05,
            })}
          >
            <div className="glass-panel rounded-2xl p-5 shadow-[0_18px_44px_rgb(15_23_42_/_0.05)] sm:p-6">
              <div className="space-y-3">
                {section.tabs.map((tab, i) => (
                  <motion.div
                    key={tab.label}
                    layout={!liteMotion}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveTab(i);
                      }
                    }}
                    className={`cursor-pointer rounded-row-highlight p-3.5 outline-none transition-[box-shadow] duration-300 sm:p-4 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-slate-900 ${
                      activeTab === i
                        ? "glass-panel ring-1 ring-accent/22"
                        : "glass-chip hover:ring-1 hover:ring-gray-border/50"
                    }`}
                    onClick={() => setActiveTab(i)}
                    animate={
                      liteMotion
                        ? {}
                        : {
                            scale: activeTab === i ? 1 : 0.985,
                            opacity: activeTab === i ? 1 : 0.78,
                          }
                    }
                    transition={{ duration: SURFACE_REVEAL_DURATION_FULL, ease: EASE_PRO }}
                  >
                    <div className="mb-1.5 flex items-center gap-2.5">
                      <motion.div
                        className={`glass-chip flex h-7 w-7 items-center justify-center rounded-lg ${section.badgeColor}`}
                        animate={liteMotion ? {} : { scale: activeTab === i ? 1.06 : 1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 24 }}
                      >
                        <svg
                          className="h-3.5 w-3.5 section-card-icon-glow"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          {i === 0 ? (
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          ) : (
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </motion.div>
                      <span className="text-[13px] font-semibold text-primary">{tab.label}</span>
                    </div>
                    <p className="pl-9 text-[11px] leading-relaxed text-text-secondary sm:pl-10 sm:text-xs">
                      {tab.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
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
