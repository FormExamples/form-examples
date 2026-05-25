import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MenuBar.svelte";

function menuItemsSnippet() {
    return (($anchor: Comment) => {
        const item1 = document.createElement("div");
        item1.setAttribute("role", "menuitem");
        item1.setAttribute("tabindex", "-1");
        item1.textContent = "File";
        const item2 = document.createElement("div");
        item2.setAttribute("role", "menuitem");
        item2.setAttribute("tabindex", "-1");
        item2.textContent = "Edit";
        $anchor.before(item1, item2);
    }) as any;
}

describe("MenuBar", () => {
    test("renders a menubar", () => {
        render(Subject, { props: { label: "Main", children: menuItemsSnippet() } });
        expect(screen.getByRole("menubar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Main menu", children: menuItemsSnippet() } });
        expect(screen.getByLabelText("Main menu")).toBeTruthy();
    });

    test("arrow right navigates to next item", async () => {
        render(Subject, { props: { label: "Main", children: menuItemsSnippet() } });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        items[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "M", "data-testid": "mb", children: menuItemsSnippet() } });
        expect(screen.getByTestId("mb")).toBeTruthy();
    });
});
