"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Heart } from "lucide-react";
import {
  W3_LONDON_ADDRESS,
  W3_SINGAPORE_ADDRESS,
  W3_SINGAPORE_REGISTRATION,
} from "@/content/offices";
import { ResilientImage } from "@/components/resilient-image";
import { SplitWords } from "@/components/split-words";
import { PERRY_LINKEDIN_URL } from "@/content/contact-links";
import { sectionHref } from "@/lib/section-href";
import { useSectionLinkClick } from "@/lib/use-section-link-click";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useMobileLightMotion } from "@/lib/use-mobile-light-motion";
import {
  isFooterScrollRevealVisible,
  isFooterSplitWordsGateOpen,
} from "@/lib/footer-scroll-reveal-gate";
import { surfaceRevealEnterTransition } from "@/lib/surface-reveal-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

export type FooterProps = {
  sectionLinksFromRoot?: boolean;
};

const sectors = [
  { label: "Technology", href: "#practice-areas" },
  { label: "Legal", href: "#practice-areas" },
  { label: "Finance", href: "#practice-areas" },
  { label: "Industries & functions", href: "#industries" },
  { label: "Areas we cover", href: "#expertise" },
];

/** Split so every column carries a comparable list and the headings align. */
const companyLinks = [
  { label: "Leadership", href: "#leadership" },
  { label: "Why W3", href: "#why-w3" },
  { label: "Process", href: "#process" },
  { label: "Methodology", href: "#features" },
  { label: "Compare", href: "#compare" },
];

