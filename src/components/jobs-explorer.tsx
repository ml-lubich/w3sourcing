"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Flame,
  Mail,
  MapPin,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { PERRY_LINKEDIN_URL } from "@/content/contact-links";
import { buildJobMailtoHref, filterJobs, type LiveJob } from "@/lib/jobs";

const PAGE_SIZE = 24;
const LOAD_DELAY_MS = 420;

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function techStackChips(techStack: string | null): string[] {
  if (!techStack) return [];
  return techStack
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean)
    .slice(0, 6);
}

type FilterMenuProps = {
  label: string;
  allLabel: string;
  value: string;
  options: string[];
  icon: ReactNode;
  onChange: (value: string) => void;
};

function FilterMenu({
  label,
  allLabel,
  value,
  options,
  icon,
  onChange,
}: FilterMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const choices = useMemo(() => ["", ...options], [options]);
  const selectedIndex = Math.max(0, choices.indexOf(value));

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
    requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  const choose = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const startIndex =
        event.key === "ArrowDown"
          ? selectedIndex
          : selectedIndex > 0
            ? selectedIndex
            : choices.length - 1;
      openAt(startIndex);
    }
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const nextIndex = event.key === "Home" ? 0 : choices.length - 1;
      setActiveIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (index + offset + choices.length) % choices.length;
      setActiveIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
      return;
    }
    if (event.key === "Tab") setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? setOpen(false) : openAt(selectedIndex))}
        onKeyDown={handleTriggerKeyDown}
        className="glass-control group flex min-h-12 w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-primary outline-none transition-[box-shadow,color,transform] hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/35 motion-safe:hover:-translate-y-0.5"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
          {icon}
        </span>
        <span className="min-w-0 flex-1 truncate">{value || allLabel}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border border-white/35 bg-surface p-1.5 shadow-[0_18px_55px_rgb(15_23_42_/_0.18)] dark:border-white/10">
          <div
            id={menuId}
            role="listbox"
            aria-label={label}
            aria-activedescendant={`${menuId}-option-${activeIndex}`}
            className="max-h-64 overflow-y-auto overscroll-contain"
          >
            {choices.map((choice, index) => {
              const selected = choice === value;
              return (
                <button
                  key={choice || "all"}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  id={`${menuId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => choose(choice)}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "bg-accent/12 font-semibold text-accent"
                      : "text-text-secondary hover:bg-accent/8 hover:text-primary"
                  }`}
                >
                  <span className="min-w-0 flex-1">{choice || allLabel}</span>
                  {selected ? <Check className="size-4 shrink-0" aria-hidden /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="glass-panel min-h-80 rounded-2xl p-6 animate-pulse motion-reduce:animate-none"
    >
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-xl bg-accent/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-full bg-primary/10" />
          <div className="h-3 w-1/3 rounded-full bg-accent/10" />
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <div className="h-7 w-28 rounded-lg bg-primary/8" />
        <div className="h-7 w-24 rounded-lg bg-primary/8" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded-full bg-primary/8" />
        <div className="h-3 w-4/5 rounded-full bg-primary/8" />
      </div>
      <div className="mt-8 h-10 w-full rounded-xl bg-accent/10" />
    </div>
  );
}

export function JobsExplorer({ jobs }: { jobs: LiveJob[] }) {
  const [query, setQuery] = useState("");
  const [roleGroup, setRoleGroup] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [sector, setSector] = useState("");
  const [visa, setVisa] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [copyFailedRef, setCopyFailedRef] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const uniqueValues = useCallback(
    (pick: (job: LiveJob) => string | null) =>
      [...new Set(jobs.map(pick).filter((value): value is string => Boolean(value)))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [jobs],
  );
  const roleGroups = useMemo(() => uniqueValues((job) => job.roleGroup), [uniqueValues]);
  const workplaces = useMemo(() => uniqueValues((job) => job.workplace), [uniqueValues]);
  const sectors = useMemo(() => uniqueValues((job) => job.sector), [uniqueValues]);
  const visaStatuses = useMemo(() => uniqueValues((job) => job.visa), [uniqueValues]);

  const filtered = useMemo(
    () =>
      filterJobs(jobs, {
        query,
        roleGroup: roleGroup || undefined,
        workplace: workplace || undefined,
        sector: sector || undefined,
        visa: visa || undefined,
      }),
    [jobs, query, roleGroup, workplace, sector, visa],
  );
  const visible = filtered.slice(0, visibleCount);
  const hasActiveFilters = Boolean(query || roleGroup || workplace || sector || visa);

  const resetPaging = () => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    setIsLoadingMore(false);
    setVisibleCount(PAGE_SIZE);
  };

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    resetPaging();
  };

  const clearFilters = () => {
    setQuery("");
    setRoleGroup("");
    setWorkplace("");
    setSector("");
    setVisa("");
    resetPaging();
  };

  const revealHashJob = useCallback(() => {
    let anchor: string;
    try {
      anchor = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    if (!anchor.startsWith("job-")) return;

    const jobIndex = jobs.findIndex(
      (job) => `job-${job.ref.toLowerCase()}` === anchor.toLowerCase(),
    );
    if (jobIndex < 0) return;

    setQuery("");
    setRoleGroup("");
    setWorkplace("");
    setSector("");
    setVisa("");
    setVisibleCount(Math.ceil((jobIndex + 1) / PAGE_SIZE) * PAGE_SIZE);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = document.getElementById(anchor);
        target?.scrollIntoView({ block: "start" });
        target?.focus({ preventScroll: true });
      });
    });
  }, [jobs]);

  useEffect(() => {
    const frame = requestAnimationFrame(revealHashJob);
    window.addEventListener("hashchange", revealHashJob);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", revealHashJob);
    };
  }, [revealHashJob]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || filtered.length <= visibleCount || isLoadingMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || loadTimerRef.current) return;
        setIsLoadingMore(true);
        loadTimerRef.current = setTimeout(() => {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length));
          setIsLoadingMore(false);
          loadTimerRef.current = null;
        }, LOAD_DELAY_MS);
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filtered.length, isLoadingMore, visibleCount]);

  useEffect(
    () => () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      if (failedTimerRef.current) clearTimeout(failedTimerRef.current);
    },
    [],
  );

  const markCopied = (ref: string) => {
    setCopyFailedRef(null);
    setCopiedRef(ref);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopiedRef(null), 2200);
  };

  const markCopyFailed = (ref: string) => {
    setCopiedRef(null);
    setCopyFailedRef(ref);
    if (failedTimerRef.current) clearTimeout(failedTimerRef.current);
    failedTimerRef.current = setTimeout(() => setCopyFailedRef(null), 2600);
  };

  const copyLink = async (url: string, ref: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    markCopied(ref);
  };

  const shareJob = async (job: LiveJob) => {
    const anchor = `job-${job.ref.toLowerCase()}`;
    const url = `${window.location.origin}${window.location.pathname}#${anchor}`;
    const shareData = {
      title: `${job.role} — ${job.ref}`,
      text: `Take a look at this ${job.role} opportunity from W3 Sourcing (${job.ref}).`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink(url, job.ref);
  };

  return (
    <div>
      <div className="glass-panel relative z-20 mb-8 overflow-visible rounded-2xl p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-accent/12 text-accent">
              <SlidersHorizontal className="size-4.5" aria-hidden />
            </span>
            <div>
              <h2 className="text-sm font-bold text-primary">Find your next role</h2>
              <p className="text-xs text-muted">Search and refine W3&apos;s active opportunities.</p>
            </div>
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-accent/8 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              <X className="size-3.5" aria-hidden />
              Clear filters
            </button>
          ) : null}
        </div>

        <label className="relative mb-3 block">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-accent"
            strokeWidth={2}
            aria-hidden
          />
          <span className="sr-only">Search jobs</span>
          <input
            type="search"
            value={query}
            onChange={(event) => updateFilter(setQuery, event.target.value)}
            placeholder="Search title, reference, skills, location, sector…"
            className="glass-control min-h-12 w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-primary outline-none placeholder:font-normal placeholder:text-muted transition-[box-shadow,transform] focus-visible:ring-2 focus-visible:ring-accent/35 motion-safe:focus:-translate-y-0.5"
          />
        </label>

        {/* Inline z-index: `.glass-panel > *` forces z-index:1 on direct children and outranks
            utilities, so open popovers would paint under the later sibling count line. */}
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4" style={{ zIndex: 30 }}>
          <FilterMenu
            label="Filter by role group"
            allLabel="All role groups"
            value={roleGroup}
            options={roleGroups}
            icon={<BriefcaseBusiness className="size-4" aria-hidden />}
            onChange={(value) => updateFilter(setRoleGroup, value)}
          />
          <FilterMenu
            label="Filter by workplace"
            allLabel="Any workplace"
            value={workplace}
            options={workplaces}
            icon={<Building2 className="size-4" aria-hidden />}
            onChange={(value) => updateFilter(setWorkplace, value)}
          />
          <FilterMenu
            label="Filter by sector"
            allLabel="All sectors"
            value={sector}
            options={sectors}
            icon={<Sparkles className="size-4" aria-hidden />}
            onChange={(value) => updateFilter(setSector, value)}
          />
          <FilterMenu
            label="Filter by visa availability"
            allLabel="Any visa status"
            value={visa}
            options={visaStatuses}
            icon={<ShieldCheck className="size-4" aria-hidden />}
            onChange={(value) => updateFilter(setVisa, value)}
          />
        </div>

        <p className="mt-3 text-xs font-medium text-muted" aria-live="polite">
          Showing {visible.length.toLocaleString("en-GB")} of{" "}
          {filtered.length.toLocaleString("en-GB")} roles
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent">
            <Search className="size-5" aria-hidden />
          </span>
          <p className="mt-4 font-semibold text-primary">No roles match those filters.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Try a broader search, clear a filter, or message Perry about what you are looking for.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="glass-panel glass-panel--chrome inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary hover:text-accent"
            >
              <X className="size-4" aria-hidden />
              Clear filters
            </button>
            <a
              href={PERRY_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <LinkedInGlyph className="size-4" />
              DM Perry on LinkedIn
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((job, index) => {
              const chips = techStackChips(job.techStack);
              const anchor = `job-${job.ref.toLowerCase()}`;
              const wasCopied = copiedRef === job.ref;
              const copyFailed = copyFailedRef === job.ref;
              return (
                <article
                  key={job.ref}
                  id={anchor}
                  tabIndex={-1}
                  style={{ animationDelay: `${Math.min(index % PAGE_SIZE, 8) * 45}ms` }}
                  className="jobs-card-enter glass-panel group relative scroll-mt-28 overflow-hidden rounded-2xl p-6 transition-[box-shadow,transform] duration-300 hover:shadow-[0_18px_55px_rgb(79_70_229_/_0.14)] dark:hover:shadow-[0_18px_55px_rgb(0_0_0_/_0.42)]"
                >
                  {/* Inside the inner wrapper: `.glass-panel > *` forces position:relative on direct children. */}
                  <div className="relative flex h-full flex-col">
                    <div
                      className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-accent/10 blur-3xl transition-transform duration-700 motion-safe:group-hover:scale-125"
                      aria-hidden
                    />
                    <div className="relative flex items-start gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent/18 to-cyan-400/10 text-accent shadow-[inset_0_1px_0_rgb(255_255_255_/_0.6)]">
                        <BriefcaseBusiness className="size-5" strokeWidth={1.8} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold leading-snug text-primary">
                          {job.role}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <a
                            href={`#${anchor}`}
                            className="glass-chip rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide text-text-secondary transition-colors hover:text-accent"
                            aria-label={`Direct link to ${job.role}, reference ${job.ref}`}
                          >
                            {job.ref}
                          </a>
                          {job.hot ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/12 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                              <Flame className="size-3" aria-hidden />
                              Hot
                            </span>
                          ) : null}
                          {job.sector ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                              <Sparkles className="size-3" aria-hidden />
                              {job.sector}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 text-xs font-medium text-text-secondary sm:grid-cols-2">
                      {job.locations ? (
                        <span className="inline-flex items-start gap-1.5">
                          <MapPin className="mt-px size-3.5 shrink-0 text-accent" aria-hidden />
                          {job.locations}
                        </span>
                      ) : null}
                      {job.workplace ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="size-3.5 shrink-0 text-accent" aria-hidden />
                          {job.workplace}
                        </span>
                      ) : null}
                      {job.salary ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                          <CircleDollarSign className="size-3.5 shrink-0 text-accent" aria-hidden />
                          {job.salary}
                        </span>
                      ) : null}
                      {job.yoe ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="size-3.5 shrink-0 text-accent" aria-hidden />
                          {job.yoe} experience
                        </span>
                      ) : null}
                      {job.multiHire === "Yes" && job.hiringCount ? (
                        <span className="inline-flex items-center gap-1.5 text-accent">
                          <Users className="size-3.5 shrink-0" aria-hidden />
                          {job.hiringCount} openings
                        </span>
                      ) : null}
                      {job.visa ? (
                        <span className="inline-flex items-center gap-1.5">
                          <ShieldCheck className="size-3.5 shrink-0 text-accent" aria-hidden />
                          Visa: {job.visa}
                        </span>
                      ) : null}
                    </div>

                    {chips.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {chips.map((chip) => (
                          <span
                            key={chip}
                            className="glass-chip rounded-md px-2 py-0.5 text-[11px] font-medium text-text-secondary transition-colors group-hover:text-primary"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-auto pt-5">
                      <p className="mb-2 text-xs font-medium text-muted">
                        For further details, contact Perry:
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={PERRY_LINKEDIN_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgb(79_70_229_/_0.18)] transition-[background-color,transform] hover:bg-accent-hover motion-safe:hover:-translate-y-0.5"
                        >
                          <LinkedInGlyph className="size-3.5" />
                          DM Perry on LinkedIn
                        </a>
                        <a
                          href={buildJobMailtoHref(job)}
                          className="glass-panel glass-panel--chrome inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-primary transition-colors hover:text-accent"
                        >
                          <Mail className="size-3.5" strokeWidth={2} aria-hidden />
                          Email about this role
                        </a>
                        <button
                          type="button"
                          onClick={() => void shareJob(job).catch(() => markCopyFailed(job.ref))}
                          className="glass-panel glass-panel--chrome inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                          aria-label={`Share role: ${job.role}`}
                          aria-live="polite"
                        >
                          {wasCopied ? (
                            <Check className="size-3.5 text-accent" aria-hidden />
                          ) : (
                            <Share2 className="size-3.5" aria-hidden />
                          )}
                          {wasCopied ? "Link copied" : copyFailed ? "Copy failed" : "Share role"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            {isLoadingMore ? (
              <>
                <JobCardSkeleton />
                <JobCardSkeleton />
              </>
            ) : null}
          </div>

          {filtered.length > visible.length ? (
            <div
              ref={loadMoreRef}
              className="mt-6 flex min-h-10 items-center justify-center text-xs font-medium text-muted"
              aria-live="polite"
            >
              {isLoadingMore ? "Loading more roles…" : "Scroll to discover more roles"}
            </div>
          ) : (
            <p className="mt-8 text-center text-xs font-medium text-muted">
              You have reached the end of the current roles.
            </p>
          )}
        </>
      )}
    </div>
  );
}
