import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./UnitedStatesSocialSecurityNumberInput.svelte";

describe("UnitedStatesSocialSecurityNumberInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "SSN" } });

        const input = screen.getByLabelText("SSN") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has numeric inputmode", () => {
        render(Subject, { props: { label: "SSN" } });

        const input = screen.getByLabelText("SSN");
        expect(input.getAttribute("inputmode")).toBe("numeric");
    });

    test("has the correct pattern for SSN format", () => {
        render(Subject, { props: { label: "SSN" } });

        const input = screen.getByLabelText("SSN");
        expect(input.getAttribute("pattern")).toBe("[0-9]{3}-[0-9]{2}-[0-9]{4}");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "SSN" } });

        const input = screen.getByLabelText("SSN");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "SSN" } });

        const input = screen.getByLabelText("SSN") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "SSN", required: true } });

        const input = screen.getByLabelText("SSN") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "SSN" } });

        const input = screen.getByLabelText("SSN") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "SSN", disabled: true } });

        const input = screen.getByLabelText("SSN") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "SSN", "data-testid": "ssn-input" } });

        const input = screen.getByTestId("ssn-input");
        expect(input).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { label: "SSN", id: "ssn-field" } });

        const input = screen.getByLabelText("SSN");
        expect(input.getAttribute("id")).toBe("ssn-field");
    });
});
