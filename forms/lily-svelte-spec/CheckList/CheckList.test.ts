import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CheckList.svelte";

function textSnippet(text: string) {
  return (($$anchor: Comment) => {
    const node = document.createTextNode(text);
    $$anchor.before(node);
  }) as any;
}

describe("CheckList", () => {
  test("renders as a list", () => {
    render(Subject, {
      props: { label: "Tasks", children: textSnippet("Items") },
    });
    expect(screen.getByRole("list", { name: "Tasks" })).toBeTruthy();
  });

  test("renders children", () => {
    render(Subject, { props: { children: textSnippet("Task 1") } });
    expect(screen.getByRole("list").textContent).toContain("Task 1");
  });

  test("applies aria-label", () => {
    render(Subject, {
      props: { label: "Onboarding", children: textSnippet("Items") },
    });
    expect(screen.getByRole("list").getAttribute("aria-label")).toBe(
      "Onboarding",
    );
  });

  test("passes through additional HTML attributes", () => {
    render(Subject, {
      props: { "data-testid": "cl", children: textSnippet("Items") },
    });
    expect(screen.getByTestId("cl")).toBeTruthy();
  });
});
