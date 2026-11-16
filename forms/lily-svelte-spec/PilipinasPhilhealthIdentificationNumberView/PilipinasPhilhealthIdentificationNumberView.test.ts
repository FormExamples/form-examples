import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PilipinasPhilhealthIdentificationNumberView.svelte";

describe("PilipinasPhilhealthIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "PhilHealth Identification Number (PIN)", value: "test-value" },
        });

        const el = document.querySelector(
            ".pilipinas-philhealth-identification-number-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "pilipinas-philhealth-identification-number-view",
        );
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "PhilHealth Identification Number (PIN)", value: "test-value" },
        });

        const el = document.querySelector(
            ".pilipinas-philhealth-identification-number-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "PhilHealth Identification Number (PIN)" } });

        const el = document.querySelector(
            ".pilipinas-philhealth-identification-number-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"PhilHealth Identification Number (PIN)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
