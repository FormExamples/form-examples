import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./UnitedKingdomNationalInsuranceNumberInput.svelte";

describe("UnitedKingdomNationalInsuranceNumberInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "National Insurance Number" } });

        const input = screen.getByLabelText("National Insurance Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "National Insurance Number" } });

        const input = screen.getByLabelText("National Insurance Number");
        expect(input.getAttribute("class")).toContain("united-kingdom-national-insurance-number-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "National Insurance Number" } });

        const input = screen.getByLabelText("National Insurance Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "National Insurance Number" } });

        const input = screen.getByLabelText("National Insurance Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "National Insurance Number", required: true } });

        const input = screen.getByLabelText("National Insurance Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "National Insurance Number" } });

        const input = screen.getByLabelText("National Insurance Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "National Insurance Number", disabled: true } });

        const input = screen.getByLabelText("National Insurance Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "National Insurance Number", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
