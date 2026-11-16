import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupWindow from "./MockupWindow.svelte";

describe("MockupWindow", () => {
    test("renders with content", () => {
        render(MockupWindow, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-window");
    });

    test("has role=img with a label", () => {
        const { container } = render(MockupWindow, { props: { label: "Story" } as any });
        const root = container.querySelector(".mockup-window")!;
        expect(root.getAttribute("role")).toBe("img");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
