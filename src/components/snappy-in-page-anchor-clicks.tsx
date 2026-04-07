"use client";

import { useEffect } from "react";
import { scrollToSectionId } from "@/lib/scroll-to-section";

/**
 * Same-document `href="#…"` clicks: snappy eased scroll via `scrollToSectionId`.
 * Skips when another handler already called `preventDefault` (e.g. header section links).
 * Skip-to-main keeps native behavior so focus management stays correct.
 */
export function SnappyInPageAnchorClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent): void => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const t = e.target;
      if (!(t instanceof Element)) return;
      const a = t.closest("a");
      if (!a) return;

      const hrefAttr = a.getAttribute("href");
      if (!hrefAttr || !hrefAttr.startsWith("#")) return;

      let id: string;
      try {
        id = decodeURIComponent(hrefAttr.slice(1));
      } catch {
        id = hrefAttr.slice(1);
      }
      if (!id) return;
      if (id === "main-content") return;

      if (!document.getElementById(id)) return;

      e.preventDefault();
      scrollToSectionId(id);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
