import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./EcuadorCedulaDeIdentidadView.svelte";

describe("EcuadorCedulaDeIdentidadView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number", value: "test-value" } });

        const el = document.querySelector(".ecuador-cedula-de-identidad-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ecuador-cedula-de-identidad-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number", value: "test-value" } });

        const el = document.querySelector(".ecuador-cedula-de-identidad-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Cedula de Identidad Number" } });

        const el = document.querySelector(".ecuador-cedula-de-identidad-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Cedula de Identidad Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
