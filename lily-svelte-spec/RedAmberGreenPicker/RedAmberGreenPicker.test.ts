import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./RedAmberGreenPicker.svelte";

describe("RedAmberGreenPicker", () => {
  test("renders a select element", () => {
    render(Subject, { props: { label: "Status" } });

    expect(screen.getByLabelText("Status").tagName).toBe("SELECT");
  });

  test("has aria-label from label prop", () => {
    render(Subject, { props: { label: "Status" } });

    const el = screen.getByLabelText("Status");
    expect(el.getAttribute("aria-label")).toBe("Status");
  });

  test("has three options", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    expect(options.length).toBe(3);
  });

  test("has red option", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    const values = Array.from(options).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(values).toContain("red");
  });

  test("has amber option", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    const values = Array.from(options).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(values).toContain("amber");
  });

  test("has green option", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    const values = Array.from(options).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(values).toContain("green");
  });

  test("passes through additional HTML attributes", () => {
    render(Subject, { props: { label: "S", "data-testid": "rag-select" } });

    expect(screen.getByTestId("rag-select")).toBeTruthy();
  });
});
