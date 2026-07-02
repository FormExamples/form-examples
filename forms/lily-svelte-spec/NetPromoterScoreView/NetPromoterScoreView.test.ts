import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NetPromoterScoreView.svelte";

describe("NetPromoterScoreView", () => {
    test("renders a span element", () => {
        render(Subject, { props: { label: "NPS Score" } });

        const el = screen.getByLabelText("NPS Score");
        expect(el.tagName).toBe("SPAN");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "NPS Score" } });

        const el = screen.getByLabelText("NPS Score");
        expect(el.getAttribute("aria-label")).toBe("NPS Score");
    });

    test("displays the value as text", () => {
        render(Subject, { props: { label: "NPS Score", value: "8" } });

        const el = screen.getByLabelText("NPS Score");
        expect(el.textContent).toBe("8");
    });

    test("defaults to empty string when no value provided", () => {
        render(Subject, { props: { label: "NPS Score" } });

        const el = screen.getByLabelText("NPS Score");
        expect(el.textContent).toBe("");
    });

    test("displays score of 0", () => {
        render(Subject, { props: { label: "NPS Score", value: "0" } });

        const el = screen.getByLabelText("NPS Score");
        expect(el.textContent).toBe("0");
    });

    test("displays score of 10", () => {
        render(Subject, { props: { label: "NPS Score", value: "10" } });

        const el = screen.getByLabelText("NPS Score");
        expect(el.textContent).toBe("10");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "NPS", "data-testid": "nps-view" } });

        expect(screen.getByTestId("nps-view")).toBeTruthy();
    });
});
