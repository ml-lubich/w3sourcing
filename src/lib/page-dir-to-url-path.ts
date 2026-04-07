import path from "node:path";

/**
 * Maps a Next.js App Router `page.*` directory to a public URL path.
 * Skips route groups, dynamic segments, and private segments per app conventions.
 */
export function pageDirToUrlPath(appDir: string, pageDir: string): string | null {
  const rel = path.relative(appDir, pageDir);
  if (!rel || rel === ".") return "/";
  const segments = rel.split(path.sep);
  const urlSegments: string[] = [];
  for (const seg of segments) {
    if (seg.startsWith("(") && seg.endsWith(")")) continue;
    if (seg.startsWith("_")) return null;
    if (seg.includes("[")) return null;
    urlSegments.push(encodeURIComponent(seg));
  }
  if (urlSegments.length === 0) return "/";
  return `/${urlSegments.join("/")}`;
}
