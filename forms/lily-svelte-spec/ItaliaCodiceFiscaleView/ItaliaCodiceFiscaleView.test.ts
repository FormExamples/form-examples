import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ItaliaCodiceFiscaleView.svelte";

describe("ItaliaCodiceFiscaleView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Italian Fiscal Code", value: "test-value" } });

        const el = document.querySelector(".italia-codice-fiscale-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("italia-codice-fiscale-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Italian Fiscal Code", value: "test-value" } });

        const el = document.querySelector(".italia-codice-fiscale-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Italian Fiscal Code" } });

        const el = document.querySelector(".italia-codice-fiscale-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Italian Fiscal Code"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
