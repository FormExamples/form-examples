import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./OsterreichSozialversicherungsnummerInput.svelte";

describe("OsterreichSozialversicherungsnummerInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)" } });

        const input = screen.getByLabelText("Sozialversicherungsnummer (SVNR)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)" } });

        const input = screen.getByLabelText("Sozialversicherungsnummer (SVNR)");
        expect(input.getAttribute("class")).toContain("osterreich-sozialversicherungsnummer-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)" } });

        const input = screen.getByLabelText("Sozialversicherungsnummer (SVNR)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)" } });

        const input = screen.getByLabelText("Sozialversicherungsnummer (SVNR)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)", required: true } });

        const input = screen.getByLabelText("Sozialversicherungsnummer (SVNR)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)" } });

        const input = screen.getByLabelText("Sozialversicherungsnummer (SVNR)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Sozialversicherungsnummer (SVNR)", disabled: true } });

        const input = screen.getByLabelText("Sozialversicherungsnummer (SVNR)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Sozialversicherungsnummer (SVNR)", "data-testid": "subject" },
        });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
