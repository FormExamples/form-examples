import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NorthernIrelandHealthAndCareNumberInput from "./NorthernIrelandHealthAndCareNumberInput.svelte";

describe("NorthernIrelandHealthAndCareNumberInput", () => {
    test("renders with content", () => {
        render(NorthernIrelandHealthAndCareNumberInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("northern-ireland-health-and-care-number-input");
    });
});
