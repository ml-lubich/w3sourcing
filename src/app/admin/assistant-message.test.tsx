import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { AssistantMessage } from "./assistant-message";

describe("AssistantMessage", () => {
  test("renders bold and lists as markup, not asterisks", () => {
    const html = renderToStaticMarkup(
      <AssistantMessage text={"- **Engineering** dominates.\n\n— gpt-4o-mini"} />,
    );
    expect(html).toContain("<strong");
    expect(html).toContain("Engineering");
    expect(html).toContain("<ul");
    expect(html).not.toContain("**");
    expect(html).toContain("gpt-4o-mini");
    expect(html).toContain("assistant-block");
  });
});
