import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";

const componentsDir = path.join(import.meta.dirname, "..", "components");

describe("hero accent line contract", () => {
  const src = readFileSync(path.join(componentsDir, "hero.tsx"), "utf8");

  function heroAccentClassName(): string {
    const match = src.match(
      /text=\{`\$\{accentFrame\.line1\} \$\{accentFrame\.line2\}`\}[\s\S]*?className="([^"]+)"/,
    );

    expect(match?.[1]).toBeDefined();
    return match?.[1] ?? "";
  }

  test("renders the rotating accent as one SplitWords phrase", () => {
    expect(src).toContain('text={`${accentFrame.line1} ${accentFrame.line2}`}');
    expect(src).toContain('phraseWidth="fit"');
    expect(src).toContain("whitespace-nowrap");
  });

  test("does not split the accent into separate line1 and line2 blocks", () => {
    expect(src).not.toContain("text={accentFrame.line1}");
    expect(src).not.toContain("text={accentFrame.line2}");
    expect(src).not.toContain("gsapWordIndexStart={accentFrame.line1.split");
  });

  test("keeps the accent copy visibly colored in both light and dark themes", () => {
    const className = heroAccentClassName();

    expect(className).toMatch(/(?:^|\s)text-(?!transparent)[^\s]+/);
    expect(className).toMatch(/(?:^|\s)dark:text-(?!transparent)[^\s]+/);
    expect(className).not.toMatch(/(?:^|\s)(?:dark:)?bg-clip-text(?:\s|$)/);
    expect(className).not.toMatch(/(?:^|\s)(?:dark:)?text-transparent(?:\s|$)/);
  });
});
