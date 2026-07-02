import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./EspanaCodigoDeIdentificacionFiscalInput.svelte";

describe("EspanaCodigoDeIdentificacionFiscalInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Tax Identification Code" } });

        const input = screen.getByLabelText("Tax Identification Code") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Tax Identification Code" } });

        const input = screen.getByLabelText("Tax Identification Code");
        expect(input.getAttribute("class")).toContain("espana-codigo-de-identificacion-fiscal-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Tax Identification Code" } });

        const input = screen.getByLabelText("Tax Identification Code");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Tax Identification Code" } });

        const input = screen.getByLabelText("Tax Identification Code") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Tax Identification Code", required: true } });

        const input = screen.getByLabelText("Tax Identification Code") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Tax Identification Code" } });

        const input = screen.getByLabelText("Tax Identification Code") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Tax Identification Code", disabled: true } });

        const input = screen.getByLabelText("Tax Identification Code") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Tax Identification Code", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
