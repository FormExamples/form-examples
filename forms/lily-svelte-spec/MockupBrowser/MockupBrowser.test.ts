import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupBrowser from "./MockupBrowser.svelte";

describe("MockupBrowser", () => {
    test("renders with content", () => {
        render(MockupBrowser, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-browser");
    });

    test("has role=img with a label", () => {
        const { container } = render(MockupBrowser, { props: { label: "Story" } as any });
        const root = container.querySelector(".mockup-browser")!;
        expect(root.getAttribute("role")).toBe("img");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
