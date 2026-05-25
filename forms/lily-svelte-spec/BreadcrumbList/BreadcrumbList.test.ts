import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./BreadcrumbList.svelte";

function textSnippet(text: string) {
  return (($anchor: Comment) => {
    const node = document.createTextNode(text);
    $anchor.before(node);
  }) as any;
}

function itemsSnippet() {
  return (($anchor: Comment) => {
    const li1 = document.createElement("li");
    li1.textContent = "Home";
    const li2 = document.createElement("li");
    li2.textContent = "About";
    $anchor.before(li1, li2);
  }) as any;
}

describe("BreadcrumbList", () => {
  test("renders an ordered list", () => {
    render(Subject, { props: { children: textSnippet("items") } });
    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  test("renders children inside the list", () => {
    render(Subject, { props: { children: itemsSnippet() } });
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("About")).toBeTruthy();
  });

  test("renders list items", () => {
    render(Subject, { props: { children: itemsSnippet() } });
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { "data-testid": "bcl", children: textSnippet("x") },
    });
    expect(screen.getByTestId("bcl")).toBeTruthy();
  });
});
