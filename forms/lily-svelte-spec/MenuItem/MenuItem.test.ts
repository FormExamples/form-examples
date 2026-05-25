import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MenuItem.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("MenuItem", () => {
    test("renders a div with menuitem role", () => {
        render(Subject, { props: {
            children: textSnippet("New File"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.tagName).toBe("DIV");
    });

    test("displays children content", () => {
        render(Subject, { props: {
            children: textSnippet("Open File"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.textContent).toContain("Open File");
    });

    test("has tabindex -1 for roving focus", () => {
        render(Subject, { props: {
            children: textSnippet("Save"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("tabindex")).toBe("-1");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            "data-testid": "menu-item",
            children: textSnippet("Exit"),
        }});

        const item = screen.getByTestId("menu-item");
        expect(item).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: {
            id: "menu-save",
            children: textSnippet("Save"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("id")).toBe("menu-save");
    });

    test("supports aria-disabled attribute", () => {
        render(Subject, { props: {
            "aria-disabled": "true",
            children: textSnippet("Undo"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("aria-disabled")).toBe("true");
    });

    test("supports aria-haspopup for submenu triggers", () => {
        render(Subject, { props: {
            "aria-haspopup": "true",
            children: textSnippet("More Options"),
        }});

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("aria-haspopup")).toBe("true");
    });
});
