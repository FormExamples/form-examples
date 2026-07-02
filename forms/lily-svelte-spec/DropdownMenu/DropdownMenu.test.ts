import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./DropdownMenu.svelte";

function menuItemsSnippet() {
    return (($$anchor: Comment) => {
        const li1 = document.createElement("li");
        li1.setAttribute("role", "menuitem");
        li1.setAttribute("tabindex", "-1");
        li1.textContent = "Edit";
        const li2 = document.createElement("li");
        li2.setAttribute("role", "menuitem");
        li2.setAttribute("tabindex", "-1");
        li2.textContent = "Delete";
        $$anchor.before(li1, li2);
    }) as any;
}

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("DropdownMenu", () => {
    test("renders a toggle button", () => {
        render(Subject, { props: { label: "Options", children: menuItemsSnippet() } });
        expect(screen.getByRole("button", { name: "Options" })).toBeTruthy();
    });

    test("button has aria-haspopup", () => {
        render(Subject, { props: { label: "Options", children: menuItemsSnippet() } });
        expect(screen.getByRole("button").getAttribute("aria-haspopup")).toBe("true");
    });

    test("button shows aria-expanded false when closed", () => {
        render(Subject, { props: { label: "Options", children: menuItemsSnippet() } });
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("menu hidden when closed", () => {
        render(Subject, { props: { label: "Options", children: menuItemsSnippet() } });
        expect(screen.queryByRole("menu")).toBeNull();
    });

    test("clicking button opens menu", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Options", children: menuItemsSnippet() } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("menu")).toBeTruthy();
    });

    test("button shows aria-expanded true when open", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Options", children: menuItemsSnippet() } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("ArrowDown navigates items", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Options", open: true, children: menuItemsSnippet() } });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(items[1]);
    });

    test("ArrowUp navigates items", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Options", open: true, children: menuItemsSnippet() } });
        const items = screen.getAllByRole("menuitem");
        items[1].focus();
        await user.keyboard("{ArrowUp}");
        expect(document.activeElement).toBe(items[0]);
    });

    test("Escape closes menu", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Options", open: true, children: menuItemsSnippet() } });
        screen.getByRole("menu").focus();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("menu")).toBeNull();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Options", "data-testid": "dd", children: menuItemsSnippet() } });
        expect(screen.getByTestId("dd")).toBeTruthy();
    });
});
