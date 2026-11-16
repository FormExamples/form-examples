import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NetPromoterScoreView.svelte";

describe("NetPromoterScoreView", () => {
    test("renders a span element", () => {
        render(Subject, { props: { label: "NPS Score" } });

        const el = document.querySelector(".net-promoter-score-view") as HTMLElement;
        expect(el.tagName).toBe("SPAN");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "NPS Score" } });

        const el = document.querySelector(".net-promoter-score-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"NPS Score"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    test("displays the value as text", () => {
        render(Subject, { props: { label: "NPS Score", value: "8" } });

        const el = document.querySelector(".net-promoter-score-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("8");
    });

    test("defaults to empty string when no value provided", () => {
        render(Subject, { props: { label: "NPS Score" } });

        const el = document.querySelector(".net-promoter-score-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("");
    });

    test("displays score of 0", () => {
        render(Subject, { props: { label: "NPS Score", value: "0" } });

        const el = document.querySelector(".net-promoter-score-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("0");
    });

    test("displays score of 10", () => {
        render(Subject, { props: { label: "NPS Score", value: "10" } });

        const el = document.querySelector(".net-promoter-score-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("10");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "NPS", "data-testid": "nps-view" } });

        expect(screen.getByTestId("nps-view")).toBeTruthy();
    });
});
