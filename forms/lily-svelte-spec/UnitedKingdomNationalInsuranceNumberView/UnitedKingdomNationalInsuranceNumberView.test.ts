import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./UnitedKingdomNationalInsuranceNumberView.svelte";

describe("UnitedKingdomNationalInsuranceNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "National Insurance Number", value: "test-value" } });

        const el = document.querySelector(
            ".united-kingdom-national-insurance-number-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("united-kingdom-national-insurance-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "National Insurance Number", value: "test-value" } });

        const el = document.querySelector(
            ".united-kingdom-national-insurance-number-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Insurance Number" } });

        const el = document.querySelector(
            ".united-kingdom-national-insurance-number-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Insurance Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
