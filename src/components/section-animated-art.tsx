"use client";

/**
 * Decorative inline SVGs for practice-area and why-W3 card headers.
 * SMIL animations render only when `animate` is true (viewport + !prefers-reduced-motion).
 */

type PracticeVariant = "tech" | "legal" | "finance";
type WhyVariant = "expertise" | "global" | "relationship" | "ethics";

export function MotionPulse({ active, begin = "0s" }: { active: boolean; begin?: string }) {
  if (!active) return null;
  return (
    <animate
      attributeName="opacity"
      values="0.58;1;0.58"
      dur="2.05s"
      begin={begin}
      repeatCount="indefinite"
    />
  );
}

export function MotionDash({ active, dur = "2.8s" }: { active: boolean; dur?: string }) {
  if (!active) return null;
  return (
    <animate
      attributeName="stroke-dashoffset"
      values="0;24;0"
      dur={dur}
      repeatCount="indefinite"
    />
  );
}

export function sectionDecoSvgClassName(animate: boolean, className?: string): string {
  return [
    "section-deco-art-svg pointer-events-none absolute inset-0 h-full w-full",
    animate ? "section-deco-art-svg--motion" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function PracticeAreaAnimatedArt({
  variant,
  idSuffix,
  animate,
  className,
}: {
  variant: PracticeVariant;
  idSuffix: string;
  animate: boolean;
  className?: string;
}) {
  const stroke = "currentColor";

  return (
    <svg
      className={sectionDecoSvgClassName(animate, className)}
      viewBox="0 0 200 120"
      fill="none"
      aria-hidden
      data-art-id={idSuffix}
    >
      {variant === "tech" && (
        <>
          <rect x="30" y="24" width="92" height="64" rx="12" fill="currentColor" className="text-accent/10 dark:text-accent/12" opacity={0.72} />
          <rect x="30" y="24" width="92" height="64" rx="12" stroke={stroke} strokeWidth="1.35" opacity={0.9} />
          <rect x="43" y="38" width="48" height="7" rx="3.5" fill="currentColor" className="text-accent/28 dark:text-accent/24" opacity={0.95} />
          <path d="M44 56h62M44 68h44M44 80h54" stroke={stroke} strokeWidth="1.15" strokeLinecap="round" opacity={0.76} />
          <path
            d="M118 48 C132 40 150 40 166 50"
            stroke={stroke}
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeDasharray="4 6"
            opacity={0.82}
          >
            <MotionDash active={animate} dur="2.6s" />
          </path>
          <circle cx="168" cy="52" r="13" fill="currentColor" className="text-accent/16 dark:text-accent/18" stroke={stroke} strokeWidth="1.25" opacity={0.95} />
          <path d="M168 44v16M160 52h16" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" opacity={0.88} />
          <circle cx="46" cy="94" r="4.5" fill="currentColor" className="text-accent/78 dark:text-accent/65" opacity={0.95}>
            <MotionPulse active={animate} begin="0s" />
          </circle>
          <circle cx="82" cy="100" r="4" fill="currentColor" className="text-accent/74 dark:text-accent/58" opacity={0.95}>
            <MotionPulse active={animate} begin="0.4s" />
          </circle>
          <circle cx="124" cy="92" r="4" fill="currentColor" className="text-accent/76 dark:text-accent/60" opacity={0.95}>
            <MotionPulse active={animate} begin="0.8s" />
          </circle>
          <path d="M50 94 C68 86 88 108 120 92 C138 84 150 82 164 86" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
            <MotionDash active={animate} dur="3.4s" />
          </path>
        </>
      )}

      {variant === "legal" && (
        <>
          <path d="M100 20 L132 38 V96 H68 V38 Z" fill="currentColor" className="text-accent/9 dark:text-accent/12" opacity={0.75} />
          <path d="M100 20 L132 38 V96 H68 V38 Z" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round" opacity={0.88} />
          <path d="M82 96V56M100 96V44M118 96V56" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity={0.92} />
          <path d="M76 50h48M76 96h48" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity={0.64} />
          <path
            d="M36 104h128"
            stroke={stroke}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeDasharray="6 9"
            opacity={0.7}
          >
            <MotionDash active={animate} dur="3.2s" />
          </path>
          <rect x="34" y="60" width="24" height="32" rx="6" fill="currentColor" className="text-accent/10 dark:text-accent/10" stroke={stroke} strokeWidth="1.05" opacity={0.72} />
          <rect x="142" y="60" width="24" height="32" rx="6" fill="currentColor" className="text-accent/10 dark:text-accent/10" stroke={stroke} strokeWidth="1.05" opacity={0.72} />
          <path d="M42 72h10M42 81h8M150 72h10M150 81h8" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity={0.6} />
          <circle cx="100" cy="34" r="3.5" fill="currentColor" className="text-accent/72 dark:text-accent/60" opacity={0.95}>
            <MotionPulse active={animate} begin="0.35s" />
          </circle>
        </>
      )}

      {variant === "finance" && (
        <>
          <rect x="32" y="28" width="136" height="64" rx="14" fill="currentColor" className="text-accent/7 dark:text-accent/10" opacity={0.72} />
          <path d="M40 86h120" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity={0.58}>
            <MotionDash active={animate} dur="3s" />
          </path>
          <g stroke={stroke} strokeLinecap="round" strokeWidth="1.18" opacity={0.92}>
            <rect x="50" y="60" width="16" height="26" rx="4" fill="currentColor" className="text-accent/34 dark:text-accent/28" stroke={stroke}>
              {animate ? (
                <animate
                  attributeName="opacity"
                  values="0.62;1;0.62"
                  dur="2.35s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              ) : null}
            </rect>
            <rect x="78" y="48" width="16" height="38" rx="4" fill="currentColor" className="text-accent/30 dark:text-accent/24" stroke={stroke}>
              {animate ? (
                <animate
                  attributeName="opacity"
                  values="0.62;1;0.62"
                  dur="2.35s"
                  begin="0.35s"
                  repeatCount="indefinite"
                />
              ) : null}
            </rect>
            <rect x="106" y="54" width="16" height="32" rx="4" fill="currentColor" className="text-accent/32 dark:text-accent/26" stroke={stroke}>
              {animate ? (
                <animate
                  attributeName="opacity"
                  values="0.62;1;0.62"
                  dur="2.35s"
                  begin="0.7s"
                  repeatCount="indefinite"
                />
              ) : null}
            </rect>
            <rect x="134" y="38" width="16" height="48" rx="4" fill="currentColor" className="text-accent/34 dark:text-accent/30" stroke={stroke}>
              {animate ? (
                <animate
                  attributeName="opacity"
                  values="0.62;1;0.62"
                  dur="2.35s"
                  begin="1.05s"
                  repeatCount="indefinite"
                />
              ) : null}
            </rect>
          </g>
          <path
            d="M44 72 C62 56 80 66 96 58 C118 46 134 50 154 38"
            stroke={stroke}
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.88}
            className="text-success/72 dark:text-success/48"
          >
            <MotionDash active={animate} dur="2.5s" />
          </path>
          <path d="M154 38l-14-1M154 38l-6 12" stroke={stroke} strokeWidth="1.45" strokeLinecap="round" opacity={0.86} />
        </>
      )}
    </svg>
  );
}

export function WhyW3AnimatedArt({
  variant,
  idSuffix,
  animate,
  className,
}: {
  variant: WhyVariant;
  idSuffix: string;
  animate: boolean;
  className?: string;
}) {
  const stroke = "currentColor";

  return (
    <svg
      className={sectionDecoSvgClassName(animate, className)}
      viewBox="0 0 200 120"
      fill="none"
      aria-hidden
      data-art-id={idSuffix}
    >
      {variant === "expertise" && (
        <>
          <path d="M52 82 C68 48 100 34 148 42" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeDasharray="5 7" opacity={0.58}>
            <MotionDash active={animate} dur="3.6s" />
          </path>
          <circle cx="58" cy="76" r="13" fill="currentColor" className="text-accent/10 dark:text-accent/12" stroke={stroke} strokeWidth="1.2" opacity={0.82} />
          <circle cx="100" cy="48" r="17" fill="currentColor" className="text-accent/12 dark:text-accent/14" stroke={stroke} strokeWidth="1.25" opacity={0.9} />
          <circle cx="150" cy="42" r="12" fill="currentColor" className="text-accent/10 dark:text-accent/12" stroke={stroke} strokeWidth="1.2" opacity={0.82} />
          <circle cx="58" cy="76" r="3.5" fill="currentColor" className="text-accent/76 dark:text-accent/64" opacity={0.95}>
            <MotionPulse active={animate} />
          </circle>
          <circle cx="100" cy="48" r="4.5" fill="currentColor" className="text-accent/80 dark:text-accent/66" opacity={0.95}>
            <MotionPulse active={animate} begin="0.5s" />
          </circle>
          <circle cx="150" cy="42" r="3.5" fill="currentColor" className="text-accent/76 dark:text-accent/64" opacity={0.95}>
            <MotionPulse active={animate} begin="1s" />
          </circle>
          <path d="M88 48h24M100 36v24M48 92h104" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" opacity={0.56} />
        </>
      )}

      {variant === "global" && (
        <>
          <circle cx="100" cy="58" r="34" fill="currentColor" className="text-accent/8 dark:text-accent/12" stroke={stroke} strokeWidth="1.28" opacity={0.84}>
            {animate ? (
              <animate attributeName="opacity" values="0.72;0.95;0.72" dur="3.2s" repeatCount="indefinite" />
            ) : null}
          </circle>
          <g transform="translate(100 58)">
            <g>
              {animate ? (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur="36s"
                  repeatCount="indefinite"
                />
              ) : null}
              <ellipse cx="0" cy="0" rx="42" ry="13" stroke={stroke} strokeWidth="1.1" opacity={0.66} strokeDasharray="4 7">
                <MotionDash active={animate} dur="2.6s" />
              </ellipse>
            </g>
          </g>
          <path d="M66 64 C82 48 106 72 134 48" stroke={stroke} strokeWidth="1.05" strokeLinecap="round" strokeDasharray="3 6" opacity={0.58}>
            <MotionDash active={animate} dur="3.1s" />
          </path>
          <circle cx="72" cy="52" r="3.5" fill="currentColor" className="text-accent/78 dark:text-accent/65" opacity={0.95}>
            <MotionPulse active={animate} begin="0s" />
          </circle>
          <circle cx="100" cy="40" r="3.5" fill="currentColor" className="text-accent/76 dark:text-accent/62" opacity={0.95}>
            <MotionPulse active={animate} begin="0.3s" />
          </circle>
          <circle cx="128" cy="52" r="3.5" fill="currentColor" className="text-accent/78 dark:text-accent/65" opacity={0.95}>
            <MotionPulse active={animate} begin="0.6s" />
          </circle>
          <circle cx="118" cy="72" r="3.5" fill="currentColor" className="text-accent/72 dark:text-accent/58" opacity={0.95}>
            <MotionPulse active={animate} begin="0.9s" />
          </circle>
          <path
            d="M52 88c16-8 80-8 96 0"
            stroke={stroke}
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="5 6"
            opacity={0.72}
          >
            <MotionDash active={animate} dur="2.8s" />
          </path>
        </>
      )}

      {variant === "relationship" && (
        <>
          <g stroke={stroke} strokeWidth="1.25" opacity={0.9}>
            <circle cx="66" cy="44" r="13" fill="currentColor" className="text-accent/8 dark:text-accent/10" />
            <path d="M52 64c2-10 8-15 14-15s12 5 14 15" strokeLinecap="round" />
            <circle cx="134" cy="44" r="13" fill="currentColor" className="text-accent/8 dark:text-accent/10" />
            <path d="M120 64c2-10 8-15 14-15s12 5 14 15" strokeLinecap="round" />
          </g>
          <path
            d="M80 58 C92 76 108 76 120 58"
            stroke={stroke}
            strokeWidth="1.55"
            strokeLinecap="round"
            fill="none"
            opacity={0.82}
            strokeDasharray="4 6"
          >
            <MotionDash active={animate} dur="2.4s" />
          </path>
          <rect x="86" y="74" width="28" height="9" rx="4.5" fill="currentColor" className="text-accent/24 dark:text-accent/18" opacity={0.9} />
          <path d="M84 84h32" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity={0.7} />
          <circle cx="100" cy="62" r="4.5" fill="currentColor" className="text-accent/76 dark:text-accent/58" opacity={0.95}>
            <MotionPulse active={animate} begin="0.2s" />
          </circle>
        </>
      )}

      {variant === "ethics" && (
        <>
          <g stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" opacity={0.9}>
            <path d="M100 20 L128 38 V62 Q100 92 72 62 V38 Z" fill="currentColor" className="text-accent/9 dark:text-accent/12" />
            <path d="M88 58l9 9 17-22" strokeWidth="1.65" opacity={0.92} />
          </g>
          <g transform="translate(100 54)">
            <g>
              {animate ? (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-2.5 0 0; 2.5 0 0; -2.5 0 0"
                  dur="5s"
                  repeatCount="indefinite"
                />
              ) : null}
              <line x1="-34" y1="14" x2="34" y2="14" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" opacity={0.66} />
              <line x1="-24" y1="14" x2="-24" y2="30" stroke={stroke} strokeWidth="1" opacity={0.62} />
              <line x1="24" y1="14" x2="24" y2="30" stroke={stroke} strokeWidth="1" opacity={0.62} />
              <ellipse cx="-24" cy="36" rx="15" ry="5" fill="currentColor" className="text-accent/8 dark:text-accent/10" stroke={stroke} strokeWidth="1" opacity={0.72} />
              <ellipse cx="24" cy="36" rx="15" ry="5" fill="currentColor" className="text-accent/8 dark:text-accent/10" stroke={stroke} strokeWidth="1" opacity={0.72} />
            </g>
          </g>
          <path
            d="M50 100h100"
            stroke={stroke}
            strokeWidth="1.05"
            strokeLinecap="round"
            strokeDasharray="5 7"
            opacity={0.5}
          >
            <MotionDash active={animate} dur="3s" />
          </path>
        </>
      )}
    </svg>
  );
}
