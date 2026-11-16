import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./HangukJuminDeungnokBeonhoInput.svelte";

describe("HangukJuminDeungnokBeonhoInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Resident Registration Number (주민등록번호)" } });

        const input = screen.getByLabelText(
            "Resident Registration Number (주민등록번호)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Resident Registration Number (주민등록번호)" } });

        const input = screen.getByLabelText("Resident Registration Number (주민등록번호)");
        expect(input.getAttribute("class")).toContain("hanguk-jumin-deungnok-beonho-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Resident Registration Number (주민등록번호)" } });

        const input = screen.getByLabelText("Resident Registration Number (주민등록번호)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Resident Registration Number (주민등록번호)" } });

        const input = screen.getByLabelText(
            "Resident Registration Number (주민등록번호)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, {
            props: { label: "Resident Registration Number (주민등록번호)", required: true },
        });

        const input = screen.getByLabelText(
            "Resident Registration Number (주민등록번호)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Resident Registration Number (주민등록번호)" } });

        const input = screen.getByLabelText(
            "Resident Registration Number (주민등록번호)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, {
            props: { label: "Resident Registration Number (주민등록번호)", disabled: true },
        });

        const input = screen.getByLabelText(
            "Resident Registration Number (주민등록번호)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: {
                label: "Resident Registration Number (주민등록번호)",
                "data-testid": "subject",
            },
        });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
