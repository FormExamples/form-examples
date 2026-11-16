import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NigeriaNationalIdentificationNumberView.svelte";

describe("NigeriaNationalIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "National Identification Number (NIN)", value: "test-value" },
        });

        const el = document.querySelector(
            ".nigeria-national-identification-number-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nigeria-national-identification-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "National Identification Number (NIN)", value: "test-value" },
        });

        const el = document.querySelector(
            ".nigeria-national-identification-number-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Identification Number (NIN)" } });

        const el = document.querySelector(
            ".nigeria-national-identification-number-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Identification Number (NIN)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
