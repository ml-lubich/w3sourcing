import {
  BrainCircuit,
  BriefcaseBusiness,
  ChartColumnBig,
  Code2,
  Compass,
  Crown,
  FlaskConical,
  Handshake,
  Landmark,
  LifeBuoy,
  Megaphone,
  Palette,
  Scale,
  ShieldCheck,
  UsersRound,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { roleIconKey, type RoleIconKey, type RoleIconSource } from "@/lib/role-icon";

/** One glyph per discipline; see `src/lib/role-icon.ts` for how a role picks one. */
const ICONS: Record<RoleIconKey, LucideIcon> = {
  executive: Crown,
  legal: Scale,
  security: ShieldCheck,
  data: ChartColumnBig,
  research: FlaskConical,
  ai: BrainCircuit,
  design: Palette,
  product: Compass,
  support: LifeBuoy,
  engineering: Code2,
  sales: Handshake,
  marketing: Megaphone,
  finance: Landmark,
  people: UsersRound,
  operations: Workflow,
  role: BriefcaseBusiness,
};

export function RoleIcon({
  job,
  className,
  strokeWidth = 1.8,
}: {
  job: RoleIconSource;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[roleIconKey(job)];
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
