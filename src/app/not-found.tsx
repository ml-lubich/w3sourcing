import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you requested is missing or the link may be incorrect. Return to W3 Sourcing or get in touch.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <LegalPageShell>
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <div className="glass-panel relative w-full overflow-hidden rounded-3xl px-8 py-12 sm:px-14 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-12 size-56 rounded-full bg-accent/10 blur-3xl dark:bg-accent/20"
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            Error 404
          </p>
          <p className="mt-3 font-mono text-6xl font-extrabold tracking-tighter text-primary tabular-nums sm:text-7xl">
            404
          </p>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
            This page isn&apos;t on our map
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-[0.9375rem]">
            The link may be outdated, or the page may have moved. Head back to the home page or
            reach us directly—we&apos;ll help you find what you need.
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgb(79_70_229_/_0.32)] transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Back to home
            </Link>
            <Link
              href="/#contact"
              className="glass-panel glass-panel--chrome inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-primary transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </LegalPageShell>
  );
}
