import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ColorPicker.svelte";

describe("ColorPicker", () => {
  test("renders as a slider", () => {
    render(Subject, { props: { label: "Color board" } });
    expect(screen.getByRole("slider", { name: "Color board" })).toBeTruthy();
  });

  test("defaults to x=0 y=0", () => {
    render(Subject, { props: { label: "Board" } });
    const el = screen.getByRole("slider");
    expect(el.getAttribute("data-x")).toBe("0");
    expect(el.getAttribute("data-y")).toBe("0");
  });

  test("accepts initial x and y", () => {
    render(Subject, { props: { label: "Board", x: 50, y: 75 } });
    const el = screen.getByRole("slider");
    expect(el.getAttribute("data-x")).toBe("50");
    expect(el.getAttribute("data-y")).toBe("75");
  });

  test("moves right with ArrowRight", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Board", x: 50, y: 50 } });
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("slider").getAttribute("data-x")).toBe("51");
  });

  test("clamps at boundaries", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Board", x: 0, y: 0 } });
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("slider").getAttribute("data-x")).toBe("0");
  });

  test("is focusable", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Board" } });
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("slider"));
  });

  test("can be disabled", () => {
    render(Subject, { props: { label: "Board", disabled: true } });
    expect(screen.getByRole("slider").getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "Board", "data-testid": "cpb" } });
    expect(screen.getByTestId("cpb")).toBeTruthy();
  });
});
