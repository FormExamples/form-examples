import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MaltaNationalIdentificationNumberView.svelte";

describe("MaltaNationalIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Malta National Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".malta-national-identification-number-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("malta-national-identification-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Malta National Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".malta-national-identification-number-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Malta National Identification Number" } });

        const el = document.querySelector(
            ".malta-national-identification-number-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Malta National Identification Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
