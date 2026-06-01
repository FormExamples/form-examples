import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./RedOrangeYellowGreenBluePicker.svelte";

describe("RedOrangeYellowGreenBluePicker", () => {
  test("renders a select element", () => {
    render(Subject, { props: { label: "Status" } });

    expect(screen.getByLabelText("Status").tagName).toBe("SELECT");
  });

  test("has aria-label from label prop", () => {
    render(Subject, { props: { label: "Status" } });

    const el = screen.getByLabelText("Status");
    expect(el.getAttribute("aria-label")).toBe("Status");
  });

  test("has five options", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    expect(options.length).toBe(5);
  });

  test("has red option", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    const values = Array.from(options).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(values).toContain("red");
  });

  test("has orange option", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    const values = Array.from(options).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(values).toContain("orange");
  });

  test("has yellow option", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    const values = Array.from(options).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(values).toContain("yellow");
  });

  test("has green option", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    const values = Array.from(options).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(values).toContain("green");
  });

  test("has blue option", () => {
    render(Subject, { props: { label: "Status" } });

    const options = screen.getByLabelText("Status").querySelectorAll("option");
    const values = Array.from(options).map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(values).toContain("blue");
  });

  test("passes through additional HTML attributes", () => {
    render(Subject, { props: { label: "S", "data-testid": "roygb-select" } });

    expect(screen.getByTestId("roygb-select")).toBeTruthy();
  });
});
