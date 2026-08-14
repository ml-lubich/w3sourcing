/**
 * The admin assistant proposes hot-flag changes by ending its answer with a
 * single `ACTION:` line. Nothing is written from that line — the editor still
 * has to confirm it in the UI — so this only has to lift the proposal out of
 * the prose and hand back clean references.
 */

export type AssistantAction = { hot: boolean; refs: string[] };

/** Leading bullet or quote marks are tolerated: models like to decorate. */
const ACTION_LINE = /^[\s>*-]*ACTION:\s*(HOT|UNHOT)\s*(.*)$/im;
const REF = /W3-[A-Z0-9]{4,}/gi;

export function parseAssistantAction(answer: string): {
  text: string;
  action: AssistantAction | undefined;
} {
  const match = answer.match(ACTION_LINE);
  const text = (match ? answer.replace(match[0], "") : answer).trim();
  if (!match) return { text, action: undefined };

  const refs = [...new Set((match[2].match(REF) ?? []).map((ref) => ref.toUpperCase()))];
  return { text, action: refs.length > 0 ? { hot: match[1].toUpperCase() === "HOT", refs } : undefined };
}
