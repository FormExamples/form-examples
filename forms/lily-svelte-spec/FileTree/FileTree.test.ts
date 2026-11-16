import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./FileTree.svelte";

// src (folder, open) > [lib (folder, open) > [index.ts], app.ts]; docs (folder, closed) > [guide.md]; readme.md
const TREE = `
<li role="treeitem" aria-expanded="true" data-id="src">src
  <ul role="group">
    <li role="treeitem" aria-expanded="true" data-id="lib">lib
      <ul role="group"><li role="treeitem" data-id="index">index.ts</li></ul>
    </li>
    <li role="treeitem" data-id="app">app.ts</li>
  </ul>
</li>
<li role="treeitem" aria-expanded="false" data-id="docs">docs
  <ul role="group"><li role="treeitem" data-id="guide">guide.md</li></ul>
</li>
<li role="treeitem" data-id="readme">readme.md</li>
<li role="treeitem" aria-expanded="false" data-id="etc">etc
  <ul role="group"><li role="treeitem" data-id="x">x.txt</li></ul>
</li>`;

function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const t = document.createElement("template");
        t.innerHTML = html;
        $$anchor.before(t.content);
    }) as any;
}

function setup(html = TREE) {
    const user: UserEvent = userEvent.setup();
    const result = render(Subject, { props: { label: "Files", children: htmlSnippet(html) } });
    const item = (id: string) => result.container.querySelector<HTMLElement>(`[data-id="${id}"]`)!;
    return { user, item, ...result };
}

