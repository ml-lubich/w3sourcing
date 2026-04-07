import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export function LegalPageShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[100] -translate-y-[150vh] rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg outline-none transition-transform focus:translate-y-0 focus:ring-2 focus:ring-white/40"
      >
        Skip to main content
      </a>
      <Header sectionLinksFromRoot />
      <main id="main-content" className="min-h-screen bg-transparent pt-24 pb-16 md:pt-28">
        {children}
      </main>
      <Footer sectionLinksFromRoot />
    </>
  );
}
