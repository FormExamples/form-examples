import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FiveStarRatingPickerButton.svelte";

describe("FiveStarRatingPickerButton", () => {
  test("renders as a button", () => {
    render(Subject, { props: { value: 3, label: "3 stars" } });
    expect(screen.getByRole("button", { name: "3 stars" })).toBeTruthy();
  });

  test("shows aria-pressed when selected", () => {
    render(Subject, {
      props: { value: 4, label: "4 stars", selected: true },
    });
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  test("shows aria-pressed false when not selected", () => {
    render(Subject, { props: { value: 2, label: "2 stars" } });
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  test("exposes data-value", () => {
    render(Subject, { props: { value: 5, label: "5 stars" } });
    expect(screen.getByRole("button").getAttribute("data-value")).toBe("5");
  });

  test("displays label text", () => {
    render(Subject, { props: { value: 1, label: "1 star" } });
    expect(screen.getByRole("button").textContent).toContain("1 star");
  });

  test("handles click", async () => {
    const user: UserEvent = userEvent.setup();
    const fn = vi.fn();
    render(Subject, {
      props: { value: 3, label: "3 stars", onclick: fn },
    });
    await user.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledOnce();
  });

  test("can be disabled", () => {
    render(Subject, {
      props: { value: 1, label: "1 star", disabled: true },
    });
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { value: 3, label: "3 stars", "data-testid": "star-btn" },
    });
    expect(screen.getByTestId("star-btn")).toBeTruthy();
  });
});
