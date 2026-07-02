import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ContentsListItem.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ContentsListItem", () => {
    test("renders a list item element", () => {
        render(Subject, { props: {
            children: textSnippet("Introduction"),
        }});

        const item = screen.getByRole("listitem");
        expect(item.tagName).toBe("LI");
    });

    test("renders children content", () => {
        render(Subject, { props: {
            children: textSnippet("Chapter 1"),
        }});

        const item = screen.getByRole("listitem");
        expect(item.textContent).toContain("Chapter 1");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            "data-testid": "toc-item",
            children: textSnippet("Section"),
        }});

        const item = screen.getByTestId("toc-item");
        expect(item).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: {
            id: "item-1",
            children: textSnippet("Section"),
        }});

        const item = screen.getByRole("listitem");
        expect(item.getAttribute("id")).toBe("item-1");
    });

    test("passes through aria-current attribute", () => {
        render(Subject, { props: {
            "aria-current": "page",
            children: textSnippet("Current page"),
        }});

        const item = screen.getByRole("listitem");
        expect(item.getAttribute("aria-current")).toBe("page");
    });
});
