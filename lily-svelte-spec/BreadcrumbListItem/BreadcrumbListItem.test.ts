import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./BreadcrumbListItem.svelte";

function textSnippet(text: string) {
  return (($anchor: Comment) => {
    const node = document.createTextNode(text);
    $anchor.before(node);
  }) as any;
}

describe("BreadcrumbListItem", () => {
  test("renders a list item", () => {
    render(Subject, {
      props: { "data-testid": "bli", children: textSnippet("Home") },
    });
    expect(screen.getByTestId("bli").tagName).toBe("LI");
  });

  test("renders children", () => {
    render(Subject, { props: { children: textSnippet("About") } });
    expect(screen.getByText("About")).toBeTruthy();
  });

  test("sets aria-current for current page", () => {
    render(Subject, {
      props: {
        current: true,
        "data-testid": "c",
        children: textSnippet("Here"),
      },
    });
    expect(screen.getByTestId("c").getAttribute("aria-current")).toBe("page");
  });

  test("no aria-current when not current", () => {
    render(Subject, {
      props: { "data-testid": "nc", children: textSnippet("Link") },
    });
    expect(screen.getByTestId("nc").getAttribute("aria-current")).toBeNull();
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { "data-testid": "item", children: textSnippet("X") },
    });
    expect(screen.getByTestId("item")).toBeTruthy();
  });
});
