import { describe, expect, test } from "bun:test";

const hero = await Bun.file(new URL("./hero.tsx", import.meta.url)).text();
const css = await Bun.file(new URL("../app/globals.css", import.meta.url)).text();

describe("hero film contract", () => {
  test("sits under every other hero layer, at full strength", () => {
    // The film opens the background stack, so orbs, grid, headline and the demo
    // panel all paint on top of it.
    expect(hero.indexOf("hero-film absolute inset-0")).toBeLessThan(hero.indexOf("hero-orb absolute"));
    // No tint and no gradient over the footage — legibility comes from the copy
    // treatment below, not from dimming the film.
    expect(hero).not.toContain("hero-film-scrim");
    expect(css).not.toContain(".hero-film-scrim");
    expect(css.slice(css.indexOf(".hero-film {"))).not.toMatch(/^\.hero-film \{[^}]*opacity/);
  });

  test("copy over the film reads light-on-dark in both themes", () => {
    expect(hero).toContain("hero-on-film relative z-10");
    expect(css).toContain(".hero-on-film");
    // Panels carry their own surface, so they keep the theme's own colours.
    expect(css).toContain(".hero-on-film .glass-panel .text-primary");
  });

  test("the bar goes transparent over the hero and picks up the accent", () => {
    expect(css).toContain(".header-bar[data-at-top]");
    expect(css).toContain(".header-bar[data-at-top] .header-wordmark");
  });

  test("phones get their own encode, never the desktop file", () => {
    expect(hero).toContain('narrow ? "/videos/hero-640.mp4" : "/videos/hero-1280.mp4"');
    // Mounting after hydration is what makes the choice before any request.
    expect(hero).toContain("<HeroFilm narrow={narrowViewport} />");
  });

  test("reduced motion downloads no video at all", () => {
    expect(hero).toContain("visible && !reduceMotion ?");
    // The poster is a CSS background on the film box, so that path stays static.
    expect(css).toContain('.hero-film {');
    expect(css).toContain('url("/videos/hero-poster.webp")');
  });

  test("plays muted and inline, and asks again when autoplay is skipped", () => {
    for (const attr of ["autoPlay", "muted", "loop", "playsInline"]) expect(hero).toContain(attr);
    expect(hero).toContain("ref.current?.play().catch(() => {})");
  });
});
