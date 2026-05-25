import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ProgressCircle.svelte";

function textSnippet(text: string) {
  return (($$anchor: Comment) => {
    const node = document.createTextNode(text);
    $$anchor.before(node);
  }) as any;
}

describe("ProgressCircle", () => {
  test("renders with Progress role", () => {
    render(Subject, { props: { label: "Loading" } });
    expect(screen.getByRole("Progress")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, { props: { label: "Upload progress" } });
    expect(screen.getByLabelText("Upload progress")).toBeTruthy();
  });

  test("sets aria-valuenow", () => {
    render(Subject, { props: { label: "P", value: 75 } });
    expect(screen.getByRole("Progress").getAttribute("aria-valuenow")).toBe(
      "75",
    );
  });

  test("sets aria-valuemin and aria-valuemax", () => {
    render(Subject, { props: { label: "P", min: 0, max: 200 } });
    const el = screen.getByRole("Progress");
    expect(el.getAttribute("aria-valuemin")).toBe("0");
    expect(el.getAttribute("aria-valuemax")).toBe("200");
  });

  test("renders children", () => {
    render(Subject, { props: { label: "P", children: textSnippet("75%") } });
    expect(screen.getByRole("Progress").textContent).toContain("75%");
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "P", "data-testid": "pc" } });
    expect(screen.getByTestId("pc")).toBeTruthy();
  });
});
