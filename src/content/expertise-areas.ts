/**
 * The competency and hire areas W3 Sourcing actively recruits across.
 * Derived from the live Paraform pipeline (roleGroup / sector taxonomy in
 * src/content/live-jobs.json) plus the practice areas and functions already
 * on the site. `expertiseClusters` powers the static mobile layout;
 * `expertiseAreas` is the flat list the desktop storm orbits.
 *
 * Signature capabilities (Market Mapping, Confidential Search, …) describe how
 * W3 works, not a vertical — kept as their own cluster so the map reads as
 * "areas we cover" + "how we cover them".
 */
export type ExpertiseCluster = {
  label: string;
  items: readonly string[];
};

export const expertiseClusters: readonly ExpertiseCluster[] = [
  {
    label: "Engineering",
    items: [
      "AI / Machine Learning",
      "Founding Engineers",
      "Full-Stack",
      "Backend & Infra",
      "Frontend & Mobile",
      "Data & Analytics",
      "Platform / SRE",
      "Security",
    ],
  },
  {
    label: "Product & Go-to-Market",
    items: [
      "Product Management",
      "Design & UX",
      "Sales Leadership",
      "Marketing & Growth",
      "Operations & Strategy",
    ],
  },
  {
    label: "Legal",
    items: [
      "Partners",
      "General Counsel",
      "Corporate & M&A",
      "Litigation",
      "Regulatory & Compliance",
      "IP & Tech Transactions",
    ],
  },
  {
    label: "Finance",
    items: [
      "Investment Banking",
      "Private Banking",
      "Markets & Trading",
      "Asset Management",
      "Venture Capital",
      "Private Equity",
      "Treasury & FP&A",
    ],
  },
  {
    label: "Leadership",
    items: ["Executive Search", "C-Suite", "Board & Advisory"],
  },
  {
    label: "How W3 Works",
    items: [
      "Market Mapping",
      "Confidential Search",
      "Talent Intelligence",
      "Retained Search",
      "Cross-Border Hiring",
      "AI-Assisted Sourcing",
      "Human-Led Judgment",
    ],
  },
] as const;

/** Flat, de-duplicated list the desktop storm places on its rings. */
export const expertiseAreas: readonly string[] = Array.from(
  new Set(expertiseClusters.flatMap((c) => c.items)),
);
