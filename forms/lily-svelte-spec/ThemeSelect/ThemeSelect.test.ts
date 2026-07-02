import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ThemeSelect.svelte";

function optionsSnippet() {
  return (($anchor: Comment) => {
    const opt1 = document.createElement("option");
    opt1.value = "light";
    opt1.textContent = "Light";
    const opt2 = document.createElement("option");
    opt2.value = "dark";
    opt2.textContent = "Dark";
    $anchor.before(opt1, opt2);
  }) as any;
}

describe("ThemeSelect", () => {
  test("renders a select", () => {
    render(Subject, { props: { label: "Theme", children: optionsSnippet() } });
    expect(screen.getByRole("combobox")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, {
      props: { label: "Choose theme", children: optionsSnippet() },
    });
    expect(screen.getByLabelText("Choose theme")).toBeTruthy();
  });

  test("renders option children", () => {
    render(Subject, { props: { label: "Theme", children: optionsSnippet() } });
    expect(screen.getByText("Light")).toBeTruthy();
    expect(screen.getByText("Dark")).toBeTruthy();
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { label: "T", "data-testid": "tc", children: optionsSnippet() },
    });
    expect(screen.getByTestId("tc")).toBeTruthy();
  });
});
