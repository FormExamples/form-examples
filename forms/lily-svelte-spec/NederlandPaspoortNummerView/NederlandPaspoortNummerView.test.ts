import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NederlandPaspoortNummerView.svelte";

describe("NederlandPaspoortNummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Dutch Passport Number", value: "test-value" } });

        const el = document.querySelector(".nederland-paspoort-nummer-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nederland-paspoort-nummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Dutch Passport Number", value: "test-value" } });

        const el = document.querySelector(".nederland-paspoort-nummer-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Dutch Passport Number" } });

        const el = document.querySelector(".nederland-paspoort-nummer-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Dutch Passport Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
