"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";

import { SplitWords } from "@/components/split-words";
import { areaCluster, expertiseAreas, expertiseClusters } from "@/content/expertise-areas";
import { useHydrationSafeReducedMotion } from "@/lib/use-hydration-safe-reduced-motion";
import { useSplitWordsAnimate } from "@/lib/use-split-words-animate";

/**
 * ─── Expertise Storm ──────────────────────────────────────────────────
 * A floating knowledge-map of the areas W3 recruits across. On desktop
 * (lg+) it's a 3D carousel: every area is a glass pill riding a tilted,
 * near-edge-on ring. One shared angle (`--storm-angle`) drives the whole
 * field via CSS trig — cos() sweeps a pill across the page, sin() carries
 * it INTO the page (far: smaller, dimmer, behind the title) and back OUT
 * toward the viewer (near: bigger, brighter, in front). Pills only
 * translate — never turn — so labels stay upright.
 *
 * Grab-and-spin: a pointer drag revolves the field and the release keeps
 * the fling velocity, decaying by friction toward a gentle idle drift.
 * Hovering a pill pauses the drift; `prefers-reduced-motion` drops it.
 * One rAF loop writes a single CSS variable per frame (transform-only, no
 * layout) and is cancelled on unmount.
 *
 * Below lg the storm never mounts (matchMedia gate) — mobile renders a
 * static clustered grid instead and pays zero animation cost.
 */

const DESKTOP_MEDIA = "(min-width: 1024px)";

/* Keep RING_SQUASH in sync with the 0.1px wobble factor on
   .expertise-orbit-item in globals.css. */
const RING_SQUASH = 0.1;
const PILL_SPACING = 104; // px of perimeter budgeted per pill → ring capacity

/** Idle drift, drag feel, and how a fling bleeds off. */
const IDLE_DRIFT = 0.028; // deg/frame gentle churn when untouched
const DRAG_SENSITIVITY = 0.3; // deg of spin per px of horizontal drag
const FLING_FRICTION = 0.95; // per-frame decay of fling velocity toward idle
const DRAG_THRESHOLD = 6; // px moved before a press counts as a drag

interface RingSpec {
  /** Horizontal radius in px. */
  rx: number;
  /** Depth cue: outer rings sit slightly smaller. */
  scale: number;
  /** Vertical tier (px from centre) — spreads the edge-on rings into bands. */
  y: number;
}

/* Radii sized so the widest pill on the outer ring stays inside the storm's
   masked border box. --storm-k in globals.css shrinks the field further on
   narrower screens. Tiers alternate above/below the centre title, and none of
   them enters the TITLE_BAND — pills used to sweep straight through "The W3
   map" and neither the pill nor the title could be read. */
const RINGS: readonly RingSpec[] = [
  { rx: 235, scale: 1.0, y: -112 },
  { rx: 300, scale: 0.97, y: 116 },
  { rx: 372, scale: 0.94, y: -174 },
  { rx: 440, scale: 0.9, y: 180 },
  { rx: 500, scale: 0.86, y: -236 },
  { rx: 552, scale: 0.82, y: 240 },
];

/** Particle-cloud scatter: each pill drifts off its tier by a stable ±px. */
const SCATTER_Y = 46;
/** Half-height (px) of the centre title's keep-out zone. */
const TITLE_BAND = 92;

/** Ramanujan ellipse-perimeter approximation → how many pills a ring fits. */
function ringCapacity(rx: number): number {
  const a = rx;
  const b = rx * RING_SQUASH;
  const h = ((a - b) * (a - b)) / ((a + b) * (a + b));
  const perim = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  return Math.max(3, Math.floor(perim / PILL_SPACING));
}

/** Stable per-index jitter in [-0.5, 0.5] from a hash — deterministic, SSR-safe. */
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x) - 0.5;
}

interface PlacedPill {
  name: string;
  ring: RingSpec;
  /** Starting angle (deg) along the ring; --storm-angle advances it. */
  phase: number;
  /** Static vertical offset (px): ring tier + per-pill cloud scatter. */
  offsetY: number;
}

/** Mirror an offset out of the centre band, keeping its distance from the edge. */
export function keepOutOfTitleBand(offsetY: number, tierY: number): number {
  if (Math.abs(offsetY) >= TITLE_BAND) return offsetY;
  const direction = tierY < 0 ? -1 : 1;
  return direction * (TITLE_BAND + (TITLE_BAND - Math.abs(offsetY)));
}

