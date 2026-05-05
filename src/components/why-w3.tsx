"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Handshake, Scale, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ResilientImage } from "@/components/resilient-image";
import { SplitWords } from "@/components/split-words";
import { WhyW3AnimatedArt } from "@/components/section-animated-art";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import { surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

type WhyArt = "expertise" | "global" | "relationship" | "ethics";

type Pillar = {
  title: string;
  body: string;
  Icon: LucideIcon;
  art: WhyArt;
  tone: string;
  photoSrc: string;
  photoAlt: string;
  photoObjectClassName?: string;
};

const WHY_W3_HEADROOM_PHOTO_CLASS = "people-photo-object--headroom";

const pillars: Pillar[] = [
  {
    title: "Deep Domain Expertise",
    body:
      "Our consultants bring sector-specific insight and live market calibration to every engagement, from VC-backed operator searches to partner and regulated finance mandates. That context, advocacy, and judgment help placements land faster and hold longer.",
    Icon: Sparkles,
    art: "expertise",
    tone: "surface-gradient-field--venture",
    photoSrc: "/images/perry_assets/10.png",
    photoAlt: "Boardroom strategy meeting photo",
    photoObjectClassName: WHY_W3_HEADROOM_PHOTO_CLASS,
  },
  {
    title: "Global Reach, Local Insight",
    body:
      "With active search capabilities across the U.S., U.K., EU, UAE, and Asia, we understand region-specific talent dynamics while delivering a seamless cross-border recruitment experience.",
    Icon: Globe2,
    art: "global",
    tone: "surface-gradient-field--process",
    photoSrc: "/images/perry_assets/12.png",
    photoAlt: "International business networking event photo",
    photoObjectClassName: WHY_W3_HEADROOM_PHOTO_CLASS,
  },
  {
    title: "Human-Led & Relationship-Driven",
    body:
      "We prioritise consultation and collaboration over transactional hiring. Tools can rank keywords; they do not have taste, founder feel, or responsibility for your reputation. Our partners do, with clients and candidates alike.",
    Icon: Handshake,
    art: "relationship",
    tone: "surface-gradient-field--process",
    photoSrc: "/images/perry_assets/14.png",
    photoAlt: "Interview meeting photo with three professionals",
  },
  {
    title: "Commitment to Ethics & Confidentiality",
    body:
      "We operate with the highest professional and ethical standards. Protecting confidential candidate and client information is core to how we work, and we uphold fair, inclusive, and non-discriminatory recruitment practices.",
    Icon: Scale,
    art: "ethics",
    tone: "surface-gradient-field--trust",
    photoSrc: "/images/perry_assets/15.png",
    photoAlt: "Professional conference conversation photo",
    photoObjectClassName: WHY_W3_HEADROOM_PHOTO_CLASS,
  },
];

export function WhyW3() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useHydrationSafeReducedMotion();
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;
  const headingSplit = useSplitWordsAnimate(visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="why-w3"
      className="section-padding section-glass-ambient section-band-glass"
      aria-labelledby="why-w3-heading"
    >
      <div className="section-glass-inner mx-auto max-w-7xl px-6">
        <div
          className={`max-w-2xl mx-auto text-center mb-14 md:mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            id="why-w3-heading"
            className="w-full text-2xl font-extrabold tracking-[-0.02em] text-primary dark:text-white sm:text-3xl md:text-[2.25rem] leading-[1.2]"
          >
            <SplitWords
              as="span"
              text="Why W3 Sourcing?"
              className="justify-center"
              stagger={0.04}
              delayStart={0.05}
              animate={headingSplit}
            />
          </h2>
        </div>

        <ul
          className="why-w3-art-rail mb-8 grid gap-4 list-none p-0 sm:grid-cols-4 md:mb-10"
          aria-hidden
        >
          {pillars.map((pillar, i) => (
            <motion.li
              key={`${pillar.title}-art`}
              className={`glass-panel surface-gradient-field ${pillar.tone} relative h-28 overflow-hidden rounded-2xl sm:h-32`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={visible ? { opacity: 1, y: 0 } : reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              transition={surfaceRevealEnterTransition(liteMotion, reduced, { delay: 0.04 * i })}
            >
              <WhyW3AnimatedArt
                variant={pillar.art}
                idSuffix={`w3-rail-${i}`}
                animate={visible && !reduced}
                className="section-deco-art-svg--rail"
              />
            </motion.li>
          ))}
        </ul>

        <ul className="grid sm:grid-cols-2 gap-6 lg:gap-8 list-none p-0 m-0">
          {pillars.map((pillar, i) => (
            <li key={pillar.title}>
              <motion.article
                className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={
                  visible
                    ? { opacity: 1, y: 0 }
                    : reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 20 }
                }
                transition={surfaceRevealEnterTransition(liteMotion, reduced, { delay: 0.06 * i })}
              >
                <div
                  className={`surface-gradient-field ${pillar.tone} relative h-44 shrink-0 overflow-hidden sm:h-48`}
                >
                  <ResilientImage
                    src={pillar.photoSrc}
                    alt={pillar.photoAlt}
                    fill
                    sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
                    className={`people-photo-object object-cover ${pillar.photoObjectClassName ?? ""}`.trim()}
                    wrapperClassName="absolute inset-0"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/6 to-accent/10 dark:from-black/30 dark:via-black/8 dark:to-accent/10" aria-hidden />
                  <div className="why-card-header-scrim pointer-events-none absolute inset-0" aria-hidden />
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="mb-1.5 text-base font-bold tracking-tight text-primary dark:text-white">
                    <SplitWords
                      as="span"
                      text={pillar.title}
                      stagger={0.038}
                      delayStart={0.02}
                      animate={headingSplit}
                    />
                  </h3>
                  <motion.p
                    className="text-xs leading-relaxed text-text-secondary dark:text-slate-400 sm:text-[13px]"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: liteMotion ? 0 : 10 }}
                    animate={
                      visible
                        ? { opacity: 1, y: 0 }
                        : reduced
                          ? { opacity: 0 }
                          : { opacity: 0, y: liteMotion ? 0 : 10 }
                    }
                    transition={surfaceRevealEnterTransition(liteMotion, reduced, {
                      delay: 0.14 + i * 0.06,
                    })}
                  >
                    {pillar.body}
                  </motion.p>
                </div>
              </motion.article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
