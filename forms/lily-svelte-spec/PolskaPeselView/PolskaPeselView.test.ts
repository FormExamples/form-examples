import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PolskaPeselView.svelte";

describe("PolskaPeselView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "PESEL", value: "test-value" } });

        const el = document.querySelector(".polska-pesel-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("polska-pesel-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "PESEL", value: "test-value" } });

        const el = document.querySelector(".polska-pesel-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "PESEL" } });

        const el = document.querySelector(".polska-pesel-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"PESEL"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
