import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

function readPkg(dir: string): {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
} | null {
  const p = path.join(dir, "package.json");
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
  } catch {
    return null;
  }
}

function hasNextDependency(dir: string): boolean {
  const pkg = readPkg(dir);
  if (!pkg) return false;
  return Boolean(pkg.dependencies?.next ?? pkg.devDependencies?.next);
}

/**
 * Directory that owns this Next app (the folder with this `package.json`), not a parent
 * monorepo or home-dir package.json. Turbopack uses this to avoid resolving from the wrong tree.
 */
function appRootFromConfigFile(configFileDir: string): string {
  let dir = path.resolve(configFileDir);
  for (;;) {
    if (hasNextDependency(dir)) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve(configFileDir);
    dir = parent;
  }
}

const configDir = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.resolve(process.cwd());
/** Prefer the directory that contains this config; fall back to cwd so imports resolve under the real app. */
const appRoot = hasNextDependency(configDir)
  ? configDir
  : hasNextDependency(cwd)
    ? cwd
    : appRootFromConfigFile(configDir);

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: appRoot,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    /** Longer cache for optimized derivatives; URLs are content-addressed via query params. */
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
