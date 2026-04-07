import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "W3 Sourcing — Executive recruitment",
    short_name: "W3 Sourcing",
    description:
      "Human-led executive search in technology, legal, and banking—principal judgment and fit, globally.",
    start_url: "/",
    display: "browser",
    background_color: "#fafafa",
    theme_color: "#4f46e5",
  };
}
