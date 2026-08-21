import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

type PublicAssetReference = {
  sourcePath: string;
  publicUrl: string;
};

const repoRoot = path.join(import.meta.dirname, "..", "..");
const publicDir = path.join(repoRoot, "public");
const sourceRoots = [path.join(repoRoot, "src"), path.join(repoRoot, "scripts")] as const;
const sourceExtensions = new Set([".css", ".mjs", ".ts", ".tsx"]);

function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectSourceFiles(entryPath);
    }
    return sourceExtensions.has(path.extname(entry.name)) ? [entryPath] : [];
  });
}

function collectImageReferences(sourcePath: string): PublicAssetReference[] {
  const source = readFileSync(sourcePath, "utf8");
  const references: PublicAssetReference[] = [];

  for (const match of source.matchAll(/["'`]((?:\/images\/)[^"'`\s)]+)["'`]/g)) {
    const publicUrl = match[1];
    if (publicUrl.includes("$") || publicUrl.includes("{")) {
      continue;
    }
    references.push({ sourcePath, publicUrl });
  }

  for (const match of source.matchAll(/DEMO_AVATAR\("([^"/]+)"\)/g)) {
    references.push({ sourcePath, publicUrl: `/images/demo-avatars/${match[1]}` });
  }

  return references;
}

describe("public assets contract", () => {
  test("keeps active public root entries limited to routable machine files and images", () => {
    const rootEntries = readdirSync(publicDir)
      .filter((entryName) => !entryName.startsWith("."))
      .sort();

    expect(rootEntries).toEqual(["images", "llms.txt", "w3-theme-boot.js"]);
  });

  test("keeps source image URLs backed by files under public/images", () => {
    const imageReferences = sourceRoots.flatMap((sourceRoot) =>
      collectSourceFiles(sourceRoot).flatMap(collectImageReferences),
    );
    const missingReferences = imageReferences.filter((reference) =>
      !existsSync(path.join(publicDir, reference.publicUrl)),
    );

    expect(imageReferences.length).toBeGreaterThan(0);
    expect(missingReferences).toEqual([]);
  });
});