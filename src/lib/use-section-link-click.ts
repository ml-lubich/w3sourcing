"use client";

import { useCallback, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { sectionHref } from "@/lib/section-href";
import { sectionIdFromNavHref } from "@/lib/section-nav";
import { scrollToSectionId, stashPendingSectionScroll } from "@/lib/scroll-to-section";

export type SectionLinkClickOptions = {
  /** After the mobile nav sheet starts closing, so the target is not obscured. */
  samePageDelayMs?: number;
};

export function useSectionLinkClick(sectionLinksFromRoot: boolean) {
  const pathname = usePathname();
  const router = useRouter();

  return useCallback(
    (
      event: MouseEvent<HTMLAnchorElement>,
      hashOnlyHref: string,
      options?: SectionLinkClickOptions,
    ) => {
      const resolved = sectionHref(hashOnlyHref, sectionLinksFromRoot);
      const id = sectionIdFromNavHref(resolved);
      if (!id) return;

      event.preventDefault();

      const scrollToTarget = () => {
        scrollToSectionId(id);
      };

      if (pathname === "/") {
        const delay = options?.samePageDelayMs ?? 0;
        if (delay > 0) {
          window.setTimeout(scrollToTarget, delay);
        } else {
          window.requestAnimationFrame(scrollToTarget);
        }
        return;
      }

      // App Router client navigation often drops `/#hash`; stash id and scroll on home mount.
      stashPendingSectionScroll(id);
      void router.push("/", { scroll: false });
    },
    [pathname, router, sectionLinksFromRoot],
  );
}
