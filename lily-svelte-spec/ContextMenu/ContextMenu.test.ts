import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ContextMenu.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

function menuItemsSnippet() {
    return (($$anchor: Comment) => {
        const li1 = document.createElement("li");
        li1.setAttribute("role", "menuitem");
        li1.setAttribute("tabindex", "-1");
        li1.textContent = "Cut";
        const li2 = document.createElement("li");
        li2.setAttribute("role", "menuitem");
        li2.setAttribute("tabindex", "-1");
        li2.textContent = "Copy";
        const li3 = document.createElement("li");
        li3.setAttribute("role", "menuitem");
        li3.setAttribute("tabindex", "-1");
        li3.textContent = "Paste";
        $$anchor.before(li1, li2, li3);
    }) as any;
}

describe("ContextMenu", () => {
    test("hidden when open is false", () => {
        render(Subject, { props: { label: "Actions", open: false, children: textSnippet("Items") } });
        expect(screen.queryByRole("menu")).toBeNull();
    });

    test("visible when open is true", () => {
        render(Subject, { props: { label: "Actions", open: true, children: textSnippet("Items") } });
        expect(screen.getByRole("menu", { name: "Actions" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Actions", open: true, children: textSnippet("Custom Content") } });
        expect(screen.getByRole("menu").textContent).toContain("Custom Content");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Actions", open: true, "data-testid": "ctx", children: textSnippet("Items") } });
        expect(screen.getByTestId("ctx")).toBeTruthy();
    });

    test("has correct aria-label", () => {
        render(Subject, { props: { label: "File actions", open: true, children: textSnippet("Items") } });
        expect(screen.getByRole("menu").getAttribute("aria-label")).toBe("File actions");
    });

    test("ArrowDown navigates to next item", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Actions", open: true, children: menuItemsSnippet() } });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(items[1]);
    });

    test("ArrowUp navigates to previous item", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Actions", open: true, children: menuItemsSnippet() } });
        const items = screen.getAllByRole("menuitem");
        items[1].focus();
        await user.keyboard("{ArrowUp}");
        expect(document.activeElement).toBe(items[0]);
    });

    test("ArrowDown wraps from last to first", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Actions", open: true, children: menuItemsSnippet() } });
        const items = screen.getAllByRole("menuitem");
        items[2].focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(items[0]);
    });

    test("Home moves focus to first item", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Actions", open: true, children: menuItemsSnippet() } });
        const items = screen.getAllByRole("menuitem");
        items[2].focus();
        await user.keyboard("{Home}");
        expect(document.activeElement).toBe(items[0]);
    });

    test("End moves focus to last item", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Actions", open: true, children: menuItemsSnippet() } });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{End}");
        expect(document.activeElement).toBe(items[2]);
    });
});
