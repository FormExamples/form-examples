import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CurrencyInput from "./CurrencyInput.svelte";

describe("CurrencyInput", () => {
    test("renders an input with the base class", () => {
        render(CurrencyInput, { props: { label: "Test", currencyCode: "EUR" } });
        const el = screen.getByLabelText("Test");
        expect(el.tagName).toBe("INPUT");
        expect(el.getAttribute("class")).toContain("currency-input");
    });

    test("uses type=text and inputmode=decimal", () => {
        render(CurrencyInput, { props: { label: "Test", currencyCode: "EUR" } });
        const el = screen.getByLabelText("Test");
        expect(el.getAttribute("type")).toBe("text");
        expect(el.getAttribute("inputmode")).toBe("decimal");
    });

    test("exposes the currencyCode via data attribute", () => {
        render(CurrencyInput, { props: { label: "Test", currencyCode: "JPY" } });
        expect(screen.getByLabelText("Test").getAttribute("data-currency-code")).toBe("JPY");
    });

    test("never defaults currencyCode (no USD assumed)", () => {
        render(CurrencyInput, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el.hasAttribute("data-currency-code")).toBe(false);
        expect(el.outerHTML).not.toContain("USD");
    });

    test("displays the value prop and parses typed input", async () => {
        render(CurrencyInput, { props: { label: "Test", currencyCode: "EUR", value: 5 } });
        const el = screen.getByLabelText("Test") as HTMLInputElement;
        expect(el.value).toBe("5");
        await fireEvent.input(el, { target: { value: "12.5" } });
        expect(el.value).toBe("12.5");
    });

    test("applies disabled", () => {
        render(CurrencyInput, { props: { label: "Test", currencyCode: "EUR", disabled: true } });
        expect((screen.getByLabelText("Test") as HTMLInputElement).disabled).toBe(true);
    });
});
