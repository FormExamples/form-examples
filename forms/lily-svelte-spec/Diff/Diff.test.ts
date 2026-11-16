import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Diff from "./Diff.svelte";

describe("Diff", () => {
    test("renders with content", () => {
        render(Diff, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("diff");
    });

    test("has role=group with a label", () => {
        const { container } = render(Diff, { props: { label: "Story" } as any });
        const root = container.querySelector(".diff")!;
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Story");
    });
});
