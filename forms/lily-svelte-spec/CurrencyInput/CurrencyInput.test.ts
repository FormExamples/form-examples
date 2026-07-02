import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CurrencyInput from "./CurrencyInput.svelte";

describe("CurrencyInput", () => {
    test("renders with content", () => {
        render(CurrencyInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("currency-input");
    });
});
