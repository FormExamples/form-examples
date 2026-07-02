import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TourListItem.svelte";

function textSnippet(text: string) {
  return (($anchor: Comment) => {
    const node = document.createTextNode(text);
    $anchor.before(node);
  }) as any;
}

describe("TourListItem", () => {
  test("renders with role group", () => {
    render(Subject, {
      props: {
        label: "Welcome",
        current: true,
        children: textSnippet("Step content"),
      },
    });
    expect(screen.getByRole("group")).toBeTruthy();
  });

  test("renders children content", () => {
    render(Subject, {
      props: {
        label: "Welcome",
        current: true,
        children: textSnippet("Hello world"),
      },
    });
    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, {
      props: {
        label: "Welcome step",
        current: true,
        children: textSnippet("content"),
      },
    });
    expect(screen.getByLabelText("Welcome step")).toBeTruthy();
  });

  test("has aria-roledescription step", () => {
    render(Subject, {
      props: {
        label: "Welcome",
        current: true,
        children: textSnippet("content"),
      },
    });
    const el = screen.getByRole("group");
    expect(el.getAttribute("aria-roledescription")).toBe("step");
  });

  test("has aria-current=step when current", () => {
    render(Subject, {
      props: {
        label: "Welcome",
        current: true,
        children: textSnippet("content"),
      },
    });
    const el = screen.getByRole("group");
    expect(el.getAttribute("aria-current")).toBe("step");
  });

  test("hidden when not current", () => {
    render(Subject, {
      props: {
        label: "Welcome",
        current: false,
        children: textSnippet("content"),
      },
    });
    const el = document.querySelector("[aria-roledescription='step']");
    expect(el).toBeTruthy();
    expect(el!.getAttribute("aria-hidden")).toBe("true");
    expect((el as HTMLElement).hidden).toBe(true);
  });

  test("not hidden when current", () => {
    render(Subject, {
      props: {
        label: "Welcome",
        current: true,
        children: textSnippet("content"),
      },
    });
    const el = screen.getByRole("group");
    expect(el.getAttribute("aria-hidden")).toBeNull();
    expect((el as HTMLElement).hidden).toBe(false);
  });

  test("includes step progress in label", () => {
    render(Subject, {
      props: {
        label: "Features",
        current: true,
        stepNumber: 2,
        totalSteps: 5,
        children: textSnippet("content"),
      },
    });
    expect(screen.getByLabelText("Features (Step 2 of 5)")).toBeTruthy();
  });

  test("label without step numbers when not provided", () => {
    render(Subject, {
      props: {
        label: "Intro",
        current: true,
        children: textSnippet("content"),
      },
    });
    expect(screen.getByLabelText("Intro")).toBeTruthy();
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: {
        label: "Step",
        current: true,
        "data-testid": "tour-step",
        children: textSnippet("content"),
      },
    });
    expect(screen.getByTestId("tour-step")).toBeTruthy();
  });

  test("defaults current to false", () => {
    render(Subject, {
      props: {
        label: "Step",
        children: textSnippet("content"),
      },
    });
    const el = document.querySelector("[aria-roledescription='step']");
    expect(el).toBeTruthy();
    expect((el as HTMLElement).hidden).toBe(true);
  });
});
