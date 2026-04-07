"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

import { sectionHref } from "@/lib/section-href";
import { isScrollSpySuppressed } from "@/lib/scroll-to-section";
import { useSectionLinkClick } from "@/lib/use-section-link-click";

const navLinks = [
  { label: "Practices", href: "#practice-areas" },
  { label: "Leadership", href: "#leadership" },
  { label: "Process", href: "#process" },
  { label: "Methodology", href: "#features" },
  { label: "Results", href: "#stats" },
  { label: "Compare", href: "#compare" },
  { label: "Clients", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

export type HeaderProps = {
  /** When true, in-page section links use `/#section` so they work from non-home routes. */
  sectionLinksFromRoot?: boolean;
};

/** Extra px below measured scroll-padding so the next section wins despite subpixel / smooth-scroll end state. */
const SCROLL_SPY_BUFFER_PX = 24;

const SCROLL_UP_SHOW_DELTA_PX = 5;
/** Below this scroll position the header stays visible (no auto-hide). */
const NAV_HIDE_MIN_SCROLL_Y = 72;

export function Header({ sectionLinksFromRoot = false }: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  /** Avoids scroll-spy `setState` before effects run (dev Strict Mode / hash navigations versus SSR). */
  const scrollSpyReadyRef = useRef(false);
  const rafScrollRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const [compactBar, setCompactBar] = useState(false);
  /** When true, bar slides up off-screen until the user scrolls up (mobile menu open keeps it visible). */
  const [headerRetracted, setHeaderRetracted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("");
  const onSectionLinkClick = useSectionLinkClick(sectionLinksFromRoot);

  const onMobileSectionLinkClick = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      hashHref: (typeof navLinks)[number]["href"] | "#contact",
    ) => {
      setMobileOpen(false);
      onSectionLinkClick(event, hashHref, { samePageDelayMs: 120 });
    },
    [onSectionLinkClick],
  );

  const syncActiveSection = useCallback(() => {
    if (isScrollSpySuppressed() || !scrollSpyReadyRef.current) return;

    const scrollPadRaw = getComputedStyle(document.documentElement).scrollPaddingTop;
    const scrollPadPx = Number.parseFloat(scrollPadRaw);
    /** Align with `html { scroll-padding-top }` so the active item matches visible section after offset scrolling. */
    const threshold =
      (Number.isFinite(scrollPadPx) ? scrollPadPx : 88) + SCROLL_SPY_BUFFER_PX;
    let current = "";
    for (const link of navLinks) {
      const id = link.href.slice(1);
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= threshold) current = link.href;
    }
    setActiveHref((prev) => (prev === current ? prev : current));
  }, []);

  useEffect(() => {
    const runScrollFrame = () => {
      if (rafScrollRef.current !== null) return;
      rafScrollRef.current = window.requestAnimationFrame(() => {
        rafScrollRef.current = null;
        const y = window.scrollY;
        setCompactBar(y > 12);

        const prevY = lastScrollYRef.current;
        lastScrollYRef.current = y;
        if (mobileOpen) {
          setHeaderRetracted(false);
        } else if (y <= 12) {
          setHeaderRetracted(false);
        } else if (y > NAV_HIDE_MIN_SCROLL_Y) {
          if (y > prevY + SCROLL_UP_SHOW_DELTA_PX) {
            setHeaderRetracted(true);
          } else if (y < prevY - SCROLL_UP_SHOW_DELTA_PX) {
            setHeaderRetracted(false);
          }
        }

        syncActiveSection();
      });
    };

    const onScroll = () => runScrollFrame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("hashchange", syncActiveSection);
    window.addEventListener("scrollend", syncActiveSection);

    const el = headerRef.current;
    const ro =
      el && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => runScrollFrame())
        : null;
    if (el && ro) ro.observe(el);

    scrollSpyReadyRef.current = true;
    runScrollFrame();
    return () => {
      scrollSpyReadyRef.current = false;
      if (rafScrollRef.current !== null) {
        window.cancelAnimationFrame(rafScrollRef.current);
        rafScrollRef.current = null;
      }
      ro?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", syncActiveSection);
      window.removeEventListener("scrollend", syncActiveSection);
    };
  }, [syncActiveSection, mobileOpen]);

  return (
    <header
      ref={headerRef}
      data-at-top={compactBar ? undefined : ""}
      className={`header-bar fixed top-0 left-0 right-0 z-50 transition-[padding,box-shadow,transform] duration-300 ease-out ${
        compactBar ? "py-2.5" : "py-3 md:py-4"
      } ${headerRetracted ? "-translate-y-full pointer-events-none" : "translate-y-0"}`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between gap-3 min-w-0">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white text-sm font-extrabold shadow-sm transition-transform group-hover:scale-[1.03]">
            W3
          </span>
          <span className="text-primary font-bold text-lg tracking-tight">
            Sourcing
          </span>
        </Link>

        <nav
          className="relative z-10 hidden md:flex min-w-0 flex-1 items-center justify-start gap-x-1 overflow-x-auto overscroll-x-contain px-1 lg:justify-center lg:gap-x-2 [scrollbar-width:thin]"
          aria-label="Primary"
        >
          {navLinks.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={sectionHref(link.href, sectionLinksFromRoot)}
                onClick={(e) => {
                  setActiveHref(link.href);
                  onSectionLinkClick(e, link.href);
                }}
                aria-current={isActive ? "location" : undefined}
                className={`nav-link-section shrink-0 whitespace-nowrap px-2 py-2 text-sm font-medium rounded-lg duration-200 lg:px-3 ${
                  isActive
                    ? "nav-link-section-active"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <a
            href={sectionHref("#contact", sectionLinksFromRoot)}
            onClick={(e) => {
              setActiveHref("#contact");
              onSectionLinkClick(e, "#contact");
            }}
            className="hidden md:inline-flex bg-accent text-white font-semibold text-sm py-2.5 px-5 rounded-xl shadow-[0_2px_12px_rgb(79_70_229_/_0.2)] transition-all duration-200 hover:bg-accent-hover"
          >
            Get in touch
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="glass-chip md:hidden text-primary p-2 relative z-50 rounded-xl"
            aria-label="Toggle menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-surface md:hidden absolute top-full left-0 right-0 z-[2] min-h-[calc(100dvh-4.5rem)] overflow-hidden border-t border-gray-border/35 shadow-[0_24px_48px_rgb(15_23_42_/_0.12)] dark:shadow-[0_24px_48px_rgb(0_0_0_/_0.4)]"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <nav className="flex flex-col p-6 gap-1">
              {navLinks.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <a
                    key={link.href}
                    href={sectionHref(link.href, sectionLinksFromRoot)}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(e) => {
                      setActiveHref(link.href);
                      onMobileSectionLinkClick(e, link.href);
                    }}
                    className={`nav-link-section transition-colors py-3 font-medium rounded-row-highlight px-3 -mx-1 ${
                      isActive
                        ? "nav-link-section-active"
                        : "text-text-secondary hover:text-accent hover:bg-gray-light/70 dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href={sectionHref("#contact", sectionLinksFromRoot)}
                onClick={(e) => {
                  setActiveHref("#contact");
                  onMobileSectionLinkClick(e, "#contact");
                }}
                className="bg-accent text-white font-semibold text-sm py-3 px-6 rounded-xl text-center shadow-[0_4px_20px_rgb(79_70_229_/_0.28)] transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_8px_28px_rgb(79_70_229_/_0.38)]"
              >
                Get in touch
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
