import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const brandWordmarkUrl = new URL(
  "../../public/images/logo_w3_sourcing_wordmark.png",
  import.meta.url,
);

export async function loadBrandWordmarkDataUrl(): Promise<string> {
  const imageBytes = await readFile(fileURLToPath(brandWordmarkUrl));
  return `data:image/png;base64,${Buffer.from(imageBytes).toString("base64")}`;
}
