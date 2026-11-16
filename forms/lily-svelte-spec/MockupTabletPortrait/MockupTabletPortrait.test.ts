import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupTabletPortrait from "./MockupTabletPortrait.svelte";

describe("MockupTabletPortrait", () => {
    test("renders with content", () => {
        render(MockupTabletPortrait, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-tablet-portrait");
    });

    test("has role=img with a label", () => {
        const { container } = render(MockupTabletPortrait, { props: { label: "Story" } as any });
        const root = container.querySelector(".mockup-tablet-portrait")!;
        expect(root.getAttribute("role")).toBe("img");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
