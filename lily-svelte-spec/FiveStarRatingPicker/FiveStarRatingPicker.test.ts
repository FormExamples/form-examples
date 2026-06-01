import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./FiveStarRatingPicker.svelte";

describe("FiveStarRatingPicker", () => {
  test("renders as a radiogroup", () => {
    render(Subject, { props: { label: "Rating" } });
    expect(screen.getByRole("radiogroup", { name: "Rating" })).toBeTruthy();
  });

  test("has 5 radio buttons", () => {
    render(Subject, { props: { label: "Rating" } });
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  test("clicking a star selects it", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Rating" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[2]);
    expect(radios[2].checked).toBe(true);
  });

  test("supports disabled", () => {
    render(Subject, {
      props: { label: "Rating", disabled: true, "data-testid": "r" },
    });
    expect((screen.getByTestId("r") as HTMLFieldSetElement).disabled).toBe(
      true,
    );
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "Rating", "data-testid": "r" } });
    expect(screen.getByTestId("r")).toBeTruthy();
  });
});
