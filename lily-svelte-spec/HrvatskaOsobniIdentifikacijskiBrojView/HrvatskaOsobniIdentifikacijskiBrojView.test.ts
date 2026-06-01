import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./HrvatskaOsobniIdentifikacijskiBrojView.svelte";

describe("HrvatskaOsobniIdentifikacijskiBrojView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Personal Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Personal Identification Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hrvatska-osobni-identifikacijski-broj-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Personal Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Personal Identification Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Personal Identification Number" } });

        const el = screen.getByLabelText("Personal Identification Number");
        expect(el.getAttribute("aria-label")).toBe("Personal Identification Number");
    });
});
