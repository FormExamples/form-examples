import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PortugalPassaporteView.svelte";

describe("PortugalPassaporteView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Portuguese Passport", value: "test-value" } });

        const el = document.querySelector(".portugal-passaporte-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("portugal-passaporte-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Portuguese Passport", value: "test-value" } });

        const el = document.querySelector(".portugal-passaporte-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Portuguese Passport" } });

        const el = document.querySelector(".portugal-passaporte-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Portuguese Passport"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
