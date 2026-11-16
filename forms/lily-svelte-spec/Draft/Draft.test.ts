import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Draft from "./Draft.svelte";

describe("Draft", () => {
    test("renders with content", () => {
        render(Draft, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("draft");
    });

    test("exposes status via data-status", () => {
        render(Draft, { props: { label: "Q1 report", status: "review" } as any });
        const el = screen.getByLabelText("Q1 report");
        expect(el.getAttribute("data-status")).toBe("review");
    });

    test("is a named group when labelled", () => {
        const { container } = render(Draft, { props: { label: "Story" } as any });
        const root = container.querySelector(".draft");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(Draft, { props: {} as any });
        expect(container.querySelector(".draft")?.hasAttribute("role")).toBe(false);
    });
});
