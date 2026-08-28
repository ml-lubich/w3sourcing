export type AssistantActionType = "hot" | "unhot" | "delete";

export type AssistantAction = {
  type: AssistantActionType;
  refs: string[];
  hot?: boolean; // legacy compatibility
};

/** Leading bullet or quote marks are tolerated: models like to decorate. */
const ACTION_LINE = /^[\s>*-]*ACTION:\s*(HOT|UNHOT|DELETE|REMOVE)\s*(.*)$/im;
const REF = /W3-[A-Z0-9]{4,}/gi;

export function parseAssistantAction(answer: string): {
  text: string;
  action: AssistantAction | undefined;
} {
  const match = answer.match(ACTION_LINE);
  const text = (match ? answer.replace(match[0], "") : answer).trim();
  if (!match) return { text, action: undefined };

  const verb = match[1].toUpperCase();
  const type: AssistantActionType =
    verb === "DELETE" || verb === "REMOVE" ? "delete" : verb === "HOT" ? "hot" : "unhot";
  const refs = [...new Set((match[2].match(REF) ?? []).map((ref) => ref.toUpperCase()))];
  
  return {
    text,
    action: refs.length > 0 ? { type, refs, hot: type === "hot" } : undefined,
  };
}
