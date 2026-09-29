import {
  assistantBlocks,
  type Inline,
  type ListItem,
} from "@/lib/assistant-markdown";

function Runs({ runs }: { runs: Inline[] }) {
  return runs.map((run, index) =>
    run.kind === "strong" ? (
      <strong key={index} className="font-semibold">
        {run.text}
      </strong>
    ) : (
      <span key={index}>{run.text}</span>
    ),
  );
}

function Items({ items, nested = false }: { items: ListItem[]; nested?: boolean }) {
  return (
    <ul className={`list-disc space-y-1 pl-4 ${nested ? "mt-1" : "mt-2"}`}>
      {items.map((item, index) => (
        <li key={index}>
          <Runs runs={item.inlines} />
          {item.children.length > 0 ? <Items items={item.children} nested /> : null}
        </li>
      ))}
    </ul>
  );
}

/** Formatted assistant reply. Blocks ease in; reduced motion shows them at once. */
export function AssistantMessage({ text }: { text: string }) {
  const blocks = assistantBlocks(text);
  const notes = blocks.filter((block) => block.kind === "note");
  const body = blocks.filter((block) => block.kind !== "note");

  return (
    <div className="space-y-2">
      {body.map((block, index) => (
        <div key={index} className="assistant-block" style={{ animationDelay: `${index * 50}ms` }}>
          {block.kind === "p" ? (
            <p>
              <Runs runs={block.inlines} />
            </p>
          ) : block.kind === "ul" ? (
            <Items items={block.items} />
          ) : null}
        </div>
      ))}
      {notes.map((block) =>
        block.kind === "note" ? (
          <p key={block.text} className="pt-1 text-[11px] text-text-secondary">
            {block.text}
          </p>
        ) : null,
      )}
    </div>
  );
}
