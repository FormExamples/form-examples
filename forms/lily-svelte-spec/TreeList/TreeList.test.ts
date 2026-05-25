import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TreeList.svelte";

function treeItemsSnippet() {
  return (($anchor: Comment) => {
    const li1 = document.createElement("li");
    li1.setAttribute("role", "treeitem");
    li1.setAttribute("tabindex", "-1");
    li1.textContent = "Documents";
    const li2 = document.createElement("li");
    li2.setAttribute("role", "treeitem");
    li2.setAttribute("tabindex", "-1");
    li2.textContent = "Photos";
    $anchor.before(li1, li2);
  }) as any;
}

describe("TreeList", () => {
  test("renders a tree", () => {
    render(Subject, {
      props: { label: "Files", children: treeItemsSnippet() },
    });
    expect(screen.getByRole("tree")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, {
      props: { label: "File browser", children: treeItemsSnippet() },
    });
    expect(screen.getByLabelText("File browser")).toBeTruthy();
  });

  test("renders treeitem children", () => {
    render(Subject, {
      props: { label: "Files", children: treeItemsSnippet() },
    });
    expect(screen.getAllByRole("treeitem").length).toBe(2);
  });

  test("arrow down navigates to next item", () => {
    render(Subject, {
      props: { label: "Files", children: treeItemsSnippet() },
    });
    const items = screen.getAllByRole("treeitem");
    items[0].focus();
    items[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    expect(document.activeElement).toBe(items[1]);
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { label: "F", "data-testid": "tv", children: treeItemsSnippet() },
    });
    expect(screen.getByTestId("tv")).toBeTruthy();
  });
});
