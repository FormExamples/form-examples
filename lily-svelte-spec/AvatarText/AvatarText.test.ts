import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AvatarText.svelte";

function textSnippet(text: string) {
  return (($anchor: Comment) => {
    const node = document.createTextNode(text);
    $anchor.before(node);
  }) as any;
}

describe("AvatarText", () => {
  test("renders a span element", () => {
    render(Subject, {
      props: { "data-testid": "act", children: textSnippet("JD") },
    });
    expect(screen.getByTestId("act").tagName).toBe("SPAN");
  });

  test("renders children text", () => {
    render(Subject, { props: { children: textSnippet("AB") } });
    expect(screen.getByText("AB")).toBeTruthy();
  });

  test("is aria-hidden", () => {
    render(Subject, {
      props: { "data-testid": "act", children: textSnippet("JD") },
    });
    expect(screen.getByTestId("act").getAttribute("aria-hidden")).toBe("true");
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { "data-testid": "initials", children: textSnippet("X") },
    });
    expect(screen.getByTestId("initials")).toBeTruthy();
  });
});
