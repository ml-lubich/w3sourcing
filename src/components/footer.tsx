"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  W3_LONDON_ADDRESS,
  W3_SINGAPORE_ADDRESS,
  W3_SINGAPORE_REGISTRATION,
} from "@/content/offices";
import { SplitWords } from "@/components/split-words";
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

const footerLinks = [
  { label: "Practices", href: "#practice-areas" },
  { label: "Leadership", href: "#leadership" },
  { label: "Process", href: "#process" },
  { label: "Why W3", href: "#why-w3" },
  { label: "Industries", href: "#industries" },
  { label: "Methodology", href: "#features" },
  { label: "Results", href: "#stats" },
  { label: "Compare", href: "#compare" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const sectors = [
  { label: "Technology", href: "#industries" },
  { label: "Legal", href: "#industries" },
  { label: "Finance", href: "#industries" },
];

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
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12"
          initial={reduced ? false : { opacity: 0, y: liteMotion ? 10 : 16 }}
          animate={
            footerRevealVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: liteMotion ? 10 : 16 }
          }
          transition={surfaceRevealEnterTransition(liteMotion, reduced, {
            delay: reduced ? 0 : 0.06,
          })}
        >
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white text-sm font-extrabold">
                W3
              </span>
              <span className="text-foreground font-bold text-lg tracking-tight">
                Sourcing
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Global recruitment excellence for technology, legal, and finance leaders—human-led judgment on who truly
              fits, for organisations across the US, UK, EU, UAE, and Asia.
            </p>
          </div>

          <div>
            <h4 className="text-muted text-xs font-semibold tracking-[0.12em] uppercase mb-5 inline-block max-w-full">
              <SplitWords as="span" text="Company" stagger={0.06} animate={footSplit} />
            </h4>
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={sectionHref(link.href, sectionLinksFromRoot)}
                  onClick={(e) => onSectionLinkClick(e, link.href)}
                  className="text-text-secondary hover:text-foreground transition-colors duration-200 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-muted text-xs font-semibold tracking-[0.12em] uppercase mb-5 inline-block max-w-full">
              <SplitWords as="span" text="Practices" stagger={0.06} animate={footSplit} />
            </h4>
            <div className="flex flex-col gap-3">
              {sectors.map((link) => (
                <a
                  key={link.label}
                  href={sectionHref(link.href, sectionLinksFromRoot)}
                  onClick={(e) => onSectionLinkClick(e, link.href)}
                  className="text-text-secondary hover:text-foreground transition-colors duration-200 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-muted text-xs font-semibold tracking-[0.12em] uppercase mb-5 inline-block max-w-full">
              <SplitWords as="span" text="Offices" stagger={0.06} animate={footSplit} />
            </h4>
            <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
              <a
                href="mailto:info@w3sourcing.com"
                className="block text-accent hover:text-foreground transition-colors font-medium"
              >
                info@w3sourcing.com
              </a>
              <p className="text-muted text-xs font-semibold uppercase tracking-wider">London</p>
              <address className="not-italic">
                {W3_LONDON_ADDRESS.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="text-muted text-xs font-semibold uppercase tracking-wider pt-1">Singapore</p>
              <address className="not-italic">
                {W3_SINGAPORE_ADDRESS.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="text-muted text-xs pt-1">
                UEN: {W3_SINGAPORE_REGISTRATION.uen}
                <br />
                EA: {W3_SINGAPORE_REGISTRATION.ea}
              </p>
              <p className="text-muted text-sm pt-1">US · UK · EU · UAE · Asia</p>
            </div>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.linkedin.com/in/perrybarrow/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-black/[0.06] hover:bg-accent/90 dark:bg-white/5 shadow-[0_4px_14px_rgb(15_23_42_/_0.08)] dark:shadow-[0_4px_14px_rgb(0_0_0_/_0.25)] hover:shadow-[0_8px_22px_rgb(79_70_229_/_0.35)] flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn — Perry Barrow"
              >
                <svg className="w-4 h-4 text-foreground dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 pt-8 border-t border-gray-border dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4"
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
            <a href="/privacy" className="text-xs text-muted hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs text-muted hover:text-foreground transition-colors">
              Terms of Use
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 text-center"
          initial={reduced ? false : { opacity: 0 }}
          animate={footerRevealVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={surfaceRevealEnterTransition(liteMotion, reduced, {
            delay: reduced ? 0 : 0.2,
          })}
        >
          <p className="text-xs text-muted leading-relaxed">
            Made with love by{" "}
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