describe("FileTree", () => {
    test("root is <ul role=tree> with class and aria-label", () => {
        const { container } = setup();
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("UL");
        expect(root.getAttribute("class")).toContain("file-tree");
        expect(screen.getByRole("tree", { name: "Files" })).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "F", "data-testid": "ft", children: htmlSnippet(TREE) },
        });
        expect(screen.getByTestId("ft")).toBeTruthy();
    });

    test("roving tabindex: exactly one item has tabindex=0, the first", () => {
        const { container, item } = setup();
        const stops = container.querySelectorAll("[role=treeitem][tabindex='0']");
        expect(stops).toHaveLength(1);
        expect(stops[0]).toBe(item("src"));
        expect(item("lib").getAttribute("tabindex")).toBe("-1");
    });

    test("tab stop follows focus", async () => {
        const { user, item, container } = setup();
        item("src").focus();
        await user.keyboard("{ArrowDown}");
        expect(item("lib").getAttribute("tabindex")).toBe("0");
        expect(item("src").getAttribute("tabindex")).toBe("-1");
        expect(container.querySelectorAll("[tabindex='0']")).toHaveLength(1);
    });

    test("ArrowDown moves to the next visible item, skipping closed folder contents", async () => {
        const { user, item } = setup();
        item("readme").focus();
        await user.keyboard("{ArrowUp}");
        expect(document.activeElement).toBe(item("docs"));
        await user.keyboard("{ArrowDown}{ArrowDown}");
        expect(document.activeElement).toBe(item("etc"));
    });

    test("ArrowDown/ArrowUp walk into open folders", async () => {
        const { user, item } = setup();
        item("src").focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(item("lib"));
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(item("index"));
        await user.keyboard("{ArrowUp}");
        expect(document.activeElement).toBe(item("lib"));
    });

    test("ArrowUp at the first item and ArrowDown at the last do not wrap", async () => {
        const { user, item } = setup();
        item("src").focus();
        await user.keyboard("{ArrowUp}");
        expect(document.activeElement).toBe(item("src"));
        item("etc").focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(item("etc"));
    });

    test("Home and End jump to the first and last visible items", async () => {
        const { user, item } = setup();
        item("app").focus();
        await user.keyboard("{End}");
        expect(document.activeElement).toBe(item("etc"));
        await user.keyboard("{Home}");
        expect(document.activeElement).toBe(item("src"));
    });

    test("ArrowRight on a closed folder opens it", async () => {
        const { user, item } = setup();
        item("docs").focus();
        await user.keyboard("{ArrowRight}");
        expect(item("docs").getAttribute("aria-expanded")).toBe("true");
        expect(document.activeElement).toBe(item("docs"));
    });

    test("ArrowRight on an open folder moves to its first child", async () => {
        const { user, item } = setup();
        item("src").focus();
        await user.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(item("lib"));
    });

    test("ArrowRight on a file does nothing", async () => {
        const { user, item } = setup();
        item("readme").focus();
        await user.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(item("readme"));
    });

    test("ArrowLeft on an open folder closes it", async () => {
        const { user, item } = setup();
        item("src").focus();
        await user.keyboard("{ArrowLeft}");
        expect(item("src").getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(item("src"));
    });

    test("ArrowLeft on a child moves focus to its parent folder", async () => {
        const { user, item } = setup();
        item("index").focus();
        await user.keyboard("{ArrowLeft}");
        expect(document.activeElement).toBe(item("lib"));
        await user.keyboard("{ArrowLeft}");
        expect(item("lib").getAttribute("aria-expanded")).toBe("false");
        await user.keyboard("{ArrowLeft}");
        expect(document.activeElement).toBe(item("src"));
    });

    test("closing a folder removes its children from keyboard order", async () => {
        const { user, item } = setup();
        item("src").focus();
        await user.keyboard("{ArrowLeft}{ArrowDown}");
        expect(document.activeElement).toBe(item("docs"));
    });

    test("* expands all closed sibling folders at the focused level", async () => {
        const { user, item } = setup();
        item("src").focus();
        await user.keyboard("*");
        expect(item("docs").getAttribute("aria-expanded")).toBe("true");
        expect(item("etc").getAttribute("aria-expanded")).toBe("true");
        expect(item("src").getAttribute("aria-expanded")).toBe("true");
    });

    test("* does not expand folders at other levels", async () => {
        const { user, item } = setup(`
          <li role="treeitem" aria-expanded="true" data-id="a">a<ul role="group">
            <li role="treeitem" aria-expanded="false" data-id="b">b<ul role="group"><li role="treeitem">c</li></ul></li>
          </ul></li>
          <li role="treeitem" aria-expanded="false" data-id="d">d<ul role="group"><li role="treeitem">e</li></ul></li>`);
        item("a").focus();
        await user.keyboard("*");
        expect(item("d").getAttribute("aria-expanded")).toBe("true");
        expect(item("b").getAttribute("aria-expanded")).toBe("false");
    });

    test("typeahead moves to the next visible item starting with the typed character", async () => {
        const { user, item } = setup();
        item("src").focus();
        await user.keyboard("r");
        expect(document.activeElement).toBe(item("readme"));
    });

    test("typeahead ignores items hidden in closed folders", async () => {
        const { user, item } = setup();
        item("src").focus();
        await user.keyboard("g");
        expect(document.activeElement).toBe(item("src"));
    });

    test("typeahead matches a multi-character prefix", async () => {
        const { user, item } = setup();
        item("src").focus();
        await user.keyboard("ap");
        expect(document.activeElement).toBe(item("app"));
    });

    test("typeahead matches a folder's own text, not its nested children", async () => {
        const { user, item } = setup();
        item("readme").focus();
        await user.keyboard("s");
        expect(document.activeElement).toBe(item("src"));
    });

    test("Enter and Space activate the focused item", async () => {
        const { user, item } = setup();
        const clicks: string[] = [];
        item("readme").addEventListener("click", () => clicks.push("readme"));
        item("readme").focus();
        await user.keyboard("{Enter}");
        await user.keyboard(" ");
        expect(clicks).toEqual(["readme", "readme"]);
    });

    test("if the tab stop gets hidden the tab stop moves to a visible item", async () => {
        const { item, container } = setup();
        item("index").focus();
        item("src").setAttribute("aria-expanded", "false");
        await new Promise((r) => setTimeout(r, 0));
        const stops = container.querySelectorAll("[role=treeitem][tabindex='0']");
        expect(stops).toHaveLength(1);
        expect(stops[0]).not.toBe(item("index"));
    });
});
