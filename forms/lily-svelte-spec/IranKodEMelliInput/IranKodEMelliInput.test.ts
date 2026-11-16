import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./IranKodEMelliInput.svelte";

describe("IranKodEMelliInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)" } });

        const input = screen.getByLabelText("National Code (Kod-e Melli)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)" } });

        const input = screen.getByLabelText("National Code (Kod-e Melli)");
        expect(input.getAttribute("class")).toContain("iran-kod-e-melli-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)" } });

        const input = screen.getByLabelText("National Code (Kod-e Melli)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)" } });

        const input = screen.getByLabelText("National Code (Kod-e Melli)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)", required: true } });

        const input = screen.getByLabelText("National Code (Kod-e Melli)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)" } });

        const input = screen.getByLabelText("National Code (Kod-e Melli)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)", disabled: true } });

        const input = screen.getByLabelText("National Code (Kod-e Melli)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "National Code (Kod-e Melli)", "data-testid": "subject" },
        });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
