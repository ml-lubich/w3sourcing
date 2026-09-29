/**
 * The slice of markdown the desk assistant actually writes: paragraphs, bold,
 * and one level of bullets. Returned as data so the page renders text nodes,
 * never HTML from the model.
 */

export type Inline = { kind: "text"; text: string } | { kind: "strong"; text: string };

export type ListItem = { inlines: Inline[]; children: ListItem[] };

export type AssistantBlock =
  | { kind: "p"; inlines: Inline[] }
  | { kind: "ul"; items: ListItem[] }
  | { kind: "note"; text: string };

const BULLET = /^(\s*)[-*]\s+(.*)$/;
const NOTE = /^—\s+(\S.*?)\s*$/;

function inlines(source: string): Inline[] {
  const runs: Inline[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) runs.push({ kind: "text", text: source.slice(cursor, index) });
    runs.push({ kind: "strong", text: match[1] ?? "" });
    cursor = index + match[0].length;
  }
  if (cursor < source.length) runs.push({ kind: "text", text: source.slice(cursor) });
  return runs.length > 0 ? runs : [{ kind: "text", text: "" }];
}

function isNoteLine(line: string, rest: string[]): boolean {
  if (!NOTE.test(line)) return false;
  return rest.every((following) => following.trim() === "");
}

export function assistantBlocks(source: string): AssistantBlock[] {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  const blocks: AssistantBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const note = line.match(NOTE);
    if (note && isNoteLine(line, lines.slice(index + 1))) {
      blocks.push({ kind: "note", text: note[1] ?? "" });
      break;
    }

    if (BULLET.test(line)) {
      const items: ListItem[] = [];
      while (index < lines.length && BULLET.test(lines[index] ?? "")) {
        const match = (lines[index] ?? "").match(BULLET);
        const indent = match?.[1]?.length ?? 0;
        const item: ListItem = { inlines: inlines((match?.[2] ?? "").trim()), children: [] };
        const parent = items.at(-1);
        if (indent >= 2 && parent) parent.children.push(item);
        else items.push(item);
        index += 1;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }

    blocks.push({ kind: "p", inlines: inlines(line.trim()) });
    index += 1;
  }

  return blocks;
}
