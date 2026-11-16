import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import type { Component } from "svelte";

import Tested from "./PasswordInputOrTextInputDiv.svelte";

// These tests leave required props out on purpose, to prove what the component does then.
const Subject = Tested as unknown as Component<Record<string, unknown>>;

describe("PasswordInputOrTextInputDiv", () => {
    test("renders a password input", () => {
        render(Subject, { props: { label: "Password" } });
        const input = screen.getByLabelText("Password") as HTMLInputElement;
        expect(input.type).toBe("password");
    });

    test("has toggle button", () => {
        render(Subject, { props: { label: "Password", toggleLabel: "Show password" } });
        expect(screen.getByRole("button", { name: "Show password" })).toBeTruthy();
    });

    test("toggle reveals password", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Password" } });
        await user.click(screen.getByRole("button"));
        expect((screen.getByLabelText("Password") as HTMLInputElement).type).toBe("text");
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
        expect((screen.getByLabelText("Password") as HTMLInputElement).required).toBe(true);
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

    // Revealed as text, a password would reach an enhanced spellchecker, which can send it to a cloud service.
    test("never spellchecks the password, before or after it is revealed", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Password", toggleLabel: "Show password" } });
        const input = screen.getByLabelText("Password") as HTMLInputElement;
        expect(input.getAttribute("spellcheck")).toBe("false");
        await user.click(screen.getByRole("button", { name: "Show password" }));
        expect(input.type).toBe("text");
        expect(input.getAttribute("spellcheck")).toBe("false");
    });
});
