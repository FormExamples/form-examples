import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Tag.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Tag", () => {
    test("renders a span with the base class and the visible text", () => {
        const { container } = render(Subject, {
            props: { label: "Category: Design", children: textSnippet("Design") },
        });
        const tag = container.querySelector("span.tag")!;
        expect(tag.tagName).toBe("SPAN");
        expect(tag.textContent).toContain("Design");
    });

    test("is not a live region by default", () => {
        render(Subject, { props: { label: "Category: Design", children: textSnippet("Design") } });
        expect(screen.queryByRole("status")).toBeNull();
    });

    test("by default the label is screen-reader text appended to the exposed content", () => {
        const { container } = render(Subject, {
            props: { label: "Priority: High", children: textSnippet("High") },
        });
        const tag = container.querySelector("span.tag")!;
        expect(tag.hasAttribute("aria-label")).toBe(false);
        expect(tag.querySelector(".screen-reader-span")?.textContent).toBe("Priority: High");
        expect(tag.querySelector("[aria-hidden]")).toBeNull();
        expect(tag.textContent).toContain("High");
    });

    test("live renders a status region named by the label", () => {
        render(Subject, {
            props: { label: "Build: Passing", live: true, children: textSnippet("Passing") },
        });
        const tag = screen.getByRole("status");
        expect(tag.tagName).toBe("SPAN");
        expect(tag.getAttribute("aria-label")).toBe("Build: Passing");
        expect(tag.textContent).toContain("Passing");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: {
                label: "Tag",
                "data-testid": "my-tag",
                id: "tag-1",
                children: textSnippet("Label"),
            },
        });
        const tag = screen.getByTestId("my-tag");
        expect(tag.getAttribute("id")).toBe("tag-1");
    });
});
