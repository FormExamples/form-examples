import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./DataFilterForm.svelte";

function textSnippet(text: string) {
  return (($$anchor: Comment) => {
    const node = document.createTextNode(text);
    $$anchor.before(node);
  }) as any;
}

function buttonSnippet(label: string, type: string = "submit") {
  return (($$anchor: Comment) => {
    const btn = document.createElement("button");
    btn.type = type;
    btn.textContent = label;
    $$anchor.before(btn);
  }) as any;
}

describe("DataFilterForm", () => {
  test("renders as a search form", () => {
    render(Subject, {
      props: { label: "Filter", children: textSnippet("Controls") },
    });
    expect(screen.getByRole("search", { name: "Filter" })).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, {
      props: { label: "Filter results", children: textSnippet("Controls") },
    });
    expect(screen.getByRole("search").getAttribute("aria-label")).toBe(
      "Filter results",
    );
  });

  test("renders children", () => {
    render(Subject, {
      props: { label: "Filter", children: textSnippet("My controls") },
    });
    expect(screen.getByRole("search").textContent).toContain("My controls");
  });

  test("calls onsubmit and prevents default", async () => {
    const user: UserEvent = userEvent.setup();
    const handleSubmit = vi.fn();
    render(Subject, {
      props: {
        label: "Filter",
        onsubmit: handleSubmit,
        children: buttonSnippet("Apply"),
      },
    });

    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  test("calls onreset when reset", async () => {
    const user: UserEvent = userEvent.setup();
    const handleReset = vi.fn();
    render(Subject, {
      props: {
        label: "Filter",
        onreset: handleReset,
        children: buttonSnippet("Reset", "reset"),
      },
    });

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(handleReset).toHaveBeenCalledOnce();
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: {
        label: "Filter",
        "data-testid": "df",
        children: textSnippet("C"),
      },
    });
    expect(screen.getByTestId("df")).toBeTruthy();
  });
});
