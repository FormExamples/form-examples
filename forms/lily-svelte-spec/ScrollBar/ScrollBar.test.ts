import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollBar.svelte";

function textSnippet(text: string) {
  return (($anchor: Comment) => {
    const node = document.createTextNode(text);
    $anchor.before(node);
  }) as any;
}

describe("ScrollBar", () => {
  test("renders a scrollbar", () => {
    render(Subject, {
      props: { label: "Scroll", children: textSnippet("thumb") },
    });
    expect(screen.getByRole("scrollbar")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, {
      props: { label: "Page scroll", children: textSnippet("thumb") },
    });
    expect(screen.getByLabelText("Page scroll")).toBeTruthy();
  });

  test("defaults to vertical orientation", () => {
    render(Subject, {
      props: { label: "Scroll", children: textSnippet("thumb") },
    });
    expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe(
      "vertical",
    );
  });

  test("supports horizontal orientation", () => {
    render(Subject, {
      props: {
        label: "Scroll",
        orientation: "horizontal",
        children: textSnippet("thumb"),
      },
    });
    expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe(
      "horizontal",
    );
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { label: "S", "data-testid": "sb", children: textSnippet("x") },
    });
    expect(screen.getByTestId("sb")).toBeTruthy();
  });
});
