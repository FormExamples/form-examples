import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Figure.svelte";
function textSnippet(text: string) {
  return (($anchor: Comment) => {
    $anchor.before(document.createTextNode(text));
  }) as any;
}
describe("Figure", () => {
  test("renders img role", () => {
    render(Subject, {
      props: { label: "Sales", children: textSnippet("bars") },
    });
    expect(screen.getByRole("img")).toBeTruthy();
  });
  test("uses figure element", () => {
    render(Subject, {
      props: { label: "Sales", children: textSnippet("bars") },
    });
    expect(screen.getByRole("img").tagName).toBe("FIGURE");
  });
  test("has aria-label", () => {
    render(Subject, {
      props: { label: "Monthly sales", children: textSnippet("bars") },
    });
    expect(screen.getByLabelText("Monthly sales")).toBeTruthy();
  });
  test("passes through attributes", () => {
    render(Subject, {
      props: { label: "C", "data-testid": "ch", children: textSnippet("x") },
    });
    expect(screen.getByTestId("ch")).toBeTruthy();
  });
});
