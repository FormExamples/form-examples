import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MaltaNationalIdentificationNumberView.svelte";

describe("MaltaNationalIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Malta National Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Malta National Identification Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("malta-national-identification-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Malta National Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Malta National Identification Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Malta National Identification Number" } });

        const el = screen.getByLabelText("Malta National Identification Number");
        expect(el.getAttribute("aria-label")).toBe("Malta National Identification Number");
    });
});
