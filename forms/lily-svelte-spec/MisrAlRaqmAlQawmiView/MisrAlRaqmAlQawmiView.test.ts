import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MisrAlRaqmAlQawmiView.svelte";

describe("MisrAlRaqmAlQawmiView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "الرقم القومي (Al-Raqm Al-Qawmi)", value: "test-value" },
        });

        const el = document.querySelector(".misr-al-raqm-al-qawmi-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("misr-al-raqm-al-qawmi-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "الرقم القومي (Al-Raqm Al-Qawmi)", value: "test-value" },
        });

        const el = document.querySelector(".misr-al-raqm-al-qawmi-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "الرقم القومي (Al-Raqm Al-Qawmi)" } });

        const el = document.querySelector(".misr-al-raqm-al-qawmi-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"الرقم القومي (Al-Raqm Al-Qawmi)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
