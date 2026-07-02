import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FiveFaceRatingPickerButton.svelte";

describe("FiveFaceRatingPickerButton", () => {
  test("renders as a button", () => {
    render(Subject, { props: { value: 3, label: "Okay" } });
    expect(screen.getByRole("button", { name: "Okay" })).toBeTruthy();
  });

  test("shows aria-pressed when selected", () => {
    render(Subject, {
      props: { value: 4, label: "Good", selected: true },
    });
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  test("shows aria-pressed false when not selected", () => {
    render(Subject, { props: { value: 2, label: "Bad" } });
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  test("exposes data-value", () => {
    render(Subject, { props: { value: 5, label: "Very good" } });
    expect(screen.getByRole("button").getAttribute("data-value")).toBe("5");
  });

  test("displays label text", () => {
    render(Subject, { props: { value: 1, label: "Very bad" } });
    expect(screen.getByRole("button").textContent).toContain("Very bad");
  });

  test("handles click", async () => {
    const user: UserEvent = userEvent.setup();
    const fn = vi.fn();
    render(Subject, {
      props: { value: 3, label: "Okay", onclick: fn },
    });
    await user.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledOnce();
  });

  test("can be disabled", () => {
    render(Subject, {
      props: { value: 1, label: "Very bad", disabled: true },
    });
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { value: 3, label: "Okay", "data-testid": "face-btn" },
    });
    expect(screen.getByTestId("face-btn")).toBeTruthy();
  });
});