function buildLayout(areas: readonly string[]): PlacedPill[] {
  // Fill rings inner→outer up to capacity; any overflow lands on the outer ring.
  const buckets: string[][] = RINGS.map(() => []);
  let cursor = 0;
  for (let r = 0; r < RINGS.length; r++) {
    const cap = r === RINGS.length - 1 ? Infinity : ringCapacity(RINGS[r].rx);
    while (buckets[r].length < cap && cursor < areas.length) {
      buckets[r].push(areas[cursor++]);
    }
    if (cursor >= areas.length) break;
  }

  const placed: PlacedPill[] = [];
  buckets.forEach((names, r) => {
    const ring = RINGS[r];
    const n = names.length;
    names.forEach((name, i) => {
      const seed = r * 97 + i * 13 + 1;
      // Even spread + gentle jitter so it churns like weather, not a clock face.
      const angle =
        (i / n) * Math.PI * 2 + r * 0.618 + jitter(seed) * (Math.PI / n) * 0.9;
      const offsetY = ring.y + jitter(seed * 3 + 7) * SCATTER_Y;
      placed.push({
        name,
        ring,
        phase: (angle * 180) / Math.PI,
        // Scatter must never push a pill into the title's keep-out band. Any
        // that lands inside is REFLECTED back out rather than clamped to the
        // band edge — clamping parked a whole tier on one line, and pills that
        // share a baseline overlap each other on the way past.
        offsetY: keepOutOfTitleBand(offsetY, ring.y),
      });
    });
  });
  return placed;
}

/** Client-side desktop gate: false on the server and first paint, so SSR and
 *  hydration both render the static grid; the storm mounts only after this
 *  flips true on lg+ viewports. */
function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MEDIA);
    const sync = (): void => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop;
}

/** An opened pill: which area, and where its pill sat when it was clicked. */
type OpenArea = { name: string; x: number; y: number };

const PANEL_WIDTH = 300;

/**
 * The panel that flips out of a clicked pill. It is anchored to the pill's
 * position at the moment of the click and the field is frozen while it is
 * open, so it stays attached without a per-frame position update.
 */
