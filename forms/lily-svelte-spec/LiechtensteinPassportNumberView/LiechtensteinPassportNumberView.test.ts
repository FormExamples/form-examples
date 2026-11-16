import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./LiechtensteinPassportNumberView.svelte";

describe("LiechtensteinPassportNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Liechtenstein Passport Number", value: "test-value" } });

        const el = document.querySelector(".liechtenstein-passport-number-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("liechtenstein-passport-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Liechtenstein Passport Number", value: "test-value" } });

        const el = document.querySelector(".liechtenstein-passport-number-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Liechtenstein Passport Number" } });

        const el = document.querySelector(".liechtenstein-passport-number-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Liechtenstein Passport Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
