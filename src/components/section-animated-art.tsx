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
          <rect x="24" y="28" width="96" height="64" rx="10" stroke={stroke} strokeWidth="1.2" opacity={0.98} />
          <path d="M36 44h72M36 56h56M36 68h64" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity={0.88} />
          <path
            d="M128 52h48"
            stroke={stroke}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="5 7"
            opacity={0.92}
          >
            <MotionDash active={animate} dur="2.2s" />
          </path>
          <circle cx="148" cy="72" r="16" stroke={stroke} strokeWidth="1.05" opacity={0.72} />
          <path d="M148 60v24M136 72h24" stroke={stroke} strokeWidth="0.95" strokeLinecap="round" opacity={0.8} />
          <circle cx="44" cy="88" r="4" fill="currentColor" className="text-accent/78 dark:text-accent/65" opacity={0.95}>
            <MotionPulse active={animate} begin="0s" />
          </circle>
          <circle cx="72" cy="82" r="3.5" fill="currentColor" className="text-accent/74 dark:text-accent/58" opacity={0.95}>
            <MotionPulse active={animate} begin="0.4s" />
          </circle>
          <circle cx="100" cy="90" r="3.5" fill="currentColor" className="text-accent/76 dark:text-accent/60" opacity={0.95}>
            <MotionPulse active={animate} begin="0.8s" />
          </circle>
          <path d="M48 88l20-6 28 8 44-10" stroke={stroke} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity={0.62}>
            <MotionDash active={animate} dur="3.4s" />
          </path>
        </>
      )}

      {variant === "legal" && (
        <>
          <path d="M100 22 L124 38 V96 H76 V38 Z" stroke={stroke} strokeWidth="1.12" strokeLinejoin="round" opacity={0.78} />
          <path d="M88 96V52M100 96V44M112 96V52" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity={0.95} />
          <path
            d="M28 104h144"
            stroke={stroke}
            strokeWidth="1.12"
            strokeLinecap="round"
            strokeDasharray="6 8"
            opacity={0.88}
          >
            <MotionDash active={animate} dur="3.2s" />
          </path>
          <rect x="34" y="62" width="28" height="36" rx="4" stroke={stroke} strokeWidth="1" opacity={0.72} />
          <rect x="138" y="62" width="28" height="36" rx="4" stroke={stroke} strokeWidth="1" opacity={0.72} />
          <path d="M48 70h12M48 78h16M48 86h10M152 70h14M152 78h12M152 86h14" stroke={stroke} strokeWidth="0.85" strokeLinecap="round" opacity={0.62} />
        </>
      )}

      {variant === "finance" && (
        <>
          <path d="M32 88h136" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity={0.68}>
            <MotionDash active={animate} dur="3s" />
          </path>
          <g stroke={stroke} strokeLinecap="round" strokeWidth="1.08" opacity={0.92}>
            <rect x="44" y="56" width="14" height="32" rx="3" fill="currentColor" className="text-accent/34 dark:text-accent/28" stroke={stroke}>
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
            <rect x="74" y="44" width="14" height="44" rx="3" fill="currentColor" className="text-accent/30 dark:text-accent/24" stroke={stroke}>
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
            <rect x="104" y="50" width="14" height="38" rx="3" fill="currentColor" className="text-accent/32 dark:text-accent/26" stroke={stroke}>
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
            <rect x="134" y="36" width="14" height="52" rx="3" fill="currentColor" className="text-accent/34 dark:text-accent/30" stroke={stroke}>
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
            d="M38 78c18-12 38-8 58 4s40 10 62-8"
            stroke={stroke}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 6"
            opacity={0.88}
            className="text-success/72 dark:text-success/48"
          >
            <MotionDash active={animate} dur="2.5s" />
          </path>
          <text
            x="36"
            y="28"
            style={{ font: "600 6px var(--font-sans-jakarta), system-ui, sans-serif", fill: "currentColor", opacity: 0.55 }}
          >
            IB · Risk · Corporate finance
          </text>
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
          <circle cx="52" cy="44" r="5" stroke={stroke} strokeWidth="1.1" opacity={0.95}>
            <MotionPulse active={animate} />
          </circle>
          <circle cx="100" cy="32" r="5" stroke={stroke} strokeWidth="1.1" opacity={0.95}>
            <MotionPulse active={animate} begin="0.5s" />
          </circle>
          <circle cx="148" cy="44" r="5" stroke={stroke} strokeWidth="1.1" opacity={0.95}>
            <MotionPulse active={animate} begin="1s" />
          </circle>
          <circle cx="76" cy="78" r="5" stroke={stroke} strokeWidth="1.1" opacity={0.95}>
            <MotionPulse active={animate} begin="0.25s" />
          </circle>
          <circle cx="124" cy="78" r="5" stroke={stroke} strokeWidth="1.1" opacity={0.95}>
            <MotionPulse active={animate} begin="0.75s" />
          </circle>
          <path
            d="M56 44 L96 36 M104 36 L144 44 M58 48 L72 74 M128 48 L120 74 M80 78 L116 78 M100 38 L100 70"
            stroke={stroke}
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.78}
            strokeDasharray="4 5"
          >
            <MotionDash active={animate} dur="3.4s" />
          </path>
          <path d="M40 96h120" stroke={stroke} strokeWidth="0.9" strokeLinecap="round" opacity={0.58}>
            <MotionDash active={animate} dur="4.2s" />
          </path>
          <text
            x="42"
            y="110"
            style={{ font: "600 5.5px var(--font-sans-jakarta), system-ui, sans-serif", fill: "currentColor", opacity: 0.52 }}
          >
            Sector maps · mandate depth
          </text>
        </>
      )}

      {variant === "global" && (
        <>
          <circle cx="100" cy="58" r="36" stroke={stroke} strokeWidth="1.12" opacity={0.78}>
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
              <ellipse cx="0" cy="0" rx="36" ry="14" stroke={stroke} strokeWidth="1" opacity={0.68} strokeDasharray="3 5">
                <MotionDash active={animate} dur="2.6s" />
              </ellipse>
            </g>
          </g>
          <circle cx="72" cy="52" r="3" fill="currentColor" className="text-accent/78 dark:text-accent/65" opacity={0.95}>
            <MotionPulse active={animate} begin="0s" />
          </circle>
          <circle cx="100" cy="40" r="3" fill="currentColor" className="text-accent/76 dark:text-accent/62" opacity={0.95}>
            <MotionPulse active={animate} begin="0.3s" />
          </circle>
          <circle cx="128" cy="52" r="3" fill="currentColor" className="text-accent/78 dark:text-accent/65" opacity={0.95}>
            <MotionPulse active={animate} begin="0.6s" />
          </circle>
          <circle cx="118" cy="72" r="3" fill="currentColor" className="text-accent/72 dark:text-accent/58" opacity={0.95}>
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
          <text
            x="54"
            y="104"
            style={{ font: "600 5.5px var(--font-sans-jakarta), system-ui, sans-serif", fill: "currentColor", opacity: 0.52 }}
          >
            US · UK · EU · UAE · Asia
          </text>
        </>
      )}

      {variant === "relationship" && (
        <>
          <g stroke={stroke} strokeWidth="1.05" opacity={0.92}>
            <circle cx="64" cy="48" r="12" />
            <path d="M52 60c0 8 6 14 12 14s12-6 12-14" strokeLinecap="round" />
            <circle cx="136" cy="48" r="12" />
            <path d="M124 60c0 8 6 14 12 14s12-6 12-14" strokeLinecap="round" />
          </g>
          <path
            d="M76 52 Q100 72 124 52"
            stroke={stroke}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity={0.78}
            strokeDasharray="3 5"
          >
            <MotionDash active={animate} dur="2.4s" />
          </path>
          <circle cx="100" cy="62" r="4" fill="currentColor" className="text-accent/76 dark:text-accent/58" opacity={0.95}>
            <MotionPulse active={animate} begin="0.2s" />
          </circle>
          <text
            x="58"
            y="96"
            style={{ font: "600 5.5px var(--font-sans-jakarta), system-ui, sans-serif", fill: "currentColor", opacity: 0.52 }}
          >
            Consultation · partnership
          </text>
        </>
      )}

      {variant === "ethics" && (
        <>
          <g stroke={stroke} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity={0.9}>
            <path d="M100 22 L124 40 V64 Q100 92 76 64 V40 Z" />
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
              <line x1="-32" y1="0" x2="32" y2="0" stroke={stroke} strokeWidth="1.05" strokeLinecap="round" opacity={0.82} />
              <line x1="-22" y1="0" x2="-22" y2="18" stroke={stroke} strokeWidth="1" opacity={0.75} />
              <line x1="22" y1="0" x2="22" y2="18" stroke={stroke} strokeWidth="1" opacity={0.75} />
              <ellipse cx="-22" cy="26" rx="16" ry="5" stroke={stroke} strokeWidth="0.95" opacity={0.8} />
              <ellipse cx="22" cy="26" rx="16" ry="5" stroke={stroke} strokeWidth="0.95" opacity={0.8} />
            </g>
          </g>
          <path
            d="M32 96h136"
            stroke={stroke}
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeDasharray="5 7"
            opacity={0.65}
          >
            <MotionDash active={animate} dur="3s" />
          </path>
          <text
            x="40"
            y="112"
            style={{ font: "600 5px var(--font-sans-jakarta), system-ui, sans-serif", fill: "currentColor", opacity: 0.52 }}
          >
            Confidentiality · fair · inclusive
          </text>
        </>
      )}
    </svg>
  );
}
