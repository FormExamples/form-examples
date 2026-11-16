import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SlovenskoRodneCisloView.svelte";

describe("SlovenskoRodneCisloView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Slovak Personal Number", value: "test-value" } });

        const el = document.querySelector(".slovensko-rodne-cislo-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("slovensko-rodne-cislo-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Slovak Personal Number", value: "test-value" } });

        const el = document.querySelector(".slovensko-rodne-cislo-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Slovak Personal Number" } });

        const el = document.querySelector(".slovensko-rodne-cislo-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Slovak Personal Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