function AreaPanel({
  area,
  bounds,
  onPick,
  onClose,
}: {
  area: OpenArea;
  bounds: { width: number; height: number };
  onPick: (name: string) => void;
  onClose: () => void;
}) {
  const cluster = areaCluster.get(area.name);
  const siblings = (cluster?.items ?? []).filter((item) => item !== area.name).slice(0, 6);

  // Flip out toward whichever side has room, and keep the whole card on screen.
  const toLeft = area.x > bounds.width - PANEL_WIDTH - 24;
  const left = Math.min(Math.max(12, toLeft ? area.x - PANEL_WIDTH : area.x), bounds.width - PANEL_WIDTH - 12);
  const top = Math.min(Math.max(12, area.y + 18), bounds.height - 240);

  return (
    <div
      role="dialog"
      aria-label={`${area.name} — where it sits in the W3 map`}
      className="expertise-panel absolute z-40 rounded-2xl p-5"
      style={{ left, top, width: PANEL_WIDTH, transformOrigin: toLeft ? "right top" : "left top" }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          {cluster ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              {cluster.label}
            </p>
          ) : null}
          <p className="mt-1 text-base font-bold leading-snug text-primary">{area.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="glass-chip grid size-7 shrink-0 place-items-center rounded-lg text-text-secondary transition-colors hover:text-accent"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>

      {siblings.length > 0 ? (
        <>
          <p className="relative mt-4 text-[11px] font-medium text-muted">Also in this practice</p>
          <div className="relative mt-2 flex flex-wrap gap-1.5">
            {siblings.map((sibling) => (
              <button
                key={sibling}
                type="button"
                onClick={() => onPick(sibling)}
                className="glass-chip rounded-full px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:text-accent"
              >
                {sibling}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <a
        href="/jobs"
        className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-opacity hover:opacity-80"
      >
        See live roles
        <ArrowRight className="size-3.5" aria-hidden />
      </a>
    </div>
  );
}

function StormField() {
  const pills = useMemo(() => buildLayout(expertiseAreas), []);
  const reduceMotion = useHydrationSafeReducedMotion();
  const [open, setOpen] = useState<OpenArea | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0); // deg/frame fling velocity, decays to idle
  const draggingRef = useRef(false);
  const pausedRef = useRef(false); // hover-to-read pause
  const lastXRef = useRef(0);
  const movedRef = useRef(0);
  const dirRef = useRef(1); // last spin direction: idle drift follows it
  const reduceRef = useRef(reduceMotion);
  // Keep the loop's view of reduced-motion fresh without restarting the rAF.
  useEffect(() => {
    reduceRef.current = reduceMotion;
  }, [reduceMotion]);

  // Single rAF loop, gated by visibility: apply velocity, decay it toward idle,
  // write one CSS var. Per repo convention (why-w3, stats, …) the loop is
  // stopped whenever the storm is scrolled out of view so it never drives
  // compositor work offscreen; it restarts on re-entry.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let running = false;
    const tick = (): void => {
      if (!draggingRef.current) {
        const idle = reduceRef.current ? 0 : IDLE_DRIFT * dirRef.current;
        velocityRef.current = idle + (velocityRef.current - idle) * FLING_FRICTION;
        if (!pausedRef.current) angleRef.current += velocityRef.current;
      }
      sceneRef.current?.style.setProperty("--storm-angle", `${angleRef.current}deg`);
      raf = requestAnimationFrame(tick);
    };
    const start = (): void => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = (): void => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    if (typeof IntersectionObserver === "undefined") {
      start();
      return () => stop();
    }
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  // An open panel freezes the field, so the pill it hangs off stays put.
  useEffect(() => {
    pausedRef.current = open !== null;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent): void => {
      if (event.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  /** Freeze the pill's current spot in container coordinates and open there. */
  const openPill = (name: string, pill: HTMLElement): void => {
    const container = containerRef.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    const spot = pill.getBoundingClientRect();
    setBounds({ width: box.width, height: box.height });
    setOpen({
      name,
      x: spot.left - box.left + spot.width / 2,
      y: spot.top - box.top + spot.height / 2,
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    setOpen(null);
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    movedRef.current = 0;
    velocityRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    movedRef.current += Math.abs(dx);
    if (
      movedRef.current > DRAG_THRESHOLD &&
      !e.currentTarget.hasPointerCapture?.(e.pointerId)
    ) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    // Negative: near-side (out-of-page) pills track the cursor's direction.
    const delta = -dx * DRAG_SENSITIVITY;
    angleRef.current += delta;
    velocityRef.current = delta; // becomes the fling velocity on release
    // delta is non-zero here (guarded by dx !== 0), so Math.sign is always ±1.
    if (dx !== 0) dirRef.current = Math.sign(delta);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      className="expertise-storm relative mx-auto h-[36rem] w-full max-w-6xl cursor-grab select-none active:cursor-grabbing xl:h-[40rem] xl:max-w-7xl"
      role="group"
      aria-label="Areas W3 Sourcing recruits across — drag to spin"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Central glow + orbit guide-paths. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[80px]" />
        {RINGS.map((ring) => (
          <div
            key={ring.rx}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-primary/[0.04]"
            style={{ width: ring.rx * 2, height: ring.rx * 2 * RING_SQUASH, marginTop: ring.y }}
          />
        ))}
      </div>

      {/* 3D scene: JS writes --storm-angle here each frame; each pill derives
          its tilted-ring spot from it via CSS trig. preserve-3d depth-sorts
          pills against each other and the centre title (planted at z=0). */}
      <div ref={sceneRef} className="expertise-storm-3d">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 text-center"
          style={{ transform: "translate(-50%, -50%) translateZ(0px)" }}
          aria-hidden
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">
            Areas we cover
          </p>
          <p className="mt-1 bg-gradient-to-r from-accent to-primary bg-clip-text text-3xl font-extrabold tracking-tight text-transparent xl:text-4xl">
            The W3 map
          </p>
          <p className="mt-2 text-[11px] text-muted">drag to spin · click a pill</p>
        </div>

        {pills.map((p) => (
          <div
            key={p.name}
            className="expertise-orbit-item"
            style={
              {
                "--phase": `${p.phase}deg`,
                "--rx": p.ring.rx,
                "--rs": p.ring.scale,
                "--ry": `${p.offsetY}px`,
              } as React.CSSProperties
            }
            onPointerEnter={() => {
              if (!open) pausedRef.current = true;
            }}
            onPointerLeave={() => {
              if (!open) pausedRef.current = false;
            }}
          >
            <button
              type="button"
              aria-pressed={open?.name === p.name}
              onClick={(event) => openPill(p.name, event.currentTarget)}
              className={`expertise-pill inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                open?.name === p.name ? "expertise-pill--open" : ""
              }`}
            >
              {p.name}
            </button>
          </div>
        ))}
      </div>

      {open ? (
        <AreaPanel
          key={open.name}
          area={open}
          bounds={bounds}
          onPick={(name) => setOpen((current) => (current ? { ...current, name } : current))}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}

function ClusterGrid() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
      {expertiseClusters.map((cluster) => (
        <div key={cluster.label} className="glass-panel rounded-2xl p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {cluster.label}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cluster.items.map((item) => (
              <span
                key={item}
                className="glass-chip rounded-full px-3 py-1 text-xs font-medium text-text-secondary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExpertiseStorm() {
  const desktop = useIsDesktop();
  const headingSplit = useSplitWordsAnimate(true);

  return (
    <section
      id="expertise"
      className="section-padding relative overflow-hidden"
      aria-labelledby="expertise-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-4">
          <span className="glass-chip mb-5 inline-block rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Our coverage
          </span>
          <h2
            id="expertise-heading"
            className="text-3xl font-extrabold leading-[1.15] tracking-tight text-primary sm:text-4xl"
          >
            <SplitWords
              as="span"
              text="The breadth we hunt across"
              className="justify-center"
              stagger={0.04}
              animate={headingSplit}
            />
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            From founding engineers and AI/ML to partners, private banking, and executive
            search — mapped with the same principal-led rigour, wherever the mandate sits.
          </p>
        </div>

        {desktop ? <StormField /> : <ClusterGrid />}
      </div>
    </section>
  );
}
