/**
 * Which glyph a role card wears. Every card carrying the same briefcase made a
 * 965-role board hard to scan, so the discipline is read off the role title
 * (with role type, group, and sector as backup) and mapped to one icon.
 *
 * Rules are ordered and the first match wins, so the specific ones come before
 * the broad ones: "Senior Technical Support Engineer" is support, not
 * engineering, and "RL Research Engineer" is research, not AI.
 */
export type RoleIconKey =
  | "executive"
  | "legal"
  | "security"
  | "data"
  | "research"
  | "ai"
  | "design"
  | "product"
  | "support"
  | "engineering"
  | "sales"
  | "marketing"
  | "finance"
  | "people"
  | "operations"
  | "role";

const RULES: ReadonlyArray<readonly [RegExp, RoleIconKey]> = [
  [/chief of staff|chief (executive|technology|operating|financial)|\bc[teofx]o\b|\bsvp\b|\bevp\b|vice president|executive leadership/, "executive"],
  [/litigation|counsel|attorney|paralegal|\blegal\b|\blaw\b|transactional (associate|partner)|\bpartner\b(?!ships)/, "legal"],
  [/security|cyber|infosec|appsec|threat|trust (and|&) safety/, "security"],
  [/data (scientist|engineer|analyst|science)|analytics|business intelligence|\bbi\b|data warehouse/, "data"],
  [/research|\bscientist\b|\bphd\b/, "research"],
  [/machine learning|deep learning|\bai\b|\bml\b|\bllm\b|\brl\b/, "ai"],
  [/design|\bux\b|\bui\b|creative director/, "design"],
  [/product (manager|management|owner|marketing)|program manager|\bpm\b/, "product"],
  [/support|solutions engineer|implementation|onboarding specialist/, "support"],
  [/engineer|developer|architect|devops|\bsre\b|infrastructure|full.?stack|frontend|front.end|backend|back.end|\bios\b|android|mobile|\bqa\b|technical staff/, "engineering"],
  [/sales|account (executive|manager|director)|business development|revenue|\bgtm\b|go.to.market|partnerships|customer success/, "sales"],
  [/marketing|growth|\bbrand\b|content|communications|demand gen|\bseo\b/, "marketing"],
  [/finance|financial|accounting|controller|treasury|investment|banking|private equity|venture|portfolio|\brisk\b|compliance|\baudit\b/, "finance"],
  [/recruit|talent|people ops|\bhr\b|human resources/, "people"],
  [/operations|\bops\b|logistics|supply chain|procurement/, "operations"],
];

export type RoleIconSource = {
  role: string;
  roleType?: string | null;
  roleGroup?: string | null;
  sector?: string | null;
};

export function roleIconKey(job: RoleIconSource): RoleIconKey {
  const haystack = [job.role, job.roleType, job.roleGroup, job.sector]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  for (const [pattern, key] of RULES) {
    if (pattern.test(haystack)) return key;
  }
  return "role";
}
