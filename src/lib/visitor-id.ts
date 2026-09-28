import { cookies } from "next/headers";

/** First-party id for "who opened this link". Not a name, not an IP address. */
export const VISITOR_COOKIE = "w3_vid";

const VISITOR_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isVisitorId(value: string): boolean {
  return VISITOR_ID.test(value);
}

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Read the visitor cookie, or mint one and set it. Safe to call from actions and route handlers. */
export async function currentVisitorId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(VISITOR_COOKIE)?.value;
  if (existing && isVisitorId(existing)) return existing;
  const id = crypto.randomUUID();
  jar.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return id;
}
