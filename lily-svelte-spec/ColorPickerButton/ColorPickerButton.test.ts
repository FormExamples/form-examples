import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ColorPickerButton.svelte";

describe("ColorPickerButton", () => {
  test("renders as a button", () => {
    render(Subject, { props: { color: "#ff0000", label: "Red" } });
    expect(screen.getByRole("button", { name: "Red" })).toBeTruthy();
  });

  test("shows aria-pressed when selected", () => {
    render(Subject, {
      props: { color: "#ff0000", label: "Red", selected: true },
    });
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  test("exposes data-color", () => {
    render(Subject, { props: { color: "#00ff00", label: "Green" } });
    expect(screen.getByRole("button").getAttribute("data-color")).toBe(
      "#00ff00",
    );
  });

  test("handles click", async () => {
    const user: UserEvent = userEvent.setup();
    const fn = vi.fn();
    render(Subject, {
      props: { color: "#0000ff", label: "Blue", onclick: fn },
    });
    await user.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledOnce();
  });

  test("can be disabled", () => {
    render(Subject, {
      props: { color: "#000", label: "Black", disabled: true },
    });
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  test("is focusable", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { color: "#fff", label: "White" } });
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button"));
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { color: "#000", label: "Test", "data-testid": "sw" },
    });
    expect(screen.getByTestId("sw")).toBeTruthy();
  });
});
