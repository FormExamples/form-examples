import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MalaysiaKadPengenalanInput.svelte";

describe("MalaysiaKadPengenalanInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)" } });

        const input = screen.getByLabelText("MyKad Number (NRIC)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)" } });

        const input = screen.getByLabelText("MyKad Number (NRIC)");
        expect(input.getAttribute("class")).toContain("malaysia-kad-pengenalan-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)" } });

        const input = screen.getByLabelText("MyKad Number (NRIC)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)" } });

        const input = screen.getByLabelText("MyKad Number (NRIC)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)", required: true } });

        const input = screen.getByLabelText("MyKad Number (NRIC)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)" } });

        const input = screen.getByLabelText("MyKad Number (NRIC)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)", disabled: true } });

        const input = screen.getByLabelText("MyKad Number (NRIC)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "MyKad Number (NRIC)", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
