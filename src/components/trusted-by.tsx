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

const thirdRowCompanies: readonly CompanyEntry[] = [
  { name: "Bain Capital", mark: "BC", domain: "baincapital.com" },
  { name: "Index Ventures", mark: "IX", domain: "indexventures.com" },
  { name: "Citadel", mark: "CT", domain: "citadel.com" },
  { name: "Kirkland & Ellis", mark: "KE", domain: "kirkland.com" },
  { name: "Databricks", mark: "DB", domain: "databricks.com" },
  { name: "Lightspeed", mark: "LS", domain: "lsvp.com" },
  { name: "Point72", mark: "P7", domain: "point72.com" },
  { name: "Herbert Smith Freehills", mark: "HS", domain: "hsf.com" },
  { name: "General Catalyst", mark: "GC", domain: "generalcatalyst.com" },
];

const fourthRowCompanies: readonly CompanyEntry[] = [
  { name: "Blackstone", mark: "BX", domain: "blackstone.com" },
  { name: "Founders Fund", mark: "FD", domain: "foundersfund.com" },
  { name: "Two Sigma", mark: "2S", domain: "twosigma.com" },
  { name: "Latham & Watkins", mark: "LW", domain: "lw.com" },
  { name: "Anthropic", mark: "AN", domain: "anthropic.com" },
  { name: "Greylock", mark: "GL", domain: "greylock.com" },
  { name: "Bridgewater", mark: "BW", domain: "bridgewater.com" },
  { name: "Insight Partners", mark: "IP", domain: "insightpartners.com" },
  { name: "Norton Rose Fulbright", mark: "NR", domain: "nortonrosefulbright.com" },
];

/** Four right-to-left rows; varied speeds + start offsets keep them from marching in lockstep. */
const marqueeRows: readonly {
  companies: readonly CompanyEntry[];
  copyKey: string;
  durationClassName: string;
  offset: string;
}[] = [
  { companies: topRowCompanies, copyKey: "trusted-row-1", durationClassName: "[animation-duration:74s]", offset: "" },
  { companies: bottomRowCompanies, copyKey: "trusted-row-2", durationClassName: "[animation-duration:88s]", offset: "-translate-x-10" },
  { companies: thirdRowCompanies, copyKey: "trusted-row-3", durationClassName: "[animation-duration:100s]", offset: "-translate-x-20" },
  { companies: fourthRowCompanies, copyKey: "trusted-row-4", durationClassName: "[animation-duration:112s]", offset: "-translate-x-6" },
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
          Operators, funds, finance teams, and law firms across the leadership searches we are working on
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

        {marqueeRows.map((row, i) => (
          <div
            key={row.copyKey}
            className={`${i > 0 ? "mt-4" : ""} transition-all duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${revealed}`}
            style={{ transitionDelay: `${75 + i * 90}ms` }}
          >
            <div className={`relative flex overflow-hidden ${marqueeMaskClass}`}>
              <MarqueeTrack
                companies={row.companies}
                copyKey={row.copyKey}
                reverse={false}
                durationClassName={row.durationClassName}
                active={marqueeActive}
                className={row.offset}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
