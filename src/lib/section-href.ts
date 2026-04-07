/**
 * On the home page, section links use hash-only hrefs. On other routes, the same
 * hrefs must include "/" so the browser resolves them against the site root.
 */
export function sectionHref(href: string, absoluteFromRoot: boolean): string {
  if (!absoluteFromRoot || !href.startsWith("#")) return href;
  return `/${href}`;
}
