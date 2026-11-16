import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupTabletLandscape from "./MockupTabletLandscape.svelte";

describe("MockupTabletLandscape", () => {
    test("renders with content", () => {
        render(MockupTabletLandscape, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-tablet-landscape");
    });

    test("has role=img with a label", () => {
        const { container } = render(MockupTabletLandscape, { props: { label: "Story" } as any });
        const root = container.querySelector(".mockup-tablet-landscape")!;
        expect(root.getAttribute("role")).toBe("img");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
