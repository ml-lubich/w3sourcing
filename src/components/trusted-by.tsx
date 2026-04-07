"use client";

import { useRef, useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Coins,
  Landmark,
  LineChart,
  Rocket,
  Scale,
  TrendingUp,
  Wallet,
} from "lucide-react";

type CompanyEntry = {
  name: string;
  Icon: LucideIcon;
};

const companies: CompanyEntry[] = [
  { name: "Goldman Sachs", Icon: Landmark },
  { name: "Sequoia Capital", Icon: TrendingUp },
  { name: "Andreessen Horowitz", Icon: Rocket },
  { name: "Clifford Chance", Icon: Scale },
  { name: "Stripe", Icon: Wallet },
  { name: "Linklaters", Icon: Scale },
  { name: "Morgan Stanley", Icon: Landmark },
  { name: "Y Combinator", Icon: Rocket },
  { name: "Allen & Overy", Icon: Scale },
  { name: "Revolut", Icon: Wallet },
  { name: "JP Morgan", Icon: Landmark },
  { name: "Freshfields", Icon: Scale },
  { name: "Accel Partners", Icon: TrendingUp },
  { name: "Coinbase", Icon: Coins },
  { name: "Slaughter and May", Icon: Scale },
  { name: "Tiger Global", Icon: LineChart },
];

/**
 * Long soft ramp at edges (2026-style “infinite” strip): content dissolves into background.
 * Mask + matching scrims below so fade reads in WebKit and Chromium alike.
 */
/** Wide horizontal ramps + explicit size/repeat so fades stay smooth while scrolling (avoids tiled-mask glitches). */
const marqueeMaskClass =
  "[mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [mask-size:100%_100%] [-webkit-mask-size:100%_100%] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]";

/** Two-stop only: heavy `via-*` scrims read as a flat slab on the fixed liquid canvas. */
const edgeScrimClass = "from-background to-transparent";

function MarqueeItem({ name, Icon }: CompanyEntry) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 px-6 opacity-[0.56] transition-opacity duration-500 ease-out group-hover/trusted-marquee:opacity-[0.88] dark:opacity-[0.38] dark:group-hover/trusted-marquee:opacity-[0.82] sm:px-8 [@media(hover:none)]:opacity-[0.6] dark:[@media(hover:none)]:opacity-[0.44]">
      <Icon
        className="size-3 shrink-0 text-text-secondary sm:size-3.5 dark:text-muted"
        strokeWidth={1.15}
        aria-hidden
      />
      <span className="text-[0.8125rem] font-normal tracking-wide text-text-secondary sm:text-sm dark:text-muted">
        {name}
      </span>
    </span>
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
      className="group/trusted-marquee relative isolate overflow-hidden bg-transparent py-12 md:py-16"
      aria-label="Organizations that trust this firm"
    >
      <div
        className={`relative z-[1] mb-8 md:mb-10 text-center transition-all duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${revealed}`}
      >
        <span className="inline-block max-w-[min(40rem,92vw)] text-balance text-[0.6875rem] font-semibold uppercase leading-relaxed tracking-[0.16em] text-muted/72 sm:text-xs dark:text-muted/42">
          Trusted where leadership hires need judgment, not autopilot
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
            <div
              className={`animate-marquee flex shrink-0 items-center ${marqueeActive ? "" : "marquee-paused"}`}
              style={{ animationDuration: "78s" }}
            >
              {companies.map((c, i) => (
                <MarqueeItem key={`r1-a-${i}`} {...c} />
              ))}
              {companies.map((c, i) => (
                <MarqueeItem key={`r1-b-${i}`} {...c} />
              ))}
            </div>
          </div>
        </div>

        <div
          className={`transition-all delay-200 duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${revealed}`}
        >
          <div className={`relative flex overflow-hidden ${marqueeMaskClass}`}>
            <div
              className={`animate-marquee flex shrink-0 items-center ${marqueeActive ? "" : "marquee-paused"}`}
              style={{ animationDirection: "reverse", animationDuration: "96s" }}
            >
              {[...companies].reverse().map((c, i) => (
                <MarqueeItem key={`r2-a-${i}`} {...c} />
              ))}
              {[...companies].reverse().map((c, i) => (
                <MarqueeItem key={`r2-b-${i}`} {...c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
