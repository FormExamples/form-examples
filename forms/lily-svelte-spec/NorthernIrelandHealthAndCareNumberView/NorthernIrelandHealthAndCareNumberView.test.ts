import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NorthernIrelandHealthAndCareNumberView from "./NorthernIrelandHealthAndCareNumberView.svelte";

describe("NorthernIrelandHealthAndCareNumberView", () => {
    test("renders with content", () => {
        render(NorthernIrelandHealthAndCareNumberView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("northern-ireland-health-and-care-number-view");
    });
});
