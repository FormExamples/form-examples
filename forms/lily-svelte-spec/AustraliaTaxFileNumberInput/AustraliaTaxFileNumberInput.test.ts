import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AustraliaTaxFileNumberInput.svelte";

describe("AustraliaTaxFileNumberInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)" } });

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)" } });

        const input = screen.getByLabelText("Tax File Number (TFN)");
        expect(input.getAttribute("class")).toContain("australia-tax-file-number-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)" } });

        const input = screen.getByLabelText("Tax File Number (TFN)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)" } });

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)", required: true } });

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)" } });

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)", disabled: true } });

        const input = screen.getByLabelText("Tax File Number (TFN)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
