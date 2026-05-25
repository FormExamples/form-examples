import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Menu.svelte";

function menuItemsSnippet() {
    return (($anchor: Comment) => {
        const item1 = document.createElement("div");
        item1.setAttribute("role", "menuitem");
        item1.setAttribute("tabindex", "-1");
        item1.textContent = "Cut";
        const item2 = document.createElement("div");
        item2.setAttribute("role", "menuitem");
        item2.setAttribute("tabindex", "-1");
        item2.textContent = "Copy";
        $anchor.before(item1, item2);
    }) as any;
}

describe("Menu", () => {
    test("renders a menu", () => {
        render(Subject, { props: { label: "Actions", children: menuItemsSnippet() } });
        expect(screen.getByRole("menu")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Edit", children: menuItemsSnippet() } });
        expect(screen.getByLabelText("Edit")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Actions", children: menuItemsSnippet() } });
        expect(screen.getByText("Cut")).toBeTruthy();
        expect(screen.getByText("Copy")).toBeTruthy();
    });

    test("arrow down navigates to next item", async () => {
        render(Subject, { props: { label: "Actions", children: menuItemsSnippet() } });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        items[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "A", "data-testid": "m", children: menuItemsSnippet() } });
        expect(screen.getByTestId("m")).toBeTruthy();
    });
});
