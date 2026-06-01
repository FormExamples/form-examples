import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./RedAmberGreenPickerButton.svelte";

describe("RedAmberGreenPickerButton", () => {
  test("renders as a button", () => {
    render(Subject, { props: { value: "red", label: "Red" } });
    expect(screen.getByRole("button", { name: "Red" })).toBeTruthy();
  });

  test("shows aria-pressed when selected", () => {
    render(Subject, {
      props: { value: "green", label: "Green", selected: true },
    });
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  test("shows aria-pressed false when not selected", () => {
    render(Subject, { props: { value: "amber", label: "Amber" } });
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  test("exposes data-value", () => {
    render(Subject, { props: { value: "amber", label: "Amber" } });
    expect(screen.getByRole("button").getAttribute("data-value")).toBe(
      "amber",
    );
  });

  test("displays label text", () => {
    render(Subject, { props: { value: "green", label: "Green" } });
    expect(screen.getByRole("button").textContent).toContain("Green");
  });

  test("handles click", async () => {
    const user: UserEvent = userEvent.setup();
    const fn = vi.fn();
    render(Subject, {
      props: { value: "red", label: "Red", onclick: fn },
    });
    await user.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledOnce();
  });

  test("can be disabled", () => {
    render(Subject, {
      props: { value: "red", label: "Red", disabled: true },
    });
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { value: "red", label: "Red", "data-testid": "rag-btn" },
    });
    expect(screen.getByTestId("rag-btn")).toBeTruthy();
  });
});
