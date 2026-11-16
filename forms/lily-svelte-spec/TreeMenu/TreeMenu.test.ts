import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TreeMenu from "./TreeMenu.svelte";

function itemsSnippet() {
    return (($anchor: Comment) => {
        const ul = document.createElement("ul");
        for (const name of ["Home", "Settings", "Profile"]) {
            const li = document.createElement("li");
            li.setAttribute("role", "treeitem");
            li.tabIndex = -1;
            li.textContent = name;
            ul.appendChild(li);
        }
        $anchor.before(ul);
    }) as any;
}

describe("TreeMenu", () => {
    test("renders with content", () => {
        render(TreeMenu, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("tree-menu");
    });

    test("is a labelled tree", () => {
        render(TreeMenu, { props: { label: "Site", children: itemsSnippet() } });
        expect(screen.getByRole("tree", { name: "Site" })).toBeTruthy();
    });

    test("ArrowDown and ArrowUp move focus between tree items and wrap at the ends", async () => {
        render(TreeMenu, { props: { label: "Site", children: itemsSnippet() } });
        const items = screen.getAllByRole("treeitem");
        items[0].focus();
        await fireEvent.keyDown(items[0], { key: "ArrowDown" });
        expect(document.activeElement).toBe(items[1]);
        await fireEvent.keyDown(items[1], { key: "ArrowUp" });
        expect(document.activeElement).toBe(items[0]);
        await fireEvent.keyDown(items[0], { key: "ArrowUp" });
        expect(document.activeElement).toBe(items[2]);
        await fireEvent.keyDown(items[2], { key: "ArrowDown" });
        expect(document.activeElement).toBe(items[0]);
    });

    test("Home and End jump to the first and last tree item", async () => {
        render(TreeMenu, { props: { label: "Site", children: itemsSnippet() } });
        const items = screen.getAllByRole("treeitem");
        items[1].focus();
        await fireEvent.keyDown(items[1], { key: "End" });
        expect(document.activeElement).toBe(items[2]);
        await fireEvent.keyDown(items[2], { key: "Home" });
        expect(document.activeElement).toBe(items[0]);
    });
});
