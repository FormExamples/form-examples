import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PortugalNumeroDeIdentificacaoFiscalView.svelte";

describe("PortugalNumeroDeIdentificacaoFiscalView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Tax Identification Number", value: "test-value" } });

        const el = document.querySelector(
            ".portugal-numero-de-identificacao-fiscal-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("portugal-numero-de-identificacao-fiscal-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Tax Identification Number", value: "test-value" } });

        const el = document.querySelector(
            ".portugal-numero-de-identificacao-fiscal-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Tax Identification Number" } });

        const el = document.querySelector(
            ".portugal-numero-de-identificacao-fiscal-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Tax Identification Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
