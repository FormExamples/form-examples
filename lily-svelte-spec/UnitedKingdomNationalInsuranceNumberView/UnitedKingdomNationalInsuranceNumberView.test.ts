import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./UnitedKingdomNationalInsuranceNumberView.svelte";

describe("UnitedKingdomNationalInsuranceNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "National Insurance Number", value: "test-value" } });

        const el = screen.getByLabelText("National Insurance Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("united-kingdom-national-insurance-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "National Insurance Number", value: "test-value" } });

        const el = screen.getByLabelText("National Insurance Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Insurance Number" } });

        const el = screen.getByLabelText("National Insurance Number");
        expect(el.getAttribute("aria-label")).toBe("National Insurance Number");
    });
});
