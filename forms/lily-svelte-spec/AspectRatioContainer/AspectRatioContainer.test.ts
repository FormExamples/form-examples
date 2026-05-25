import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AspectRatioContainer.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
  return (($$anchor: Comment) => {
    const node = document.createTextNode(text);
    $$anchor.before(node);
  }) as any;
}

describe("AspectRatioContainer", () => {
  test("renders children content", () => {
    render(Subject, {
      props: {
        children: textSnippet("Hello"),
      },
    });

    expect(screen.getByText("Hello")).toBeTruthy();
  });

  test("defaults to ratio 1", () => {
    render(Subject, {
      props: {
        "data-testid": "ar",
        children: textSnippet("Square"),
      },
    });

    const container: HTMLElement = screen.getByTestId("ar");
    expect(container.getAttribute("data-aspect-ratio-container")).toBe("1");
  });

  test("applies custom ratio", () => {
    const ratio = 16 / 9;
    render(Subject, {
      props: {
        ratio,
        "data-testid": "ar",
        children: textSnippet("Widescreen"),
      },
    });

    const container: HTMLElement = screen.getByTestId("ar");
    expect(container.getAttribute("data-aspect-ratio-container")).toBe(
      String(ratio),
    );
  });

  test("sets aspect-ratio-container style", () => {
    render(Subject, {
      props: {
        ratio: 4 / 3,
        "data-testid": "ar",
        children: textSnippet("Content"),
      },
    });

    const container: HTMLElement = screen.getByTestId("ar");
    expect(container.style.aspectRatio).toBeTruthy();
  });

  test("passes through additional HTML attributes", () => {
    render(Subject, {
      props: {
        id: "my-aspect",
        "data-testid": "ar",
        children: textSnippet("Content"),
      },
    });

    const container: HTMLElement = screen.getByTestId("ar");
    expect(container.getAttribute("id")).toBe("my-aspect");
  });
});
