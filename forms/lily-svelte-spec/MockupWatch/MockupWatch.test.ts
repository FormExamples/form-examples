import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupWatch from "./MockupWatch.svelte";

describe("MockupWatch", () => {
    test("renders with content", () => {
        render(MockupWatch, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-watch");
    });

    test("has role=img with a label", () => {
        const { container } = render(MockupWatch, { props: { label: "Story" } as any });
        const root = container.querySelector(".mockup-watch")!;
        expect(root.getAttribute("role")).toBe("img");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
