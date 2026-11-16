import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SuomiHenkilotunnusView.svelte";

describe("SuomiHenkilotunnusView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Personal Identity Code", value: "test-value" } });

        const el = document.querySelector(".suomi-henkilotunnus-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("suomi-henkilotunnus-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Personal Identity Code", value: "test-value" } });

        const el = document.querySelector(".suomi-henkilotunnus-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Personal Identity Code" } });

        const el = document.querySelector(".suomi-henkilotunnus-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Personal Identity Code"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
