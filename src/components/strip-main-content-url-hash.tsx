"use client";

import { useEffect } from "react";
import { stripMainContentHashFromAddressBar } from "@/lib/scroll-to-section";

/** Removes `#main-content` from the URL when present (skip-link / legacy deep links). */
export function StripMainContentUrlHash() {
  useEffect(() => {
    stripMainContentHashFromAddressBar();
  }, []);
  return null;
}
