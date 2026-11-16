import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ChileRolUnicoNacionalView.svelte";

describe("ChileRolUnicoNacionalView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Rol Único Nacional (RUN)", value: "test-value" } });

        const el = document.querySelector(".chile-rol-unico-nacional-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("chile-rol-unico-nacional-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Rol Único Nacional (RUN)", value: "test-value" } });

        const el = document.querySelector(".chile-rol-unico-nacional-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Rol Único Nacional (RUN)" } });

        const el = document.querySelector(".chile-rol-unico-nacional-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Rol Único Nacional (RUN)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
