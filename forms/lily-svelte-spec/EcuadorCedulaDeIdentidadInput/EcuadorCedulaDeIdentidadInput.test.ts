import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./EcuadorCedulaDeIdentidadInput.svelte";

describe("EcuadorCedulaDeIdentidadInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number" } });

        const input = screen.getByLabelText("Cedula de Identidad Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number" } });

        const input = screen.getByLabelText("Cedula de Identidad Number");
        expect(input.getAttribute("class")).toContain("ecuador-cedula-de-identidad-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number" } });

        const input = screen.getByLabelText("Cedula de Identidad Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number" } });

        const input = screen.getByLabelText("Cedula de Identidad Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number", required: true } });

        const input = screen.getByLabelText("Cedula de Identidad Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number" } });

        const input = screen.getByLabelText("Cedula de Identidad Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number", disabled: true } });

        const input = screen.getByLabelText("Cedula de Identidad Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Cedula de Identidad Number", "data-testid": "subject" },
        });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
