import { describe, expect, test } from "bun:test";

const css = await Bun.file(new URL("./globals.css", import.meta.url)).text();

describe("mobile horizontal overflow contract", () => {
  test("the page itself clips horizontal bleed", () => {
    // Decorative washes and blurred orbs spill past the border box by design;
    // this is what stops that becoming a sideways scroll on a phone.
    expect(css).toMatch(/body \{[^}]*overflow-x: hidden;/s);
  });

  test("no decoration hangs past the right edge", () => {
    // A negative `right` on a section decoration widens the document at every
    // viewport — invisible on desktop, a 40px overhang on a 390px phone.
    const ambient = css.slice(css.indexOf(".section-glass-ambient::after {"));
    expect(ambient.slice(0, ambient.indexOf("}"))).not.toMatch(/right: -/);
  });
});