const exploreLinks = [
  { label: "Results", href: "#stats" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Practices", href: "#practice-areas" },
];

/** One link column. Every column is built the same way so the headings sit on
 *  a single baseline and the lists share a rhythm. */
function FooterColumn({
  title,
  animate,
  children,
}: {
  title: string;
  animate: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="md:col-span-2 md:border-l md:border-gray-border md:pl-8 dark:md:border-white/[0.06]">
      <h4 className="text-muted text-xs font-semibold tracking-[0.12em] uppercase mb-4 inline-block max-w-full">
        <SplitWords as="span" text={title} stagger={0.06} animate={animate} />
      </h4>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

export function Footer({ sectionLinksFromRoot = false }: FooterProps) {
  const onSectionLinkClick = useSectionLinkClick(sectionLinksFromRoot);
  const footerRef = useRef<HTMLElement | null>(null);
  const footerInView = useInView(footerRef, { once: true, margin: "0px 0px -20% 0px" });
  const [clientMotionReady, setClientMotionReady] = useState(false);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- align first paint with SSR; then allow useInView
    setClientMotionReady(true);
  }, []);
  const reduced = useHydrationSafeReducedMotion();
  const footerRevealVisible = isFooterScrollRevealVisible({
    clientMotionReady,
    inView: footerInView,
    prefersReducedMotion: reduced,
  });
  const footSplit = useSplitWordsAnimate(
    isFooterSplitWordsGateOpen({ clientMotionReady, inView: footerInView }),
  );
  const narrowViewport = useMobileLightMotion();
  const liteMotion = reduced || narrowViewport;

  return (
    <footer
      ref={footerRef}
      className="bg-footer text-foreground overflow-hidden shadow-[0_-12px_40px_rgb(15_23_42_/_0.07)] dark:shadow-[0_-12px_40px_rgb(0_0_0_/_0.35)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
        {/* The footer opens on the ask, the way a good closing line does —
            everything below it is reference material. */}
        <motion.div
          className="footer-cta flex flex-col gap-5 rounded-2xl px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          initial={reduced ? false : { opacity: 0, y: liteMotion ? 8 : 14 }}
          animate={
            footerRevealVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: liteMotion ? 8 : 14 }
          }
          transition={surfaceRevealEnterTransition(liteMotion, reduced)}
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Start a conversation
            </p>
            <p className="mt-1.5 text-lg font-bold leading-snug text-foreground sm:text-xl">
              Hiring, or open to hearing what is out there?
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Perry reads and answers every message himself.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={PERRY_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_-12px_color-mix(in_srgb,var(--accent)_70%,transparent)] transition-[background-color,transform] hover:bg-accent-hover motion-safe:hover:-translate-y-0.5"
            >
              Message us on LinkedIn
            </a>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:text-accent dark:border-white/15"
            >
              View current live jobs
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-10 md:grid-cols-12"
          initial={reduced ? false : { opacity: 0, y: liteMotion ? 10 : 16 }}
          animate={
            footerRevealVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: liteMotion ? 10 : 16 }
          }
          transition={surfaceRevealEnterTransition(liteMotion, reduced, {
            delay: reduced ? 0 : 0.06,
          })}
        >
          <div className="col-span-2 md:col-span-3">
            <div className="mb-4">
              <ResilientImage
                src="/images/logo_w3_sourcing_wordmark.png"
                alt="W3 Sourcing"
                width={184}
                height={72}
                className="h-full w-full object-contain dark:brightness-0 dark:invert"
                wrapperClassName="relative inline-block h-10 w-[150px] overflow-hidden rounded-md align-middle sm:w-[180px]"
              />
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Global recruitment excellence for technology, legal, and finance leaders—human-led judgment on who truly
              fits, for organisations across the US, UK, EU, UAE, and Asia.
            </p>
            <p className="mt-5 text-sm font-medium text-muted">US · UK · EU · UAE · Asia</p>
            <div className="mt-5 flex gap-3">
              <a
                href={PERRY_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-black/[0.06] hover:bg-accent/90 dark:bg-white/5 shadow-[0_4px_14px_rgb(15_23_42_/_0.08)] dark:shadow-[0_4px_14px_rgb(0_0_0_/_0.25)] hover:shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_36%,transparent)] flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn — Perry Barrow"
              >
                <svg className="w-4 h-4 text-foreground dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <FooterColumn title="Company" animate={footSplit}>
            {companyLinks.map((link) => (
              <a
                key={link.label}
                href={sectionHref(link.href, sectionLinksFromRoot)}
                onClick={(e) => onSectionLinkClick(e, link.href)}
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </FooterColumn>

          <FooterColumn title="Practices" animate={footSplit}>
            {sectors.map((link) => (
              <a
                key={link.label}
                href={sectionHref(link.href, sectionLinksFromRoot)}
                onClick={(e) => onSectionLinkClick(e, link.href)}
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </FooterColumn>

          <FooterColumn title="Explore" animate={footSplit}>
            {exploreLinks.map((link) => (
              <a
                key={link.label}
                href={sectionHref(link.href, sectionLinksFromRoot)}
                onClick={(e) => onSectionLinkClick(e, link.href)}
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
            <Link href="/jobs" className="footer-link">
              Live jobs
            </Link>
          </FooterColumn>

          <div className="col-span-2 md:col-span-3 md:border-l md:border-gray-border md:pl-8 dark:md:border-white/[0.06]">
            <h4 className="text-muted text-xs font-semibold tracking-[0.12em] uppercase mb-4 inline-block max-w-full">
              <SplitWords as="span" text="Offices" stagger={0.06} animate={footSplit} />
            </h4>
            {/* Side by side while there is room; one per row once the column
                narrows, so an address never wraps mid-line. */}
            <div className="grid gap-x-6 gap-y-5 text-sm text-text-secondary leading-relaxed sm:grid-cols-2 md:grid-cols-1">
              <div>
                <p className="text-muted text-xs font-semibold uppercase tracking-wider">London</p>
                <address className="not-italic mt-1.5">
                  {W3_LONDON_ADDRESS.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
              <div>
                <p className="text-muted text-xs font-semibold uppercase tracking-wider">Singapore</p>
                <address className="not-italic mt-1.5">
                  {W3_SINGAPORE_ADDRESS.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="text-muted text-xs mt-2">
                  UEN: {W3_SINGAPORE_REGISTRATION.uen}
                  <br />
                  EA: {W3_SINGAPORE_REGISTRATION.ea}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 pt-6 border-t border-gray-border dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={reduced ? false : { opacity: 0 }}
          animate={footerRevealVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={surfaceRevealEnterTransition(liteMotion, reduced, {
            delay: reduced ? 0 : 0.14,
          })}
        >
          <p className="text-xs text-muted">
            © Copyright {new Date().getFullYear()} W3 Sourcing
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-xs text-muted hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted hover:text-foreground transition-colors">
              Terms of Use
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 text-center"
          initial={reduced ? false : { opacity: 0 }}
          animate={footerRevealVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={surfaceRevealEnterTransition(liteMotion, reduced, {
            delay: reduced ? 0 : 0.2,
          })}
        >
          <p className="text-xs text-muted leading-relaxed flex items-center justify-center gap-1.5">
            <span>Made with</span>
            <span className="sr-only"> love </span>
            <Heart aria-hidden="true" className="h-3.5 w-3.5 text-muted" strokeWidth={1.8} />
            <span>by</span>
            <a
              href="https://mishalubich.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Misha Lubich
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
