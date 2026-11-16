import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ArgentinaCodigoUnicoDeIdentificacionLaboralView.svelte";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Código Único de Identificación Laboral (CUIL)", value: "test-value" },
        });

        const el = document.querySelector(
            ".argentina-codigo-unico-de-identificacion-laboral-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "argentina-codigo-unico-de-identificacion-laboral-view",
        );
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Código Único de Identificación Laboral (CUIL)", value: "test-value" },
        });

        const el = document.querySelector(
            ".argentina-codigo-unico-de-identificacion-laboral-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Código Único de Identificación Laboral (CUIL)" } });

        const el = document.querySelector(
            ".argentina-codigo-unico-de-identificacion-laboral-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Código Único de Identificación Laboral (CUIL)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
