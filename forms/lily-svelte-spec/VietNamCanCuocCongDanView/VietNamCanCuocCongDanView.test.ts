import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VietNamCanCuocCongDanView.svelte";

describe("VietNamCanCuocCongDanView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Citizen Identification Number (CCCD)", value: "test-value" },
        });

        const el = document.querySelector(".viet-nam-can-cuoc-cong-dan-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("viet-nam-can-cuoc-cong-dan-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Citizen Identification Number (CCCD)", value: "test-value" },
        });

        const el = document.querySelector(".viet-nam-can-cuoc-cong-dan-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Citizen Identification Number (CCCD)" } });

        const el = document.querySelector(".viet-nam-can-cuoc-cong-dan-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Citizen Identification Number (CCCD)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
