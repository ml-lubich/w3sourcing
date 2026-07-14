"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Bot, Compass, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SplitWords } from "@/components/split-words";
import { PERRY_LINKEDIN_URL } from "@/content/contact-links";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

type Beat = {
  chapter: string;
  Icon: LucideIcon;
  theme: string;
  myth: string;
  reality: string;
};

/**
 * The narrative spine: four myth-vs-reality beats that carry the W3 thesis —
 * AI-leveraged sourcing and automation at scale, with human judgment and
 * accountability kept on the decisions that actually matter.
 */
const beats: readonly Beat[] = [
  {
    chapter: "01",
    Icon: Compass,
    theme: "Volume",
    myth: "More outreach means more hires. Blast five hundred templated messages and let the funnel sort it out.",
    reality:
      "Volume is noise. We start with market mapping — who genuinely exists for the role, who is moving, who is untouchable — then engage the short list that actually matters. Fewer, better conversations beat a thousand cold sends.",
  },
  {
    chapter: "02",
    Icon: Bot,
    theme: "Matching",
    myth: "An algorithm matches a keyword to a job, so sourcing is a solved problem.",
    reality:
      "Keyword matching surfaces the available, not the exceptional. We let AI find and rank signal at scale, then apply human judgment to the five percent a model cannot weigh — trajectory, motivation, discretion, and how someone will land in your culture.",
  },
  {
    chapter: "03",
    Icon: Sparkles,
    theme: "Automation",
    myth: "Automation replaces the recruiter.",
    reality:
      "Automation replaces the busywork. We automate sourcing, enrichment, and ranking so our partners spend their hours where taste and accountability move the outcome — not on data entry a machine should have done.",
  },
  {
    chapter: "04",
    Icon: ShieldCheck,
    theme: "Accountability",
    myth: "Any recruiter can fill a senior, confidential, or regulated seat.",
    reality:
      "Those are exactly the seats that break spray-and-pray. One accountable partner runs a retained, confidential process end to end and stands behind the shortlist — answerable to clients and candidates alike.",
  },
];

function BeatRow({ beat, index }: { beat: Beat; index: number }) {
  const reduced = useHydrationSafeReducedMotion();
  const { Icon } = beat;
  return (
    <ScrollReveal className="relative">
      <div className="grid gap-5 md:grid-cols-[auto_1fr] md:gap-8">
        <div className="relative z-10 flex items-center gap-4 md:flex-col md:items-center md:gap-2">
          <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl text-accent">
            {/* Opaque backing occludes the spine so the node reads as a bead the line threads through. */}
            <span aria-hidden className="absolute inset-0 rounded-2xl bg-background" />
            <span className="glass-panel relative flex size-12 items-center justify-center rounded-2xl">
              <Icon className="size-5" strokeWidth={2} aria-hidden />
            </span>
          </span>
          <span className="relative rounded-md bg-background px-1.5 font-mono text-sm font-semibold tracking-[0.2em] text-muted md:mt-1">
            {beat.chapter}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div
            className="rounded-2xl border border-gray-border/60 bg-transparent p-5 dark:border-white/[0.08]"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              The myth
            </p>
            <p className="text-sm leading-relaxed text-text-secondary line-through decoration-muted/40 decoration-1">
              {beat.myth}
            </p>
          </motion.div>

          <motion.div
            className="glass-panel rounded-2xl p-5 shadow-[0_12px_36px_rgb(15_23_42_/_0.06)] dark:shadow-[0_12px_36px_rgb(0_0_0_/_0.32)]"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.5, delay: reduced ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              The W3 reality · {beat.theme}
            </p>
            <p className="text-sm leading-relaxed text-primary">{beat.reality}</p>
          </motion.div>
        </div>
      </div>
      {index < beats.length - 1 ? (
        <div
          aria-hidden
          className="ml-6 mt-5 h-6 w-px bg-gradient-to-b from-gray-border/70 to-transparent md:hidden dark:from-white/10"
        />
      ) : null}
    </ScrollReveal>
  );
}

export function W3Approach() {
  const headingSplit = useSplitWordsAnimate(true);
  const reduced = useHydrationSafeReducedMotion();
  const beatsRef = useRef<HTMLDivElement>(null);
  // Draw the chapter spine as the reader scrolls the beats into and through view.
  const { scrollYProgress } = useScroll({
    target: beatsRef,
    offset: ["start 0.7", "end 0.6"],
  });
  const spineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="approach"
      className="section-padding section-band-glass-muted relative overflow-hidden"
      aria-labelledby="approach-heading"
    >
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center">
          <span className="glass-chip mb-5 inline-block rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            The W3 approach
          </span>
          <h2
            id="approach-heading"
            className="text-3xl font-extrabold leading-[1.15] tracking-tight text-primary sm:text-4xl lg:text-5xl"
          >
            <SplitWords
              as="span"
              text="What most people get wrong about recruiting"
              className="justify-center"
              stagger={0.035}
              animate={headingSplit}
            />
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
            The industry sells volume and automation as the whole answer. We think that gets it
            backwards. Here is where the status quo breaks — and how W3 leverages AI to source and
            automate at scale while keeping human judgment on the decisions that matter.
          </p>
        </ScrollReveal>

        <div ref={beatsRef} className="relative space-y-6">
          {/* Chapter spine — a faint rail that fills with accent as the story is read. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-3 left-6 top-3 hidden w-px md:block"
          >
            <div className="absolute inset-0 bg-gray-border/45 dark:bg-white/[0.07]" />
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-accent via-accent/70 to-accent/20"
              style={{ scaleY: reduced ? 1 : spineScaleY }}
            />
          </div>
          {beats.map((beat, i) => (
            <BeatRow key={beat.chapter} beat={beat} index={i} />
          ))}
        </div>

        <ScrollReveal className="mt-14">
          <div className="glass-panel-liquid mx-auto max-w-3xl rounded-2xl px-6 py-8 text-center sm:px-10">
            <h3 className="text-xl font-extrabold tracking-tight text-primary sm:text-2xl">
              Automation finds names. We take responsibility for the hire.
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
              That is the whole W3 model: machines for scale, a principal for judgment, one partner
              accountable for the shortlist. If that is how you want your next senior hire run,
              let&apos;s talk.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={PERRY_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_color-mix(in_srgb,var(--accent)_34%,transparent)] transition-all duration-200 hover:bg-accent-hover sm:w-auto"
              >
                Message us on LinkedIn
                <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
              </a>
              <a
                href="/jobs"
                className="glass-panel glass-panel--chrome inline-flex w-full items-center justify-center rounded-xl px-7 py-3.5 text-sm font-semibold text-primary transition-all duration-200 hover:text-accent sm:w-auto"
              >
                View current live jobs
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
