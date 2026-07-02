import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./RedOrangeYellowGreenBlueView.svelte";

describe("RedOrangeYellowGreenBlueView", () => {
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

  test("displays red status", () => {
    render(Subject, { props: { label: "Status", value: "red" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("red");
  });

  test("displays orange status", () => {
    render(Subject, { props: { label: "Status", value: "orange" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("orange");
  });

  test("displays yellow status", () => {
    render(Subject, { props: { label: "Status", value: "yellow" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("yellow");
  });

  test("displays green status", () => {
    render(Subject, { props: { label: "Status", value: "green" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("green");
  });

  test("displays blue status", () => {
    render(Subject, { props: { label: "Status", value: "blue" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("blue");
  });

  test("defaults to empty string when no value provided", () => {
    render(Subject, { props: { label: "Status" } });

    const el = screen.getByLabelText("Status");
    expect(el.textContent).toBe("");
  });

  test("passes through additional HTML attributes", () => {
    render(Subject, { props: { label: "S", "data-testid": "roygb-view" } });

    expect(screen.getByTestId("roygb-view")).toBeTruthy();
  });
});
