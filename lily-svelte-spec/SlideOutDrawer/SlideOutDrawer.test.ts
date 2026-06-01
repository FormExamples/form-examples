import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SlideOutDrawer.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("SlideOutDrawer", () => {
    test("does not render when open is false", () => {
        render(Subject, { props: {
            label: "Drawer",
            open: false,
            children: textSnippet("Content"),
        }});

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("renders when open is true", () => {
        render(Subject, { props: {
            label: "Drawer",
            open: true,
            children: textSnippet("Content"),
        }});

        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: {
            label: "Navigation",
            open: true,
            children: textSnippet("Content"),
        }});

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("aria-label")).toBe("Navigation");
    });

    test("has aria-modal set to true", () => {
        render(Subject, { props: {
            label: "Drawer",
            open: true,
            children: textSnippet("Content"),
        }});

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("aria-modal")).toBe("true");
    });

    test("has tabindex for focus management", () => {
        render(Subject, { props: {
            label: "Drawer",
            open: true,
            children: textSnippet("Content"),
        }});

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("tabindex")).toBe("-1");
    });

    test("renders children content", () => {
        render(Subject, { props: {
            label: "Drawer",
            open: true,
            children: textSnippet("Drawer content"),
        }});

        const el = screen.getByRole("dialog");
        expect(el.textContent).toContain("Drawer content");
    });

    test("closes on Escape key", async () => {
        render(Subject, { props: {
            label: "Drawer",
            open: true,
            children: textSnippet("Content"),
        }});

        const el = screen.getByRole("dialog");
        await fireEvent.keyDown(el, { key: "Escape" });

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            label: "Drawer",
            open: true,
            "data-testid": "my-drawer",
            children: textSnippet("Content"),
        }});

        expect(screen.getByTestId("my-drawer")).toBeTruthy();
    });

    test("renders as a div element", () => {
        render(Subject, { props: {
            label: "Drawer",
            open: true,
            children: textSnippet("Content"),
        }});

        const el = screen.getByRole("dialog");
        expect(el.tagName).toBe("DIV");
    });
});
