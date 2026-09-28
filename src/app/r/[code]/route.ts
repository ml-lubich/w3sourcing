import { NextResponse } from "next/server";

import { isReferralCode } from "@/lib/referrals";
import { findReferral, recordReferralClick } from "@/lib/referrals-store";
import { currentVisitorId } from "@/lib/visitor-id";

/**
 * Shared job link. Logs one distinct person against the code, then opens the
 * role on the public board. The ATS url stays on the server — this hop never
 * redirects to it.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> },
): Promise<NextResponse> {
  const { code: raw } = await context.params;
  const code = raw.toUpperCase();
  const board = new URL("/jobs", request.url);
  if (!isReferralCode(code)) return NextResponse.redirect(board);

  const referral = await findReferral(code).catch(() => null);
  if (!referral) return NextResponse.redirect(board);

  const visitorId = await currentVisitorId();
  await recordReferralClick({
    code,
    visitorId,
    userAgent: request.headers.get("user-agent"),
  }).catch(() => undefined);

  const dest = new URL("/jobs", request.url);
  dest.searchParams.set("r", code);
  dest.hash = `job-${referral.jobRef.toLowerCase()}`;
  return NextResponse.redirect(dest);
}
