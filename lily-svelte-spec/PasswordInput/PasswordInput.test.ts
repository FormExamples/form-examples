import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PasswordInput.svelte";

describe("PasswordInput", () => {
    test("renders a password input", () => {
        render(Subject, { props: { label: "Password" } });
        const input = screen.getByLabelText("Password") as HTMLInputElement;
        expect(input.type).toBe("password");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Password" } });
        expect(screen.getByLabelText("Password")).toBeTruthy();
    });

    test("has autocomplete current-password by default", () => {
        render(Subject, { props: { label: "Password" } });
        const input = screen.getByLabelText("Password") as HTMLInputElement;
        expect(input.autocomplete).toBe("current-password");
    });

    test("supports custom autocomplete", () => {
        render(Subject, { props: { label: "Password", autocomplete: "new-password" } });
        const input = screen.getByLabelText("Password") as HTMLInputElement;
        expect(input.autocomplete).toBe("new-password");
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Password", required: true } });
        expect((screen.getByLabelText("Password") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Password", disabled: true } });
        expect((screen.getByLabelText("Password") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Password", "data-testid": "pi" } });
        expect(screen.getByTestId("pi")).toBeTruthy();
    });
});
