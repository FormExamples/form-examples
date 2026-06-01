import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./RedAmberGreenView.svelte";

describe("RedAmberGreenView", () => {
  test("renders a span element", () => {
    render(Subject, { props: { label: "Status" } });

    const el = screen.getByLabelText("Status");
    expect(el.tagName).toBe("SPAN");
  });

  test("has aria-label from label prop", () => {
    render(Subject, { props: { label: "Status" } });

    const el = screen.getByLabelText("Status");
    expect(el.getAttribute("aria-label")).toBe("Status");
  });

  test("displays the value as text", () => {
    render(Subject, { props: { label: "Status", value: "green" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("green");
  });

  test("displays red status", () => {
    render(Subject, { props: { label: "Status", value: "red" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("red");
  });

  test("displays amber status", () => {
    render(Subject, { props: { label: "Status", value: "amber" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("amber");
  });

  test("defaults to empty string when no value provided", () => {
    render(Subject, { props: { label: "Status" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("");
  });

  test("passes through additional HTML attributes", () => {
    render(Subject, { props: { label: "S", "data-testid": "rag-view" } });

    expect(screen.getByTestId("rag-view")).toBeTruthy();
  });
});
