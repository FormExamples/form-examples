import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./IbanView.svelte";

describe("IbanView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "IBAN", value: "test-value" } });

        const el = document.querySelector(".iban-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("iban-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "IBAN", value: "test-value" } });

        const el = document.querySelector(".iban-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "IBAN" } });

        const el = document.querySelector(".iban-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"IBAN"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
