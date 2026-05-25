import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ContextMenuItem.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ContextMenuItem", () => {
    test("renders a div with menuitem role", () => {
        render(Subject, { props: {
            children: textSnippet("Cut"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.tagName).toBe("DIV");
    });

    test("displays children content", () => {
        render(Subject, { props: {
            children: textSnippet("Copy"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.textContent).toContain("Copy");
    });

    test("has tabindex -1 for roving focus", () => {
        render(Subject, { props: {
            children: textSnippet("Paste"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("tabindex")).toBe("-1");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            "data-testid": "ctx-item",
            children: textSnippet("Delete"),
        }});

        const item = screen.getByTestId("ctx-item");
        expect(item).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: {
            id: "ctx-cut",
            children: textSnippet("Cut"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("id")).toBe("ctx-cut");
    });

    test("supports aria-disabled attribute", () => {
        render(Subject, { props: {
            "aria-disabled": "true",
            children: textSnippet("Delete"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("aria-disabled")).toBe("true");
    });
});
