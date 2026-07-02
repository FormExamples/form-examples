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
    test("renders with status role", () => {
        render(Subject, { props: {
            label: "Category",
            children: textSnippet("Design"),
        }});

        const tag = screen.getByRole("status");
        expect(tag).toBeTruthy();
    });

    test("renders as a span element", () => {
        render(Subject, { props: {
            label: "Category",
            children: textSnippet("Design"),
        }});

        const tag = screen.getByRole("status");
        expect(tag.tagName).toBe("SPAN");
    });

    test("displays children content", () => {
        render(Subject, { props: {
            label: "Status",
            children: textSnippet("Active"),
        }});

        const tag = screen.getByRole("status");
        expect(tag.textContent).toContain("Active");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: {
            label: "Priority: High",
            children: textSnippet("High"),
        }});

        const tag = screen.getByRole("status");
        expect(tag.getAttribute("aria-label")).toBe("Priority: High");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            label: "Tag",
            "data-testid": "my-tag",
            children: textSnippet("Label"),
        }});

        const tag = screen.getByTestId("my-tag");
        expect(tag).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: {
            label: "Tag",
            id: "tag-1",
            children: textSnippet("Label"),
        }});

        const tag = screen.getByRole("status");
        expect(tag.getAttribute("id")).toBe("tag-1");
    });
});
