import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./NetPromoterScorePickerButton.svelte";

describe("NetPromoterScorePickerButton", () => {
  test("renders as a button", () => {
    render(Subject, { props: { value: 9, label: "9" } });
    expect(screen.getByRole("button", { name: "9" })).toBeTruthy();
  });

  test("shows aria-pressed when selected", () => {
    render(Subject, {
      props: { value: 10, label: "10", selected: true },
    });
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  test("shows aria-pressed false when not selected", () => {
    render(Subject, { props: { value: 5, label: "5" } });
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  test("exposes data-value", () => {
    render(Subject, { props: { value: 7, label: "7" } });
    expect(screen.getByRole("button").getAttribute("data-value")).toBe("7");
  });

  test("displays label text", () => {
    render(Subject, { props: { value: 0, label: "0" } });
    expect(screen.getByRole("button").textContent).toContain("0");
  });

  test("handles click", async () => {
    const user: UserEvent = userEvent.setup();
    const fn = vi.fn();
    render(Subject, {
      props: { value: 8, label: "8", onclick: fn },
    });
    await user.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledOnce();
  });

  test("can be disabled", () => {
    render(Subject, {
      props: { value: 0, label: "0", disabled: true },
    });
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { value: 5, label: "5", "data-testid": "nps-btn" },
    });
    expect(screen.getByTestId("nps-btn")).toBeTruthy();
  });
});
