"use client";

import { useRef, useState, useEffect } from "react";
import { ResilientImage } from "@/components/resilient-image";

type CompanyEntry = {
  name: string;
  mark: string;
  domain: string;
};

const topRowCompanies: readonly CompanyEntry[] = [
  { name: "Goldman Sachs", mark: "GS", domain: "goldmansachs.com" },
  { name: "Sequoia Capital", mark: "SQ", domain: "sequoiacap.com" },
  { name: "Andreessen Horowitz", mark: "AH", domain: "a16z.com" },
  { name: "Clifford Chance", mark: "CC", domain: "cliffordchance.com" },
  { name: "Stripe", mark: "ST", domain: "stripe.com" },
  { name: "Raft", mark: "RF", domain: "teamraft.com" },
  { name: "Linklaters", mark: "LK", domain: "linklaters.com" },
  { name: "Morgan Stanley", mark: "MS", domain: "morganstanley.com" },
  { name: "Y Combinator", mark: "YC", domain: "ycombinator.com" },
];

const bottomRowCompanies: readonly CompanyEntry[] = [
  { name: "Allen & Overy", mark: "AO", domain: "allenovery.com" },
  { name: "Revolut", mark: "RV", domain: "revolut.com" },
  { name: "Palantir", mark: "PL", domain: "palantir.com" },
  { name: "JP Morgan", mark: "JP", domain: "jpmorganchase.com" },
  { name: "Freshfields", mark: "FF", domain: "freshfields.com" },
  { name: "Accel Partners", mark: "AC", domain: "accel.com" },
  { name: "Coinbase", mark: "CB", domain: "coinbase.com" },
  { name: "Slaughter and May", mark: "SM", domain: "slaughterandmay.com" },
  { name: "Tiger Global", mark: "TG", domain: "tigerglobal.com" },
];

function companyIconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

/**
 * Long soft ramp at edges (2026-style “infinite” strip): content dissolves into background.
 * Mask + matching scrims below so fade reads in WebKit and Chromium alike.
 */
/** Wide horizontal ramps + explicit size/repeat so fades stay smooth while scrolling (avoids tiled-mask glitches). */
const marqueeMaskClass =
  "[mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [mask-size:100%_100%] [-webkit-mask-size:100%_100%] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]";

/** Two-stop only: heavy `via-*` scrims read as a flat slab on the fixed liquid canvas. */
const edgeScrimClass = "from-background to-transparent";

function CompanyIcon({ name, mark, domain }: CompanyEntry) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className="relative grid size-8 shrink-0 place-items-center sm:size-9"
      aria-hidden
    >
      {failed ? (
        <span className="text-[0.62rem] font-bold leading-none text-accent dark:text-muted sm:text-[0.68rem]">
          {mark}
        </span>
      ) : (
        <ResilientImage
          src={companyIconUrl(domain)}
          alt=""
          width={28}
          height={28}
          unoptimized
          wrapperClassName="relative block size-5 sm:size-6"
          skeletonClassName="bg-transparent"
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
          title={name}
        />
      )}
    </span>
  );
}

function MarqueeItem({ ariaHidden = false, ...company }: CompanyEntry & { ariaHidden?: boolean }) {
  const itemClassName =
    "inline-flex shrink-0 items-center gap-3 px-5 opacity-[0.76] transition-opacity duration-500 ease-out group-hover/trusted-marquee:opacity-100 dark:opacity-[0.54] dark:group-hover/trusted-marquee:opacity-[0.9] sm:px-7 [@media(hover:none)]:opacity-[0.8] dark:[@media(hover:none)]:opacity-[0.6]";
  const itemContent = (
    <>
      <CompanyIcon {...company} />
      <span className="text-[0.8125rem] font-medium tracking-wide text-text-secondary sm:text-sm dark:text-muted">
        {company.name}
      </span>
    </>
  );

  if (ariaHidden) {
    return (
      <span className={itemClassName} aria-hidden="true">
        {itemContent}
      </span>
    );
  }

  return (
    <span
      className={itemClassName}
    >
      {itemContent}
    </span>
  );
}

function MarqueeTrack({
  companies,
  copyKey,
  reverse,
  durationClassName,
  active,
  className = "",
}: {
  companies: readonly CompanyEntry[];
  copyKey: string;
  reverse: boolean;
  durationClassName: string;
  active: boolean;
  className?: string;
}) {
  const orderedCompanies = reverse ? [...companies].reverse() : companies;
  const directionClassName = reverse ? "[animation-direction:reverse]" : "";

  return (
    <div
      className={`animate-marquee flex shrink-0 items-center ${directionClassName} ${durationClassName} ${
        active ? "" : "marquee-paused"
      } ${className}`.trim()}
    >
      {orderedCompanies.map((company) => (
        <MarqueeItem key={`${copyKey}-a-${company.domain}`} {...company} />
      ))}
      {orderedCompanies.map((company) => (
        <MarqueeItem key={`${copyKey}-b-${company.domain}`} {...company} ariaHidden />
      ))}
    </div>
  );
}

export function TrustedBy() {
  const ref = useRef<HTMLDivElement>(null);
  const [introRevealed, setIntroRevealed] = useState(false);
  const [marqueeActive, setMarqueeActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIntroRevealed(true);
        setMarqueeActive(entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "0px 0px 48px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const revealed = introRevealed
    ? "trusted-by-fade opacity-100 translate-y-0"
    : "trusted-by-fade opacity-0 translate-y-4";

  return (
    <section
      ref={ref}
      className="group/trusted-marquee relative isolate overflow-hidden bg-transparent py-7 md:py-10"
      aria-label="Organizations that trust this firm"
    >
      <div
        className={`relative z-[1] mb-8 md:mb-10 text-center transition-all duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${revealed}`}
      >
        <span className="inline-block max-w-[min(40rem,92vw)] text-balance text-[0.6875rem] font-semibold uppercase leading-relaxed tracking-[0.16em] text-muted/72 sm:text-xs dark:text-muted/42">
          Trusted by VC-backed operators, fund leaders, finance teams, and law firms when leadership hires need judgment
        </span>
      </div>

      <div className="relative z-[1]">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 z-[2] w-16 bg-gradient-to-r sm:w-24 md:w-36 ${edgeScrimClass}`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 z-[2] w-16 bg-gradient-to-l sm:w-24 md:w-36 ${edgeScrimClass}`}
        />

        <div
          className={`mb-4 transition-all delay-75 duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${revealed}`}
        >
          <div className={`relative flex overflow-hidden ${marqueeMaskClass}`}>
            <MarqueeTrack
              companies={topRowCompanies}
              copyKey="trusted-row-top"
              reverse={false}
              durationClassName="[animation-duration:78s]"
              active={marqueeActive}
            />
          </div>
        </div>

        <div
          className={`transition-all delay-200 duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${revealed}`}
        >
          <div className={`relative flex overflow-hidden ${marqueeMaskClass}`}>
            <MarqueeTrack
              companies={bottomRowCompanies}
              copyKey="trusted-row-bottom"
              reverse
              durationClassName="[animation-duration:96s]"
              active={marqueeActive}
              className="-translate-x-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
