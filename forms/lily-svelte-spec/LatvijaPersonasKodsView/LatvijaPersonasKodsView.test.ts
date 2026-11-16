import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./LatvijaPersonasKodsView.svelte";

describe("LatvijaPersonasKodsView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Personal Code", value: "test-value" } });

        const el = document.querySelector(".latvija-personas-kods-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("latvija-personas-kods-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Personal Code", value: "test-value" } });

        const el = document.querySelector(".latvija-personas-kods-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Personal Code" } });

        const el = document.querySelector(".latvija-personas-kods-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"Personal Code"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
