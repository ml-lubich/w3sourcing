import { newRef, toRef } from "./jobs";
import type { JobRow } from "./jobs-store";

/**
 * CSV import for the admin board. Perry pastes or uploads whatever his ATS
 * (Paraform today) exports, so headers are matched loosely by alias and every
 * column except the role title is optional. Rows that cannot be understood are
 * reported back by line number rather than silently dropped.
 */

/** RFC 4180-ish: quoted fields, `""` escapes, CR/LF or LF line endings. */
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char !== '"') {
        field += char;
      } else if (source[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        quoted = false;
      }
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") field += char;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

type ImportField = Exclude<keyof JobRow, "ref">;

/** Header spellings seen in real exports, normalised to `[a-z0-9]`. */
const HEADER_ALIASES: Record<string, ImportField> = {
  role: "role",
  jobtitle: "role",
  title: "role",
  position: "role",
  company: "company",
  client: "company",
  companyname: "company",
  rolegroup: "roleGroup",
  group: "roleGroup",
  department: "roleGroup",
  category: "roleGroup",
  roletype: "roleType",
  function: "roleType",
  discipline: "roleType",
  sector: "sector",
  industry: "sector",
  location: "locations",
  locations: "locations",
  city: "locations",
  cities: "locations",
  workplace: "workplace",
  workmodel: "workplace",
  worksetup: "workplace",
  remote: "workplace",
  salary: "salary",
  compensation: "salary",
  comp: "salary",
  salaryrange: "salary",
  pay: "salary",
  yoe: "yoe",
  experience: "yoe",
  yearsofexperience: "yoe",
  yearsexperience: "yoe",
  techstack: "techStack",
  tech: "techStack",
  stack: "techStack",
  technologies: "techStack",
  skills: "techStack",
  visa: "visa",
  visastatus: "visa",
  sponsorship: "visa",
  visasponsorship: "visa",
  posteddate: "postedDate",
  dateposted: "postedDate",
  posted: "postedDate",
  date: "postedDate",
  link: "link",
  url: "link",
  joblink: "link",
  paraformlink: "link",
  roleurl: "link",
  website: "website",
  companywebsite: "website",
  site: "website",
  oneliner: "oneLiner",
  tagline: "oneLiner",
  summary: "oneLiner",
  multihire: "multiHire",
  multiplehires: "multiHire",
  hiringcount: "hiringCount",
  hires: "hiringCount",
  openings: "hiringCount",
  headcount: "hiringCount",
  hot: "hot",
  hotjob: "hot",
  newhotjob: "hot",
  featured: "hot",
};

/** Column order used by the downloadable template. */
export const CSV_TEMPLATE_COLUMNS = [
  "role",
  "company",
  "roleGroup",
  "roleType",
  "sector",
  "locations",
  "workplace",
  "salary",
  "yoe",
  "techStack",
  "visa",
  "postedDate",
  "link",
  "website",
  "oneLiner",
  "multiHire",
  "hiringCount",
  "hot",
] as const;

function normaliseHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isTruthyFlag(value: string): boolean {
  return ["yes", "y", "true", "1", "hot", "x"].includes(value.trim().toLowerCase());
}

/**
 * ISO dates pass through. Otherwise fall back to `Date`, but treat a leading
 * number above 12 in a slashed date as day-first (`25/06/2026`), which `Date`
 * would otherwise read as an invalid month.
 */
export function toIsoDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const slashed = trimmed.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  const candidate =
    slashed && Number(slashed[1]) > 12
      ? `${slashed[3]}-${slashed[2].padStart(2, "0")}-${slashed[1].padStart(2, "0")}`
      : trimmed;
  const parsed = new Date(candidate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export type CsvImportResult = {
  jobs: JobRow[];
  /** Human-readable problems, by CSV line number. */
  errors: string[];
  /** Headers that matched no known field (ignored, worth surfacing). */
  ignoredColumns: string[];
};

export function jobsFromCsv(text: string): CsvImportResult {
  const rows = parseCsv(text);
  const errors: string[] = [];
  if (rows.length === 0) return { jobs: [], errors: ["The file is empty."], ignoredColumns: [] };

  const headers = rows[0].map((header) => HEADER_ALIASES[normaliseHeader(header)] ?? null);
  const ignoredColumns = rows[0].filter((_, index) => headers[index] === null).filter(Boolean);
  if (!headers.includes("role")) {
    return {
      jobs: [],
      errors: [
        `No role column found. The header row needs one of: role, job title, title, position. Got: ${rows[0].join(", ")}`,
      ],
      ignoredColumns,
    };
  }

  const jobs: JobRow[] = [];
  rows.slice(1).forEach((cells, index) => {
    const line = index + 2;
    const values = {} as Record<ImportField, string>;
    headers.forEach((field, column) => {
      if (field) values[field] = (cells[column] ?? "").trim();
    });

    if (!values.role) {
      errors.push(`Line ${line}: skipped, no role title.`);
      return;
    }

    let postedDate: string | null = null;
    if (values.postedDate) {
      postedDate = toIsoDate(values.postedDate);
      if (!postedDate) {
        errors.push(`Line ${line}: could not read the date "${values.postedDate}" — use YYYY-MM-DD.`);
        return;
      }
    }

    const optional = (field: ImportField) => values[field] || null;
    jobs.push({
      ref: values.link ? toRef(values.link) : newRef(),
      role: values.role,
      company: values.company ?? "",
      roleGroup: optional("roleGroup"),
      roleType: optional("roleType"),
      sector: optional("sector"),
      locations: optional("locations"),
      workplace: optional("workplace"),
      salary: optional("salary"),
      yoe: optional("yoe"),
      techStack: optional("techStack"),
      visa: optional("visa"),
      postedDate,
      link: values.link ?? "",
      website: optional("website"),
      oneLiner: optional("oneLiner"),
      multiHire: values.multiHire ? (isTruthyFlag(values.multiHire) ? "Yes" : "No") : null,
      hiringCount: optional("hiringCount"),
      hot: isTruthyFlag(values.hot ?? ""),
    });
  });

  const seen = new Set<string>();
  const deduped = jobs.filter((job) => {
    if (seen.has(job.ref)) return false;
    seen.add(job.ref);
    return true;
  });

  return { jobs: deduped, errors, ignoredColumns };
}
