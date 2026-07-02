import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NetPromoterScorePicker.svelte";

describe("NetPromoterScorePicker", () => {
  test("renders a radiogroup", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const group = screen.getByRole("radiogroup");
    expect(group).toBeTruthy();
  });

  test("has aria-label from label prop", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const group = screen.getByRole("radiogroup");
    expect(group.getAttribute("aria-label")).toBe("NPS Rating");
  });

  test("renders 11 radio buttons (0-10)", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBe(11);
  });

  test("each radio has aria-label with its number", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const radios = screen.getAllByRole("radio");
    for (let i = 0; i <= 10; i++) {
      expect(radios[i].getAttribute("aria-label")).toBe(String(i));
    }
  });

  test("radio values range from 0 to 10", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    for (let i = 0; i <= 10; i++) {
      expect(radios[i].value).toBe(String(i));
    }
  });

  test("renders as a fieldset element", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const group = screen.getByRole("radiogroup");
    expect(group.tagName).toBe("FIELDSET");
  });

  test("passes through additional HTML attributes", () => {
    render(Subject, { props: { label: "NPS", "data-testid": "nps-input" } });

    expect(screen.getByTestId("nps-input")).toBeTruthy();
  });

  test("default name attribute is nps", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("nps");
  });

  test("accepts custom name attribute", () => {
    render(Subject, { props: { label: "NPS Rating", name: "score" } });

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("score");
  });
});
