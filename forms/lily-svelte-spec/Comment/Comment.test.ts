import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Comment from "./Comment.svelte";

describe("Comment", () => {
    test("renders with content", () => {
        render(Comment, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("comment");
    });

    test("is a named group when labelled", () => {
        const { container } = render(Comment, { props: { label: "Story" } as any });
        const root = container.querySelector(".comment");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(Comment, { props: {} as any });
        expect(container.querySelector(".comment")?.hasAttribute("role")).toBe(false);
    });
});
