import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./IranKodEMelliView.svelte";

describe("IranKodEMelliView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)", value: "test-value" } });

        const el = document.querySelector(".iran-kod-e-melli-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("iran-kod-e-melli-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)", value: "test-value" } });

        const el = document.querySelector(".iran-kod-e-melli-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Code (Kod-e Melli)" } });

        const el = document.querySelector(".iran-kod-e-melli-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Code (Kod-e Melli)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
