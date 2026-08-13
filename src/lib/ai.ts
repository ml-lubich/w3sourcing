/**
 * Server-only OpenRouter client, ported from the candidate portal so both
 * products speak to the same cheap open-weight models with the same keys.
 * Never import this from a client component — it reads the API key.
 */

/** Cheap open models, tried in order until one answers. */
const DEFAULT_MODELS = [
  "qwen/qwen-2.5-7b-instruct",
  "z-ai/glm-4.7-flash",
  "deepseek/deepseek-v4-flash",
];

function keys(): string[] {
  return [process.env.OPENROUTER_API_KEY, process.env.OPENROUTER_API_KEY_FALLBACK].filter(
    (key): key is string => Boolean(key?.trim()),
  );
}

export function aiConfigured(): boolean {
  return keys().length > 0;
}

export function aiModels(): string[] {
  const env = process.env.OPENROUTER_MODELS;
  const custom = env?.split(",").map((model) => model.trim()).filter(Boolean);
  return custom?.length ? custom : DEFAULT_MODELS;
}

async function callModel(model: string, key: string, system: string, user: string, maxTokens: number) {
  const base = process.env.OPENROUTER_BASE_URL?.replace(/\/$/, "") || "https://openrouter.ai/api/v1";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "X-Title": "W3 Sourcing admin",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      // Deterministic: the same board and question give the same answer.
      temperature: 0,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`${model}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  const message = (await res.json())?.choices?.[0]?.message ?? {};
  // Reasoning variants sometimes leave `content` empty and answer in `reasoning`.
  const text = String(message.content || message.reasoning || "").trim();
  if (!text) throw new Error(`${model}: returned an empty answer`);
  return text;
}

/** Ask the model chain a question; the first model that answers wins. */
export async function aiText(
  system: string,
  user: string,
  maxTokens = 900,
): Promise<{ text: string; model: string }> {
  if (!aiConfigured()) throw new Error("OPENROUTER_API_KEY is not set — add it to .env.local.");
  const errors: string[] = [];
  for (const model of aiModels()) {
    for (const key of keys()) {
      try {
        return { text: await callModel(model, key, system, user, maxTokens), model };
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
  }
  throw new Error(`Every model failed — ${errors.join(" | ")}`);
}
