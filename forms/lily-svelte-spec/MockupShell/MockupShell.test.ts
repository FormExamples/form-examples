import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupShell from "./MockupShell.svelte";

describe("MockupShell", () => {
    test("renders with content", () => {
        render(MockupShell, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-shell");
    });

    test("has role=img with a label", () => {
        const { container } = render(MockupShell, { props: { label: "Story" } as any });
        const root = container.querySelector(".mockup-shell")!;
        expect(root.getAttribute("role")).toBe("img");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
