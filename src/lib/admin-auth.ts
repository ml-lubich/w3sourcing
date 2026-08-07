import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * One shared sign-in for the jobs admin: `ADMIN_EMAIL` and `ADMIN_PASSWORD` on
 * Vercel. There is exactly one editor (Perry), so a user table, invites, and
 * password resets would all be machinery with nobody to serve. The session
 * cookie is an HMAC of the email keyed by the password, so changing either
 * variable in Vercel invalidates every existing session — the whole revocation
 * story this needs.
 */

export const ADMIN_COOKIE = "w3_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

function equals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function sessionToken(email: string, password: string): string {
  return createHmac("sha256", password).update(`w3-jobs-admin:${email.toLowerCase()}`).digest("hex");
}

/** Email is compared case-insensitively; the password is not. */
export function isValidLogin(email: string, password: string): boolean {
  if (!isAdminConfigured()) return false;
  return (
    equals(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase()) &&
    equals(password, process.env.ADMIN_PASSWORD!)
  );
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!isAdminConfigured() || !cookieValue) return false;
  return equals(cookieValue, sessionToken(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!));
}
