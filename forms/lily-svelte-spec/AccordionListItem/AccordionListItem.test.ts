import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./AccordionListItem.svelte";

function summarySnippet(text: string) {
  return (($anchor: Comment) => {
    const summary = document.createElement("summary");
    summary.textContent = text;
    $anchor.before(summary);
  }) as any;
}

describe("AccordionListItem", () => {
  test("renders a details element", () => {
    render(Subject, {
      props: { "data-testid": "ali", children: summarySnippet("Header") },
    });
    expect(screen.getByTestId("ali").tagName).toBe("DETAILS");
  });

  test("renders children content", () => {
    render(Subject, { props: { children: summarySnippet("Question") } });
    expect(screen.getByText("Question")).toBeTruthy();
  });

  test("is closed by default", () => {
    render(Subject, {
      props: { "data-testid": "ali", children: summarySnippet("Q") },
    });
    expect((screen.getByTestId("ali") as HTMLDetailsElement).open).toBe(false);
  });

  test("supports open prop", () => {
    render(Subject, {
      props: {
        open: true,
        "data-testid": "ali",
        children: summarySnippet("Q"),
      },
    });
    expect((screen.getByTestId("ali") as HTMLDetailsElement).open).toBe(true);
  });

  test("toggles on summary click", async () => {
    const user = userEvent.setup();
    render(Subject, {
      props: { "data-testid": "ali", children: summarySnippet("Click me") },
    });
    const summary = screen.getByText("Click me");
    await user.click(summary);
    await vi.waitFor(() => {
      expect((screen.getByTestId("ali") as HTMLDetailsElement).open).toBe(true);
    });
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { "data-testid": "item", children: summarySnippet("Q") },
    });
    expect(screen.getByTestId("item")).toBeTruthy();
  });
});
