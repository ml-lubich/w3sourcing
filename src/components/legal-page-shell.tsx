import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export function LegalPageShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Header sectionLinksFromRoot />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-transparent pt-24 pb-16 md:pt-28 outline-none"
      >
        {children}
      </main>
      <Footer sectionLinksFromRoot />
    </>
  );
}
