import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./LatvijaPersonasKodsInput.svelte";

describe("LatvijaPersonasKodsInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Personal Code" } });

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Personal Code" } });

        const input = screen.getByLabelText("Personal Code");
        expect(input.getAttribute("class")).toContain("latvija-personas-kods-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Personal Code" } });

        const input = screen.getByLabelText("Personal Code");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Personal Code" } });

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Personal Code", required: true } });

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Personal Code" } });

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Personal Code", disabled: true } });

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Personal Code", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
