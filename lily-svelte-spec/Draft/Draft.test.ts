import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Draft from "./Draft.svelte";

describe("Draft", () => {
    test("renders with content", () => {
        render(Draft, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("draft");
    });

    test("exposes status via data-status", () => {
        render(Draft, { props: { label: "Q1 report", status: "review" } });
        const el = screen.getByLabelText("Q1 report");
        expect(el.getAttribute("data-status")).toBe("review");
    });
});
