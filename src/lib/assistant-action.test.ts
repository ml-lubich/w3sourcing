import { describe, expect, test } from "bun:test";

import { parseAssistantAction } from "./assistant-action";

describe("parseAssistantAction", () => {
  test("leaves a plain answer untouched", () => {
    expect(parseAssistantAction("Three roles in Singapore.")).toEqual({
      text: "Three roles in Singapore.",
      action: undefined,
    });
  });

  test("lifts a hot proposal off the end of the answer", () => {
    const { text, action } = parseAssistantAction(
      "These two look strongest.\n\nACTION: HOT W3-AAA111, W3-BBB222",
    );
    expect(text).toBe("These two look strongest.");
    expect(action).toEqual({ hot: true, refs: ["W3-AAA111", "W3-BBB222"] });
  });

  test("reads an unflag proposal the same way", () => {
    expect(parseAssistantAction("Stale.\nACTION: UNHOT w3-ccc333").action).toEqual({
      hot: false,
      refs: ["W3-CCC333"],
    });
  });

  test("ignores an action line with no usable references", () => {
    const { text, action } = parseAssistantAction("Nothing to do.\nACTION: HOT none");
    expect(action).toBeUndefined();
    expect(text).toBe("Nothing to do.");
  });

  test("drops duplicate references", () => {
    expect(parseAssistantAction("x\nACTION: HOT W3-AAA111, W3-AAA111").action?.refs).toEqual([
      "W3-AAA111",
    ]);
  });

  test("only reads the action line, never refs quoted in the prose", () => {
    const { action } = parseAssistantAction("W3-ZZZ999 is stale.\nACTION: HOT W3-AAA111");
    expect(action?.refs).toEqual(["W3-AAA111"]);
  });
});

describe("parseAssistantAction, decorated output", () => {
  test("still finds the line under a bullet", () => {
    expect(parseAssistantAction("Two picks.\n- ACTION: HOT W3-AAA111").action?.refs).toEqual([
      "W3-AAA111",
    ]);
  });
});
