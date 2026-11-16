import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./BrasilCartaoNacionalDeSaudeView.svelte";

describe("BrasilCartaoNacionalDeSaudeView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Cartão Nacional de Saúde (CNS)", value: "test-value" },
        });

        const el = document.querySelector(".brasil-cartao-nacional-de-saude-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("brasil-cartao-nacional-de-saude-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Cartão Nacional de Saúde (CNS)", value: "test-value" },
        });

        const el = document.querySelector(".brasil-cartao-nacional-de-saude-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Cartão Nacional de Saúde (CNS)" } });

        const el = document.querySelector(".brasil-cartao-nacional-de-saude-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Cartão Nacional de Saúde (CNS)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
