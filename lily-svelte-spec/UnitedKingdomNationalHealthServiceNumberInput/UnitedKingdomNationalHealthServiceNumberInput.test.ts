import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./UnitedKingdomNationalHealthServiceNumberInput.svelte";

describe("UnitedKingdomNationalHealthServiceNumberInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "NHS Number" } });

        const input = screen.getByLabelText("NHS Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has numeric inputmode", () => {
        render(Subject, { props: { label: "NHS Number" } });

        const input = screen.getByLabelText("NHS Number");
        expect(input.getAttribute("inputmode")).toBe("numeric");
    });

    test("has the correct pattern for NHS number format", () => {
        render(Subject, { props: { label: "NHS Number" } });

        const input = screen.getByLabelText("NHS Number");
        expect(input.getAttribute("pattern")).toBe("[0-9]{3} [0-9]{3} [0-9]{4}");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "NHS Number" } });

        const input = screen.getByLabelText("NHS Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "NHS Number" } });

        const input = screen.getByLabelText("NHS Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "NHS Number", required: true } });

        const input = screen.getByLabelText("NHS Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "NHS Number" } });

        const input = screen.getByLabelText("NHS Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "NHS Number", disabled: true } });

        const input = screen.getByLabelText("NHS Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "NHS Number", "data-testid": "nhs-input" } });

        const input = screen.getByTestId("nhs-input");
        expect(input).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { label: "NHS Number", id: "nhs-field" } });

        const input = screen.getByLabelText("NHS Number");
        expect(input.getAttribute("id")).toBe("nhs-field");
    });
});
