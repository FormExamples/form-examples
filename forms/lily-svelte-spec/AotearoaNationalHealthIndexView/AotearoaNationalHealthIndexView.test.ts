import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AotearoaNationalHealthIndexView.svelte";

describe("AotearoaNationalHealthIndexView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "National Health Index (NHI) Number", value: "test-value" },
        });

        const el = document.querySelector(".aotearoa-national-health-index-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("aotearoa-national-health-index-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "National Health Index (NHI) Number", value: "test-value" },
        });

        const el = document.querySelector(".aotearoa-national-health-index-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Health Index (NHI) Number" } });

        const el = document.querySelector(".aotearoa-national-health-index-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Health Index (NHI) Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
