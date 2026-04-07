/**
 * Canonical site origin for metadata, sitemap, robots, and structured data.
 * Set `NEXT_PUBLIC_SITE_URL` in production (see `docs/DEPLOYMENT.md`).
 */
export function getSiteUrl(): URL {
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (trimmed) {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return new URL(withProtocol.replace(/\/$/, ""));
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, "");
    return new URL(`https://${host}`);
  }
  return new URL("https://w3sourcing.com");
}

export function getSiteOrigin(): string {
  return getSiteUrl().origin;
}
