import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./EmailInput.svelte";

describe("EmailInput", () => {
    test("renders an email input", () => {
        render(Subject, { props: { label: "Email" } });
        const input = screen.getByLabelText("Email") as HTMLInputElement;
        expect(input.type).toBe("email");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Your email" } });
        expect(screen.getByLabelText("Your email")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Email", required: true } });
        expect((screen.getByLabelText("Email") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Email", disabled: true } });
        expect((screen.getByLabelText("Email") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Email", "data-testid": "ei" } });
        expect(screen.getByTestId("ei")).toBeTruthy();
    });
});
