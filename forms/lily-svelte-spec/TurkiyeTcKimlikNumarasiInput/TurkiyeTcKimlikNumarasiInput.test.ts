import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TurkiyeTcKimlikNumarasiInput.svelte";

describe("TurkiyeTcKimlikNumarasiInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "T.C. Kimlik Numarası" } });

        const input = screen.getByLabelText("T.C. Kimlik Numarası") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "T.C. Kimlik Numarası" } });

        const input = screen.getByLabelText("T.C. Kimlik Numarası");
        expect(input.getAttribute("class")).toContain("turkiye-tc-kimlik-numarasi-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "T.C. Kimlik Numarası" } });

        const input = screen.getByLabelText("T.C. Kimlik Numarası");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "T.C. Kimlik Numarası" } });

        const input = screen.getByLabelText("T.C. Kimlik Numarası") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "T.C. Kimlik Numarası", required: true } });

        const input = screen.getByLabelText("T.C. Kimlik Numarası") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "T.C. Kimlik Numarası" } });

        const input = screen.getByLabelText("T.C. Kimlik Numarası") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "T.C. Kimlik Numarası", disabled: true } });

        const input = screen.getByLabelText("T.C. Kimlik Numarası") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "T.C. Kimlik Numarası", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
