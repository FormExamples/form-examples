import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CeskoCestovniPasView.svelte";

describe("CeskoCestovniPasView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Czech Passport", value: "test-value" } });

        const el = document.querySelector(".cesko-cestovni-pas-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("cesko-cestovni-pas-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Czech Passport", value: "test-value" } });

        const el = document.querySelector(".cesko-cestovni-pas-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Czech Passport" } });

        const el = document.querySelector(".cesko-cestovni-pas-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"Czech Passport"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
