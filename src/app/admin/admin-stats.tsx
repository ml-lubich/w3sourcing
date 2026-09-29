"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Flame, Globe2, Layers, Sparkles, TrendingUp } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import {
  postedByMonth,
  rankedChartHeight,
  summarise,
  tallyBy,
  tallyLocations,
  truncateAxisLabel,
  type Tally,
} from "@/lib/job-stats";
import type { YAxisTickContentProps } from "recharts";
import type { JobRow } from "@/lib/jobs-store";

/**
 * Every chart here answers a magnitude question ("how many roles in X"), so
 * each is a single series in one hue rather than a categorical palette — no
 * colour carries identity, and there is nothing for a colour-blind reader to
 * tell apart. Hue and ink come from the site's theme tokens so the dashboard
 * follows the light/dark toggle instead of hard-coding a surface.
 */
function useChartInk() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    isDark,
    accent: isDark ? "#38bdf8" : "#2563eb",
    accentSoft: isDark ? "rgba(56,189,248,0.22)" : "rgba(37,99,235,0.16)",
    grid: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)",
    ink: isDark ? "#94a3b8" : "#64748b",
    surface: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.1)",
    text: isDark ? "#e2e8f0" : "#0f172a",
  };
}

function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {icon}
        {label}
      </div>
      <p className="relative mt-2 text-3xl font-extrabold tabular-nums tracking-tight text-primary">
        {value.toLocaleString()}
      </p>
      {hint ? <p className="relative mt-1 text-xs text-text-secondary">{hint}</p> : null}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  chartHeight = 256,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  chartHeight?: number;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="relative">
        <h3 className="text-sm font-bold text-primary">{title}</h3>
        <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>
        <div className="mt-4 w-full" style={{ height: chartHeight }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function tooltipStyle(ink: ReturnType<typeof useChartInk>) {
  return {
    contentStyle: {
      background: ink.surface,
      border: `1px solid ${ink.border}`,
      borderRadius: 12,
      fontSize: 12,
      color: ink.text,
      boxShadow: "0 12px 40px rgb(0 0 0 / 0.18)",
    },
    labelStyle: { color: ink.text, fontWeight: 600 },
    itemStyle: { color: ink.ink },
    cursor: { fill: ink.accentSoft },
  };
}

/** Fits one 11px line inside the category axis without wrapping into the next row. */
const AXIS_LABEL_CHARS = 26;
const AXIS_WIDTH = 168;

function CategoryTick({ x, y, payload, fill }: YAxisTickContentProps & { fill: string }) {
  const full = String(payload?.value ?? "");
  const label = truncateAxisLabel(full, AXIS_LABEL_CHARS);
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill={fill} fontSize={11}>
      {label}
      {label === full ? null : <title>{full}</title>}
    </text>
  );
}

/** Horizontal bars: category names are long, and reading down a column is easier. */
function RankedBars({ data, ink }: { data: Tally[]; ink: ReturnType<typeof useChartInk> }) {
  const tooltip = tooltipStyle(ink);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid horizontal={false} stroke={ink.grid} />
        <XAxis type="number" stroke={ink.ink} fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          stroke={ink.ink}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={AXIS_WIDTH}
          interval={0}
          tick={(props: YAxisTickContentProps) => <CategoryTick {...props} fill={ink.ink} />}
        />
        <Tooltip {...tooltip} />
        <Bar dataKey="count" name="Roles" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={ink.accent} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AdminStats({ jobs }: { jobs: JobRow[] }) {
  const ink = useChartInk();
  const summary = useMemo(() => summarise(jobs), [jobs]);
  const byRoleGroup = useMemo(() => tallyBy(jobs, "roleGroup"), [jobs]);
  const bySector = useMemo(() => tallyBy(jobs, "sector"), [jobs]);
  const byLocation = useMemo(() => tallyLocations(jobs), [jobs]);
  const byMonth = useMemo(() => postedByMonth(jobs), [jobs]);
  const tooltip = tooltipStyle(ink);

  return (
    <section className="mt-6" aria-label="Board statistics">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={<Layers className="size-3.5 text-accent" aria-hidden />}
          label="Live roles"
          value={summary.total}
        />
        <StatTile
          icon={<Flame className="size-3.5 text-orange-500" aria-hidden />}
          label="Hot roles"
          value={summary.hot}
          hint="Badged and pinned to the top of the board"
        />
        <StatTile
          icon={<TrendingUp className="size-3.5 text-accent" aria-hidden />}
          label="Posted in 30 days"
          value={summary.addedLast30}
        />
        <StatTile
          icon={<Globe2 className="size-3.5 text-accent" aria-hidden />}
          label="Cities covered"
          value={summary.locations}
          hint={`Across ${summary.sectors} sectors`}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard title="Roles posted per month" subtitle="Trailing twelve months">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={byMonth} margin={{ top: 8, right: 12, bottom: 4, left: -18 }}>
              <defs>
                <linearGradient id="w3-posted-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ink.accent} stopOpacity={0.34} />
                  <stop offset="100%" stopColor={ink.accent} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={ink.grid} />
              <XAxis dataKey="label" stroke={ink.ink} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={ink.ink} fontSize={11} tickLine={false} axisLine={false} width={44} />
              <Tooltip {...tooltip} cursor={{ stroke: ink.accent, strokeOpacity: 0.35 }} />
              <Area
                type="monotone"
                dataKey="count"
                name="Roles"
                stroke={ink.accent}
                strokeWidth={2}
                fill="url(#w3-posted-fill)"
                activeDot={{ r: 4, strokeWidth: 2, stroke: ink.surface }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Roles by group"
          subtitle="Largest disciplines on the board"
          chartHeight={rankedChartHeight(byRoleGroup.length)}
        >
          <RankedBars data={byRoleGroup} ink={ink} />
        </ChartCard>

        <ChartCard
          title="Roles by sector"
          subtitle="Where the mandates sit"
          chartHeight={rankedChartHeight(bySector.length)}
        >
          <RankedBars data={bySector} ink={ink} />
        </ChartCard>

        <ChartCard
          title="Top locations"
          subtitle="A role counts once per city it lists"
          chartHeight={rankedChartHeight(byLocation.length)}
        >
          <RankedBars data={byLocation} ink={ink} />
        </ChartCard>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary">
        <Sparkles className="size-3.5 text-accent" aria-hidden />
        Figures update the moment you add, edit, or remove a role.
      </p>
    </section>
  );
}
