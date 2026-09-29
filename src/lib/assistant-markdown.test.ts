import { describe, expect, test } from "bun:test";

import { assistantBlocks } from "./assistant-markdown";

const SAMPLE = `The job board currently has a total of 148 roles, all marked as hot. Key highlights include:

- **Engineering** dominates with 86 roles.
- **Legal** follows with 19 roles.
- **Locations**:
  - San Francisco leads with 57 roles.
  - New York has 39 roles.

Recent hot roles include:
- W3-I6CTBM: Forward Deployed Machine Learning Engineer.

— gpt-4o-mini`;

describe("assistantBlocks", () => {
  test("turns bold and bullets into structure, with no raw markdown markers", () => {
    const blocks = assistantBlocks(SAMPLE);
    const serialized = JSON.stringify(blocks);
    expect(serialized).not.toContain("**");
    expect(serialized).not.toContain("\\n- ");

    const paragraph = blocks.find((block) => block.kind === "p");
    expect(paragraph?.kind).toBe("p");
    if (paragraph?.kind !== "p") return;
    expect(paragraph.inlines.some((run) => run.kind === "text" && run.text.includes("148 roles"))).toBe(
      true,
    );

    const list = blocks.find((block) => block.kind === "ul");
    expect(list?.kind).toBe("ul");
    if (list?.kind !== "ul") return;
    expect(list.items[0]?.inlines).toEqual([
      { kind: "strong", text: "Engineering" },
      { kind: "text", text: " dominates with 86 roles." },
    ]);
    const locations = list.items.find((item) =>
      item.inlines.some((run) => run.kind === "strong" && run.text === "Locations"),
    );
    expect(locations?.children.map((child) => child.inlines.map((run) => run.text).join(""))).toEqual([
      "San Francisco leads with 57 roles.",
      "New York has 39 roles.",
    ]);
  });

  test("keeps the model credit as a note, not a bullet", () => {
    const note = assistantBlocks(SAMPLE).find((block) => block.kind === "note");
    expect(note).toEqual({ kind: "note", text: "gpt-4o-mini" });
  });

  test("leaves html as text so a reply cannot inject markup", () => {
    const blocks = assistantBlocks("See <script>alert(1)</script> and **ok**.");
    const paragraph = blocks[0];
    expect(paragraph?.kind).toBe("p");
    if (paragraph?.kind !== "p") return;
    expect(paragraph.inlines.map((run) => run.text).join("")).toContain("<script>alert(1)</script>");
  });
});
