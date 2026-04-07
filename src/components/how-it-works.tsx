"use client";

import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SplitWords } from "@/components/split-words";
import { surfaceCardWhileHover, surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";
import { MotionDash, MotionPulse, sectionDecoSvgClassName } from "@/components/section-animated-art";
import { ChevronRight, ClipboardList, Handshake, Radar, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Step = {
  n: number;
  title: string;
  body: string;
  Icon: LucideIcon;
  accent: string;
};

const steps: Step[] = [
  {
    n: 1,
    title: "Discovery & Alignment",
    body: "We invest time to understand your business, culture, and talent objectives before we engage any search.",
    Icon: ClipboardList,
    accent:
      "from-violet-500/45 via-violet-400/18 to-accent/32 dark:from-violet-500/22 dark:via-transparent dark:to-accent/16",
  },
  {
    n: 2,
    title: "Targeted Search & Assessment",
    body: "We identify and evaluate high-calibre candidates through rigorous, human-led assessment—what great looks like for your context, not what a model scores highest.",
    Icon: Radar,
    accent:
      "from-accent/40 via-cyan-400/20 to-cyan-500/35 dark:from-accent/18 dark:via-transparent dark:to-cyan-500/18",
  },
  {
    n: 3,
    title: "Transparent Process & Collaboration",
    body: "Our teams provide continuous updates, market insight, and collaborative support from shortlist to offer and onboarding.",
    Icon: UserCheck,
    accent:
      "from-cyan-500/38 via-accent/22 to-accent/38 dark:from-cyan-500/16 dark:via-transparent dark:to-accent/18",
  },
  {
    n: 4,
    title: "Long-Term Partnership",
    body: "We’re not just filling roles—we’re building talent strategies that support sustainable growth and organisational impact.",
    Icon: Handshake,
    accent:
      "from-accent/42 via-violet-400/22 to-violet-500/40 dark:from-accent/22 dark:via-transparent dark:to-violet-500/16",
  },
];

function StepArt({ variant, idSuffix, animate }: { variant: 1 | 2 | 3 | 4; idSuffix: string; animate: boolean }) {
  const stroke = "currentColor";
  const labelFill = "currentColor";
  const m1 = `hiw-m1-${idSuffix}`;
  const m2 = `hiw-m2-${idSuffix}`;
  const labelStyle = { font: "600 6px var(--font-sans-jakarta), system-ui, sans-serif", fill: labelFill, opacity: 1 } as const;
  const labelSm = { ...labelStyle, font: "600 5.5px var(--font-sans-jakarta), system-ui, sans-serif" } as const;
  const labelXs = { ...labelStyle, font: "600 5px var(--font-sans-jakarta), system-ui, sans-serif" } as const;
  return (
    <svg
      className={`${sectionDecoSvgClassName(animate)} hiw-step-art-svg transition-[color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
      viewBox="0 0 200 120"
      fill="none"
      aria-hidden
    >
      {variant === 1 && (
        <>
          {/* Mandate brief + stakeholder alignment */}
          <rect x="22" y="22" width="156" height="78" rx="10" stroke={stroke} strokeWidth="1.15" />
          <path d="M34 36h108" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M34 36v-6h12v6" stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
          <text x="50" y="34" style={{ ...labelStyle, font: "600 6.5px var(--font-sans-jakarta), system-ui, sans-serif" }}>
            Search mandate
          </text>
          <path d="M34 50h92M34 60h76M34 70h84" stroke={stroke} strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
          <path d="M34 50l4 4-4 4M34 60l4 4-4 4M34 70l4 4-4 4" stroke={stroke} strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
          <g stroke={stroke} strokeWidth="1">
            <rect x="142" y="44" width="36" height="22" rx="4" />
            <path d="M150 52h20M150 58h14" strokeLinecap="round" />
          </g>
          <text x="144" y="42" style={labelSm}>
            Success criteria
          </text>
          <g stroke={stroke} strokeWidth="1.05">
            <circle cx="48" cy="98" r="7" />
            <path d="M48 93v10M44 96h8" strokeLinecap="round" />
            <circle cx="100" cy="98" r="7" />
            <path d="M97 95l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="152" cy="98" r="7" />
            <path d="M148 98h8M152 94v8" strokeLinecap="round" />
          </g>
          <path
            d="M55 98h38M117 98h28"
            stroke={stroke}
            strokeWidth="0.95"
            strokeLinecap="round"
            opacity={0.82}
            strokeDasharray="4 6"
          >
            <MotionDash active={animate} dur="2.6s" />
          </path>
          <text x="32" y="114" style={labelXs}>
            Client · Hiring lead · Search partner
          </text>
        </>
      )}
      {variant === 2 && (
        <>
          {/* Regional market map + targeted talent radar */}
          <path
            d="M28 88c22-36 122-36 144 0"
            stroke={stroke}
            strokeWidth="1.05"
            strokeLinecap="round"
            opacity={0.72}
            strokeDasharray="5 7"
          >
            <MotionDash active={animate} dur="3.2s" />
          </path>
          <g stroke={stroke} strokeWidth="1.05">
            <circle cx="52" cy="42" r="9" />
            <path d="M52 36v12M46 42h12" strokeLinecap="round" />
            <circle cx="100" cy="34" r="9" />
            <path d="M100 28v12M94 34h12" strokeLinecap="round" />
            <circle cx="148" cy="42" r="9" />
            <path d="M148 36v12M142 42h12" strokeLinecap="round" />
          </g>
          <text x="44" y="58" style={labelSm}>
            US
          </text>
          <text x="88" y="58" style={labelSm}>
            UK · EU
          </text>
          <text x="132" y="58" style={labelSm}>
            UAE · Asia
          </text>
          <circle cx="100" cy="78" r="22" stroke={stroke} strokeWidth="1.15" opacity="0.9" />
          <circle cx="100" cy="78" r="12" stroke={stroke} strokeWidth="0.95" opacity="0.75" />
          <path d="M100 78l18-14" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="118" cy="64" r="3" fill="currentColor" className="text-accent/65 dark:text-accent/58 transition-colors duration-500">
            <MotionPulse active={animate} begin="0s" />
          </circle>
          <g stroke={stroke} strokeWidth="0.9" opacity={0.9}>
            <circle cx="72" cy="72" r="3.5" fill="currentColor" className="text-accent/35 dark:text-accent/30">
              <MotionPulse active={animate} begin="0.25s" />
            </circle>
            <circle cx="86" cy="92" r="3.5" fill="currentColor" className="text-accent/35 dark:text-accent/30">
              <MotionPulse active={animate} begin="0.5s" />
            </circle>
            <circle cx="128" cy="90" r="3.5" fill="currentColor" className="text-accent/35 dark:text-accent/30">
              <MotionPulse active={animate} begin="0.75s" />
            </circle>
            <path d="M75 73l20 10M89 91l14-8M125 89l-18-8" strokeLinecap="round" opacity={0.72}>
              <MotionDash active={animate} dur="2.4s" />
            </path>
          </g>
          <text x="68" y="112" style={labelXs}>
            Passive talent · market mapping
          </text>
        </>
      )}
      {variant === 3 && (
        <>
          {/* Structured assessment pipeline */}
          <g stroke={stroke} strokeWidth="1.05">
            <rect x="18" y="44" width="48" height="36" rx="6" />
            <rect x="76" y="44" width="48" height="36" rx="6" />
            <rect x="134" y="44" width="48" height="36" rx="6" />
          </g>
          <path d="M66 62h10M124 62h10" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" markerEnd={`url(#${m1})`} />
          <defs>
            <marker id={m1} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path
                d="M0 0L5 2.5L0 5Z"
                fill="currentColor"
                className="opacity-70 dark:opacity-45 transition-opacity duration-500 ease-out"
              />
            </marker>
          </defs>
          <text x="22" y="58" style={labelStyle}>
            Screen
          </text>
          <text x="80" y="58" style={labelStyle}>
            Interview
          </text>
          <text x="128" y="58" style={labelStyle}>
            Shortlist
          </text>
          <path
            d="M30 68h24M88 68h20M146 68h24"
            stroke={stroke}
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity={0.78}
            strokeDasharray="4 5"
          >
            <MotionDash active={animate} dur="2.9s" />
          </path>
          <path d="M100 24v16" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.55" />
          <rect x="76" y="16" width="48" height="14" rx="4" stroke={stroke} strokeWidth="0.95" />
          <text x="82" y="25" style={labelSm}>
            Shortlist
          </text>
          <g stroke={stroke} strokeWidth="0.9" opacity="0.8">
            <path d="M40 96c8-10 24-10 32 0M88 96c8-10 24-10 32 0M136 96c8-10 24-10 32 0" strokeLinecap="round" />
            <circle cx="56" cy="104" r="4" />
            <circle cx="100" cy="104" r="4" />
            <circle cx="144" cy="104" r="4" />
          </g>
          <text x="52" y="116" style={labelXs}>
            Client visibility · weekly cadence
          </text>
        </>
      )}
      {variant === 4 && (
        <>
          {/* Offer → onboarding → retained partnership */}
          <path
            d="M32 88c28-18 108-18 136 0"
            stroke={stroke}
            strokeWidth="1.15"
            strokeLinecap="round"
            opacity={0.72}
            strokeDasharray="5 6"
          >
            <MotionDash active={animate} dur="3s" />
          </path>
          <circle cx="48" cy="82" r="7" stroke={stroke} strokeWidth="1.05" />
          <circle cx="100" cy="70" r="7" stroke={stroke} strokeWidth="1.05" />
          <circle cx="152" cy="82" r="7" stroke={stroke} strokeWidth="1.05" />
          <path d="M55 80l38-8M107 72l38 8" stroke={stroke} strokeWidth="1" strokeLinecap="round" markerEnd={`url(#${m2})`} />
          <defs>
            <marker id={m2} markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto">
              <path
                d="M0 0L4 2L0 4Z"
                fill="currentColor"
                className="opacity-65 dark:opacity-40 transition-opacity duration-500 ease-out"
              />
            </marker>
          </defs>
          <text x="28" y="98" style={labelXs}>
            Offer
          </text>
          <text x="86" y="86" style={labelXs}>
            Onboard
          </text>
          <text x="132" y="98" style={labelXs}>
            Retained partner
          </text>
          <path d="M36 38h128" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <path
            d="M36 38l8 12 16-12 20 14 24-18 20 16 24-14 12 10"
            stroke={stroke}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 6"
            opacity={0.88}
          >
            <MotionDash active={animate} dur="2.8s" />
          </path>
          <circle cx="36" cy="38" r="3.5" fill="currentColor" className="text-accent/58 dark:text-accent/45 transition-colors duration-500">
            <MotionPulse active={animate} begin="0.1s" />
          </circle>
          <circle cx="164" cy="38" r="3.5" fill="currentColor" className="text-success/52 dark:text-success/42 transition-colors duration-500">
            <MotionPulse active={animate} begin="0.45s" />
          </circle>
          <text x="34" y="30" style={labelXs}>
            Impact over time
          </text>
        </>
      )}
    </svg>
  );
}

function StepCard({
  step,
  index,
  reduced,
  liteMotion,
  inView,
}: {
  step: Step;
  index: number;
  reduced: boolean;
  liteMotion: boolean;
  inView: boolean;
}) {
  const v = (step.n as 1 | 2 | 3 | 4) ?? 1;
  const delay = reduced ? 0 : 0.08 * index;
  const headingSplit = useSplitWordsAnimate(inView);

  return (
    <motion.article
      className="glass-panel relative w-full lg:flex-1 lg:min-w-0 rounded-2xl shadow-[0_22px_56px_rgb(15_23_42_/_0.11)] dark:shadow-[0_24px_60px_rgb(0_0_0_/_0.32)] overflow-hidden"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={surfaceRevealEnterTransition(liteMotion, reduced, { delay })}
      whileHover={surfaceCardWhileHover(liteMotion)}
    >
      <div
        className={`relative h-36 overflow-hidden bg-gradient-to-br ${step.accent} via-surface/55 dark:via-slate-900/20 to-slate-50/30 dark:to-transparent transition-colors duration-500`}
      >
        <StepArt variant={v} idSuffix={`${step.n}`} animate={inView && !reduced} />
        <div className="step-card-header-scrim pointer-events-none absolute inset-0" aria-hidden />
        <div className="absolute bottom-4 left-5 flex items-center gap-3">
          <span className="hidden lg:flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/95 bg-white/92 text-sm font-extrabold text-accent shadow-[0_6px_20px_rgb(15_23_42_/_0.1)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.08] dark:shadow-[0_6px_20px_rgb(0_0_0_/_0.32)] transition-[background-color,border-color,box-shadow] duration-500">
            {step.n}
          </span>
          <div className="rounded-xl border border-slate-200/90 bg-white/92 p-2.5 shadow-[0_6px_22px_rgb(15_23_42_/_0.09)] backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.07] dark:shadow-[0_6px_22px_rgb(0_0_0_/_0.3)] transition-[background-color,border-color,box-shadow] duration-500">
            <step.Icon className="size-5 text-accent dark:text-white section-card-icon-glow" strokeWidth={2} aria-hidden />
          </div>
        </div>
      </div>
      <div className="p-6 pt-5">
        <h3 className="text-lg font-bold text-primary dark:text-white tracking-tight mb-2">
          <SplitWords
            as="span"
            text={step.title}
            stagger={0.04}
            delayStart={0.02}
            animate={headingSplit}
          />
        </h3>
        <motion.p
          className="text-sm sm:text-[0.9375rem] text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-500"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={
            inView ? { opacity: 1, y: 0 } : reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
          }
          transition={surfaceRevealEnterTransition(liteMotion, reduced, {
            delay: reduced ? 0 : delay + 0.16,
          })}
        >
          {step.body}
        </motion.p>
      </div>
    </motion.article>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;
  const sectionHeadingSplit = useSplitWordsAnimate(inView);

  return (
    <section
      ref={ref}
      id="process"
      className="section-padding section-glass-ambient section-band-glass-muted relative transition-[background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      aria-labelledby="process-heading"
    >
      <div className="section-glass-inner mx-auto max-w-7xl px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center mb-14 md:mb-16"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={surfaceRevealEnterTransition(liteMotion, reduced)}
        >
          <h2
            id="process-heading"
            className="text-3xl sm:text-4xl md:text-[2.65rem] font-extrabold text-primary dark:text-white tracking-tight leading-[1.12]"
          >
            <SplitWords
              as="span"
              text="How We Work"
              className="justify-center"
              stagger={0.045}
              delayStart={0.08}
              animate={sectionHeadingSplit}
            />
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-500">
            Discovery through placement—with transparency, expert judgment, and a long-term view the stack cannot automate.
          </p>
        </motion.div>

        {/* Desktop: row with chevrons */}
        <div className="hidden lg:flex flex-row items-stretch">
          {steps.map((step, index) => (
            <Fragment key={step.n}>
              <StepCard step={step} index={index} reduced={reduced} liteMotion={liteMotion} inView={inView} />
              {index < steps.length - 1 && (
                <div
                  className="flex shrink-0 w-5 xl:w-7 items-center justify-center self-center pt-[4.5rem]"
                  aria-hidden
                >
                  <ChevronRight
                    className="size-5 xl:size-6 text-accent/58 dark:text-accent/45 transition-colors duration-500"
                    strokeWidth={1.75}
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Mobile / tablet: stack + timeline */}
        <div className="lg:hidden relative pl-2">
          <div
            className="absolute left-[1.375rem] top-3 bottom-3 w-px bg-gradient-to-b from-accent/55 via-accent/35 to-accent/55 dark:from-accent/45 dark:via-accent/25 dark:to-accent/45 rounded-full transition-[background] duration-500"
            aria-hidden
          />
          <ul className="space-y-10">
            {steps.map((step, index) => (
              <li key={step.n} className="relative pl-12">
                <span
                  className="absolute left-0 top-7 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface dark:border-slate-900 bg-accent text-[11px] font-bold text-white shadow-[0_0_0_4px_var(--surface)] dark:shadow-[0_0_0_4px_rgb(15_23_42)]"
                  aria-hidden
                >
                  {step.n}
                </span>
                <StepCard step={step} index={index} reduced={reduced} liteMotion={liteMotion} inView={inView} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
