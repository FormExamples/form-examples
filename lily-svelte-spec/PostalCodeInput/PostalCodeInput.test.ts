import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PostalCodeInput.svelte";

describe("PostalCodeInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Postal code" } });
        const input = screen.getByLabelText("Postal code") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "ZIP code" } });
        expect(screen.getByLabelText("ZIP code")).toBeTruthy();
    });

    test("has autocomplete postal-code", () => {
        render(Subject, { props: { label: "Postal code" } });
        expect((screen.getByLabelText("Postal code") as HTMLInputElement).autocomplete).toBe("postal-code");
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Postal code", required: true } });
        expect((screen.getByLabelText("Postal code") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Postal code", disabled: true } });
        expect((screen.getByLabelText("Postal code") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Postal code", "data-testid": "pc" } });
        expect(screen.getByTestId("pc")).toBeTruthy();
    });
});
