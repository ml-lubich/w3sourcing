import path from "node:path";
import { fileURLToPath } from "node:url";

/** Anchor Tailwind to this app; `process.cwd()` alone can be a parent folder and break `tailwindcss` resolution. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: projectRoot,
    },
  },
};

export default config;
