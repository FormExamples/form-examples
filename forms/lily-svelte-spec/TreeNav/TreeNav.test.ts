import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TreeNav.svelte";

function childSnippet() {
  return (($anchor: Comment) => {
    const li1 = document.createElement("li");
    li1.setAttribute("role", "treeitem");
    li1.setAttribute("tabindex", "-1");
    li1.textContent = "Home";
    const li2 = document.createElement("li");
    li2.setAttribute("role", "treeitem");
    li2.setAttribute("tabindex", "-1");
    li2.textContent = "About";
    $anchor.before(li1, li2);
  }) as any;
}

describe("TreeNav", () => {
  test("renders a navigation landmark", () => {
    render(Subject, { props: { label: "Nav", children: childSnippet() } });
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, {
      props: { label: "Navigation", children: childSnippet() },
    });
    expect(screen.getByLabelText("Navigation")).toBeTruthy();
  });

  test("renders children", () => {
    render(Subject, { props: { label: "Nav", children: childSnippet() } });
    expect(screen.getAllByRole("treeitem").length).toBe(2);
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { label: "N", "data-testid": "tm", children: childSnippet() },
    });
    expect(screen.getByTestId("tm")).toBeTruthy();
  });
});
