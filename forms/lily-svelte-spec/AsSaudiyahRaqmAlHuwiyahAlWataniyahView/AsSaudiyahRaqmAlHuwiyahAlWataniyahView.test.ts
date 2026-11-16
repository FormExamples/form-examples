import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahView.svelte";

describe("AsSaudiyahRaqmAlHuwiyahAlWataniyahView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "National Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".as-saudiyah-raqm-al-huwiyah-al-wataniyah-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "National Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".as-saudiyah-raqm-al-huwiyah-al-wataniyah-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Identification Number" } });

        const el = document.querySelector(
            ".as-saudiyah-raqm-al-huwiyah-al-wataniyah-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Identification Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
