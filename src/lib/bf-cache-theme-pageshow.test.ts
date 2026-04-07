import { describe, expect, test } from "bun:test";
import { createBfCacheThemePageShowHandler } from "./bf-cache-theme-pageshow";

describe("createBfCacheThemePageShowHandler", () => {
  test("no-ops when persisted is false", () => {
    const log: string[] = [];
    const h = createBfCacheThemePageShowHandler({
      readTheme: () => "dark",
      applyClass: (t) => log.push(`apply:${t}`),
      setThemeState: (t) => log.push(`set:${t}`),
    });
    h({ persisted: false });
    expect(log).toEqual([]);
  });

  test("syncs read theme to state and DOM when persisted is true", () => {
    const log: string[] = [];
    const h = createBfCacheThemePageShowHandler({
      readTheme: () => "dark",
      applyClass: (t) => log.push(`apply:${t}`),
      setThemeState: (t) => log.push(`set:${t}`),
    });
    h({ persisted: true });
    expect(log).toEqual(["set:dark", "apply:dark"]);
  });
});
