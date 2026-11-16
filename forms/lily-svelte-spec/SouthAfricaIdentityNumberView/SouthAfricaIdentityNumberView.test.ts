import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SouthAfricaIdentityNumberView.svelte";

describe("SouthAfricaIdentityNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "South African Identity Number", value: "test-value" } });

        const el = document.querySelector(".south-africa-identity-number-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("south-africa-identity-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "South African Identity Number", value: "test-value" } });

        const el = document.querySelector(".south-africa-identity-number-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "South African Identity Number" } });

        const el = document.querySelector(".south-africa-identity-number-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"South African Identity Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
