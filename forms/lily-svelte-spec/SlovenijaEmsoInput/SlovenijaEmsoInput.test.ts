import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SlovenijaEmsoInput.svelte";

describe("SlovenijaEmsoInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number" } });

        const input = screen.getByLabelText("Unique Master Citizen Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number" } });

        const input = screen.getByLabelText("Unique Master Citizen Number");
        expect(input.getAttribute("class")).toContain("slovenija-emso-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number" } });

        const input = screen.getByLabelText("Unique Master Citizen Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number" } });

        const input = screen.getByLabelText("Unique Master Citizen Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number", required: true } });

        const input = screen.getByLabelText("Unique Master Citizen Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number" } });

        const input = screen.getByLabelText("Unique Master Citizen Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number", disabled: true } });

        const input = screen.getByLabelText("Unique Master Citizen Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
