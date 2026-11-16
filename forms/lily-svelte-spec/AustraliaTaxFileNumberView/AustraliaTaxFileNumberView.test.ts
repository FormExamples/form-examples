import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AustraliaTaxFileNumberView.svelte";

describe("AustraliaTaxFileNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)", value: "test-value" } });

        const el = document.querySelector(".australia-tax-file-number-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("australia-tax-file-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)", value: "test-value" } });

        const el = document.querySelector(".australia-tax-file-number-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)" } });

        const el = document.querySelector(".australia-tax-file-number-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Tax File Number (TFN)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
