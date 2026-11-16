import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupLaptop from "./MockupLaptop.svelte";

describe("MockupLaptop", () => {
    test("renders with content", () => {
        render(MockupLaptop, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-laptop");
    });

    test("has role=img with a label", () => {
        const { container } = render(MockupLaptop, { props: { label: "Story" } as any });
        const root = container.querySelector(".mockup-laptop")!;
        expect(root.getAttribute("role")).toBe("img");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
