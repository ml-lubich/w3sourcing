import Image from "next/image";

const PERRY_LINKEDIN = "https://www.linkedin.com/in/perrybarrow/";

/**
 * Server component: keeps leadership copy in RSC output so SSR and hydration
 * always share one source of truth (avoids client-only bundle drift in dev).
 */
export function FounderSpotlightCard() {
  return (
    <div
      className="flex flex-col items-center gap-8 p-6 sm:p-8 md:flex-row md:items-start md:gap-10"
      suppressHydrationWarning
    >
      {/*
        Isolation keeps the portrait above .glass-panel::before (mix-blend) in all engines.
        priority + fill: avoids lazy/decoding never firing when the parent was opacity-0 briefly.
      */}
      <div className="relative z-[2] isolate shrink-0 md:mx-0">
        <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border border-slate-200/80 bg-surface shadow-[0_8px_24px_rgb(15_23_42_/_0.12)] dark:border-white/15 dark:shadow-[0_8px_24px_rgb(0_0_0_/_0.35)] sm:h-40 sm:w-40">
          <Image
            src="/images/perry-barrow.webp"
            alt="Perry Barrow, Founder and Managing Director of W3 Sourcing"
            fill
            sizes="(min-width: 768px) 160px, 144px"
            className="object-cover object-top"
            priority
          />
        </div>
      </div>
      <div className="min-w-0 flex-1 text-left">
        <h3 className="text-xl font-bold tracking-tight text-primary dark:text-white sm:text-2xl">
          Perry Barrow
        </h3>
        <p className="mt-1 text-sm font-semibold text-accent sm:text-[15px]">
          Founder & Managing Director, W3 Sourcing
        </p>
        <p
          className="mt-4 text-sm leading-relaxed text-text-secondary dark:text-slate-400 sm:text-[15px]"
          suppressHydrationWarning
        >
          {`Perry leads executive search for technology (including AI and engineering), legal, and banking & finance across San Francisco, New York, London, Singapore, and wider US, UK, EU, UAE, and Asia—pairing a VC-backed sourcing stack with partner-level judgment and discretion. He founded `}
          <span className="font-medium text-primary dark:text-slate-200">First Global Direct Consultancy</span>
          {` for businesses preparing for investment or exit, is an early investor in `}
          <span className="font-medium text-primary dark:text-slate-200">BrightCrew</span>
          {`, and serves on the boards of the `}
          <span className="font-medium text-primary dark:text-slate-200">Asia CEO Community</span>
          {` and `}
          <span className="font-medium text-primary dark:text-slate-200">Global CEO Community</span>
          {`. He remains active as an angel investor in B2B AI and related sectors. Outside work he trains for running, Spartan and OCR events, dragon boat, and outrigger canoe racing.`}
        </p>
        <p className="mt-5">
          <a
            href={PERRY_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
          >
            View on LinkedIn →
          </a>
        </p>
      </div>
    </div>
  );
}
