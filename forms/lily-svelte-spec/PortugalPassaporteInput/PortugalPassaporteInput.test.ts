import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PortugalPassaporteInput.svelte";

describe("PortugalPassaporteInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Portuguese Passport" } });

        const input = screen.getByLabelText("Portuguese Passport") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Portuguese Passport" } });

        const input = screen.getByLabelText("Portuguese Passport");
        expect(input.getAttribute("class")).toContain("portugal-passaporte-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Portuguese Passport" } });

        const input = screen.getByLabelText("Portuguese Passport");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Portuguese Passport" } });

        const input = screen.getByLabelText("Portuguese Passport") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Portuguese Passport", required: true } });

        const input = screen.getByLabelText("Portuguese Passport") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Portuguese Passport" } });

        const input = screen.getByLabelText("Portuguese Passport") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Portuguese Passport", disabled: true } });

        const input = screen.getByLabelText("Portuguese Passport") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Portuguese Passport", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
