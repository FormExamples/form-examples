import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AccordionList.svelte";

function textSnippet(text: string) {
  return (($anchor: Comment) => {
    const node = document.createTextNode(text);
    $anchor.before(node);
  }) as any;
}

describe("AccordionList", () => {
  test("renders a group", () => {
    render(Subject, { props: { children: textSnippet("content") } });
    expect(screen.getByRole("group")).toBeTruthy();
  });

  test("has aria-label when provided", () => {
    render(Subject, {
      props: { label: "Questions", children: textSnippet("content") },
    });
    expect(screen.getByLabelText("Questions")).toBeTruthy();
  });

  test("no aria-label when label is empty", () => {
    render(Subject, { props: { children: textSnippet("content") } });
    expect(screen.getByRole("group").getAttribute("aria-label")).toBeNull();
  });

  test("renders children", () => {
    render(Subject, { props: { children: textSnippet("Items here") } });
    expect(screen.getByText("Items here")).toBeTruthy();
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { "data-testid": "al", children: textSnippet("x") },
    });
    expect(screen.getByTestId("al")).toBeTruthy();
  });
});
