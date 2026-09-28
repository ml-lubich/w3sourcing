/**
 * Site referral codes for the jobs board.
 *
 * Each shared link and each "email Perry" / LinkedIn click gets its own code.
 * Opening that link counts one person once, so Perry can match a candidate to
 * the site and pay the 10% commission for traffic that came through it.
 * Codes stay free of 0/O/1/I so they can be read out of an email subject.
 */

/** Commission Perry pays for a candidate who came through this site. */
export const SITE_REFERRAL_RATE = 0.1;

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const REFERRAL_CODE_LENGTH = 8;

export type ReferralChannel = "copy" | "email" | "linkedin";

export function mintReferralCode(random: (length: number) => Uint8Array): string {
  const bytes = random(REFERRAL_CODE_LENGTH);
  let code = "";
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    code += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return code;
}

export function isReferralCode(value: string): boolean {
  return new RegExp(`^[${ALPHABET}]{${REFERRAL_CODE_LENGTH}}$`).test(value);
}

/** Public path a shared job link uses. The hop logs the click, then opens the role. */
export function referralPath(code: string): string {
  return `/r/${code}`;
}

/**
 * Email and LinkedIn are the click: the person just asked about the role.
 * A copied link counts later, when someone actually opens it.
 */
export function countsOnIssue(channel: ReferralChannel): boolean {
  return channel !== "copy";
}

/** A person counts once per link. A second visit from the same visitor is not a new referral. */
export function clickCountsAsReferral(visitorAlreadySeen: boolean): boolean {
  return !visitorAlreadySeen;
}
