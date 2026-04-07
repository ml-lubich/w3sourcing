/** Resolves `sectionHref` output to a section id, or null if not a home anchor target. */
export function sectionIdFromNavHref(resolved: string): string | null {
  if (resolved.startsWith("/#") && resolved.length > 2) {
    const id = resolved.slice(2);
    return id.length > 0 ? id : null;
  }
  if (resolved.startsWith("#") && resolved.length > 1) {
    const id = resolved.slice(1);
    return id.length > 0 ? id : null;
  }
  return null;
}
