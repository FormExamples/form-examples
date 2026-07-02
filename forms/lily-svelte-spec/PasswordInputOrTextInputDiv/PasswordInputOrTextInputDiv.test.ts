import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./PasswordInputOrTextInputDiv.svelte";

describe("PasswordInputOrTextInputDiv", () => {
  test("renders a password input", () => {
    render(Subject, { props: { label: "Password" } });
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
  });

  test("has toggle button", () => {
    render(Subject, { props: { label: "Password" } });
    expect(screen.getByRole("button", { name: "Show password" })).toBeTruthy();
  });

  test("toggle reveals password", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Password" } });
    await user.click(screen.getByRole("button"));
    expect((screen.getByLabelText("Password") as HTMLInputElement).type).toBe(
      "text",
    );
  });

  test("toggle has aria-pressed", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Password" } });
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-pressed")).toBe("false");
    await user.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });

  test("hides toggle when showToggle is false", () => {
    render(Subject, { props: { label: "Password", showToggle: false } });
    expect(screen.queryByRole("button")).toBeNull();
  });

  test("supports required", () => {
    render(Subject, { props: { label: "Password", required: true } });
    expect(
      (screen.getByLabelText("Password") as HTMLInputElement).required,
    ).toBe(true);
  });

  test("has autocomplete", () => {
    render(Subject, { props: { label: "Password" } });
    expect(screen.getByLabelText("Password").getAttribute("autocomplete")).toBe(
      "current-password",
    );
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "P", "data-testid": "pw" } });
    expect(screen.getByTestId("pw")).toBeTruthy();
  });
});
