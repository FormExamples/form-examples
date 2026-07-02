import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./EestiIsikukoodView.svelte";

describe("EestiIsikukoodView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Personal Identification Code", value: "test-value" } });

        const el = screen.getByLabelText("Personal Identification Code");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("eesti-isikukood-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Personal Identification Code", value: "test-value" } });

        const el = screen.getByLabelText("Personal Identification Code");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Personal Identification Code" } });

        const el = screen.getByLabelText("Personal Identification Code");
        expect(el.getAttribute("aria-label")).toBe("Personal Identification Code");
    });
});
