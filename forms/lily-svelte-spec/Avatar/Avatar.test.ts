import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Avatar.svelte";

function textSnippet(text: string) {
  return (($anchor: Comment) => {
    const node = document.createTextNode(text);
    $anchor.before(node);
  }) as any;
}

describe("Avatar", () => {
  test("renders with img role", () => {
    render(Subject, {
      props: { alt: "Jane Doe", children: textSnippet("JD") },
    });
    expect(screen.getByRole("img")).toBeTruthy();
  });

  test("has aria-label from alt prop", () => {
    render(Subject, {
      props: { alt: "Jane Doe", children: textSnippet("JD") },
    });
    expect(screen.getByRole("img", { name: "Jane Doe" })).toBeTruthy();
  });

  test("renders children", () => {
    render(Subject, {
      props: { alt: "Jane Doe", children: textSnippet("JD") },
    });
    expect(screen.getByRole("img").textContent).toContain("JD");
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: {
        alt: "User",
        "data-testid": "avatar",
        children: textSnippet("U"),
      },
    });
    expect(screen.getByTestId("avatar")).toBeTruthy();
  });
});
