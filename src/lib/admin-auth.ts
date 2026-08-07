import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * One shared password for the jobs admin, held in `ADMIN_PASSWORD` on Vercel.
 * There is exactly one editor (Perry), so a user table, invites, and password
 * resets would all be machinery with nobody to serve. The session cookie is an
 * HMAC of a fixed string keyed by the password: changing `ADMIN_PASSWORD` in
 * Vercel invalidates every existing session, which is the whole revocation
 * story this needs.
 */

export const ADMIN_COOKIE = "w3_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function equals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function sessionToken(password: string): string {
  return createHmac("sha256", password).update("w3-jobs-admin").digest("hex");
}

export function isValidPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return equals(input, password);
}

export function isValidSession(cookieValue: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !cookieValue) return false;
  return equals(cookieValue, sessionToken(password));
}
