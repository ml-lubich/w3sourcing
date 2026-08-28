import { afterEach, describe, expect, test } from "bun:test";

import { aiConfigured, aiModels, aiText } from "./ai";

const realFetch = globalThis.fetch;
const realKey = process.env.OPENROUTER_API_KEY;
const realModels = process.env.OPENROUTER_MODELS;

afterEach(() => {
  globalThis.fetch = realFetch;
  process.env.OPENROUTER_API_KEY = realKey;
  process.env.OPENROUTER_MODELS = realModels;
  delete process.env.OPENROUTER_API_KEY_FALLBACK;
  delete process.env.OPENAI_API_KEY;
});

function reply(content: string, status = 200) {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status });
}

describe("aiConfigured", () => {
  test("is false without a key", () => {
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY_FALLBACK;
    delete process.env.OPENAI_API_KEY;
    expect(aiConfigured()).toBe(false);
  });

  test("is true with either key", () => {
    delete process.env.OPENROUTER_API_KEY;
    process.env.OPENROUTER_API_KEY_FALLBACK = "sk-b";
    expect(aiConfigured()).toBe(true);
  });

  test("is true with OPENAI_API_KEY", () => {
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY_FALLBACK;
    process.env.OPENAI_API_KEY = "sk-proj-test";
    expect(aiConfigured()).toBe(true);
  });
});

describe("aiModels", () => {
  test("defaults to the shared open-model chain", () => {
    delete process.env.OPENROUTER_MODELS;
    expect(aiModels().length).toBeGreaterThan(1);
  });

  test("takes an env override", () => {
    process.env.OPENROUTER_MODELS = "a/one, b/two";
    expect(aiModels()).toEqual(["a/one", "b/two"]);
  });
});

describe("aiText", () => {
  test("returns the answer and which model produced it", async () => {
    process.env.OPENROUTER_API_KEY = "sk-a";
    process.env.OPENROUTER_MODELS = "a/one";
    globalThis.fetch = (async () => reply("Two hot roles in Singapore.")) as typeof fetch;
    expect(await aiText("sys", "q")).toEqual({ text: "Two hot roles in Singapore.", model: "a/one" });
  });

  test("falls through to the next model when one fails", async () => {
    process.env.OPENROUTER_API_KEY = "sk-a";
    process.env.OPENROUTER_MODELS = "a/one, b/two";
    const seen: string[] = [];
    globalThis.fetch = (async (_url: string, init: RequestInit) => {
      const model = JSON.parse(String(init.body)).model as string;
      seen.push(model);
      return model === "a/one" ? reply("nope", 429) : reply("ok");
    }) as unknown as typeof fetch;
    expect((await aiText("sys", "q")).model).toBe("b/two");
    expect(seen).toEqual(["a/one", "b/two"]);
  });

  test("falls through to OpenAI when OpenRouter fails", async () => {
    process.env.OPENROUTER_API_KEY = "sk-a";
    process.env.OPENROUTER_MODELS = "a/one";
    process.env.OPENAI_API_KEY = "sk-proj-test";
    const calls: string[] = [];
    globalThis.fetch = (async (url: string) => {
      calls.push(url.toString());
      if (url.toString().includes("openrouter.ai")) {
        return reply("rate limit", 403);
      }
      return reply("OpenAI answer");
    }) as unknown as typeof fetch;
    const result = await aiText("sys", "q");
    expect(result.text).toBe("OpenAI answer");
    expect(result.model).toBe("gpt-4o-mini");
    expect(calls.some((u) => u.includes("api.openai.com"))).toBe(true);
  });

  test("reads the reasoning field when content comes back empty", async () => {
    process.env.OPENROUTER_API_KEY = "sk-a";
    process.env.OPENROUTER_MODELS = "a/one";
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: "", reasoning: "from reasoning" } }] }))) as typeof fetch;
    expect((await aiText("sys", "q")).text).toBe("from reasoning");
  });

  test("throws with the collected errors when every model fails", async () => {
    process.env.OPENROUTER_API_KEY = "sk-a";
    process.env.OPENROUTER_MODELS = "a/one";
    globalThis.fetch = (async () => reply("boom", 500)) as typeof fetch;
    expect(aiText("sys", "q")).rejects.toThrow(/a\/one/);
  });

  test("refuses to call out without a key", () => {
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY_FALLBACK;
    delete process.env.OPENAI_API_KEY;
    expect(aiText("sys", "q")).rejects.toThrow(/OPENROUTER_API_KEY/);
  });
});

