"use client";

import dynamic from "next/dynamic";

export const TrustedByClient = dynamic(
  () => import("@/components/trusted-by").then((m) => ({ default: m.TrustedBy })),
  { ssr: false },
);