import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./PinInputDiv.svelte";

describe("PinInputDiv", () => {
  test("renders a group element with aria-label", () => {
    render(Subject, { props: { label: "Enter PIN" } });

    const group = screen.getByRole("group");
    expect(group.getAttribute("aria-label")).toBe("Enter PIN");
  });

  test("renders 4 digit inputs by default", () => {
    render(Subject, { props: { label: "Enter PIN" } });

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(4);
  });

  test("renders custom number of digit inputs", () => {
    render(Subject, { props: { label: "Enter Code", length: 6 } });

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(6);
  });

  test("each input has numeric inputmode", () => {
    render(Subject, { props: { label: "Enter PIN" } });

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      expect(input.getAttribute("inputmode")).toBe("numeric");
    }
  });

  test("each input has maxlength of 1", () => {
    render(Subject, { props: { label: "Enter PIN" } });

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      expect((input as HTMLInputElement).maxLength).toBe(1);
    }
  });

  test("each input has an accessible digit label", () => {
    render(Subject, { props: { label: "Enter PIN" } });

    expect(screen.getByLabelText("Digit 1 of 4")).toBeTruthy();
    expect(screen.getByLabelText("Digit 2 of 4")).toBeTruthy();
    expect(screen.getByLabelText("Digit 3 of 4")).toBeTruthy();
    expect(screen.getByLabelText("Digit 4 of 4")).toBeTruthy();
  });

  test("digit labels reflect custom length", () => {
    render(Subject, { props: { label: "Enter Code", length: 6 } });

    expect(screen.getByLabelText("Digit 1 of 6")).toBeTruthy();
    expect(screen.getByLabelText("Digit 6 of 6")).toBeTruthy();
  });

  test("all inputs are disabled when disabled prop is true", () => {
    render(Subject, { props: { label: "Enter PIN", disabled: true } });

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      expect((input as HTMLInputElement).disabled).toBe(true);
    }
  });

  test("all inputs are enabled by default", () => {
    render(Subject, { props: { label: "Enter PIN" } });

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      expect((input as HTMLInputElement).disabled).toBe(false);
    }
  });

  test("passes through additional HTML attributes to the group", () => {
    render(Subject, {
      props: { label: "Enter PIN", "data-testid": "pin-group" },
    });

    const group = screen.getByTestId("pin-group");
    expect(group).toBeTruthy();
  });

  test("passes through id attribute to the group", () => {
    render(Subject, { props: { label: "Enter PIN", id: "my-pin" } });

    const group = screen.getByRole("group");
    expect(group.getAttribute("id")).toBe("my-pin");
  });
});
