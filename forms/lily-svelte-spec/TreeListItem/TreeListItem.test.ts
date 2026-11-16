import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import TreeListItem from "./TreeListItem.svelte";

describe("TreeListItem", () => {
    test("renders with content", () => {
        render(TreeListItem, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("tree-list-item");
    });

    test("is a focusable li role=treeitem (tabindex=-1) so TreeList's arrow keys can focus it", () => {
        const { container } = render(TreeListItem, {
            props: { label: "Test", children: (() => {}) as any },
        });
        const el = container.querySelector(".tree-list-item") as HTMLElement;
        expect(el.tagName).toBe("LI");
        expect(el.getAttribute("role")).toBe("treeitem");
        expect(el.getAttribute("tabindex")).toBe("-1");
    });

    test("a consumer tabindex overrides the default (roving tabindex: the active item is 0)", () => {
        const { container } = render(TreeListItem, {
            props: { label: "Test", tabindex: "0", children: (() => {}) as any },
        });
        expect(container.querySelector(".tree-list-item")?.getAttribute("tabindex")).toBe("0");
    });
});

function slotSnippet(text: string) {
    return (($$anchor: Comment) => {
        const wrap = document.createDocumentFragment();
        wrap.append(document.createTextNode(text));
        const group = document.createElement("ol");
        group.setAttribute("role", "group");
        group.id = "slot";
        wrap.append(group);
        $$anchor.before(wrap);
    }) as any;
}

function leafSnippet() {
    return (($$anchor: Comment) => {
        $$anchor.before(document.createTextNode("child"));
    }) as any;
}

/** A parent item holding a child item (both real TreeListItems), plus a top-level leaf. */
function renderTree(expanded: boolean | undefined) {
    const tree = document.createElement("ol");
    tree.setAttribute("role", "tree");
    document.body.appendChild(tree);
    const parent = render(TreeListItem, {
        props: { id: "parent", expanded, children: slotSnippet("parent") },
        target: tree,
    });
    const child = render(TreeListItem, {
        props: { id: "child", children: leafSnippet() },
        target: document.getElementById("slot")!,
    });
    const leaf = render(TreeListItem, {
        props: { id: "leaf", children: leafSnippet() },
        target: tree,
    });
    return {
        parent: document.getElementById("parent")!,
        child: document.getElementById("child")!,
        leaf: document.getElementById("leaf")!,
        cleanup: () => {
            parent.unmount();
            child.unmount();
            leaf.unmount();
            tree.remove();
        },
    };
}

describe("TreeListItem — expand, collapse and move between levels", () => {
    test("aria-expanded follows the state; a leaf has none", () => {
        const t = renderTree(false);
        expect(t.parent.getAttribute("aria-expanded")).toBe("false");
        expect(t.leaf.hasAttribute("aria-expanded")).toBe(false);
        t.cleanup();
    });

    test("ArrowRight expands a collapsed item", async () => {
        const t = renderTree(false);
        const user = userEvent.setup();
        t.parent.focus();
        await user.keyboard("{ArrowRight}");
        expect(t.parent.getAttribute("aria-expanded")).toBe("true");
        t.cleanup();
    });

    test("ArrowRight on an expanded item focuses its first child", async () => {
        const t = renderTree(true);
        const user = userEvent.setup();
        t.parent.focus();
        await user.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(t.child);
        t.cleanup();
    });

    test("ArrowLeft collapses an expanded item", async () => {
        const t = renderTree(true);
        const user = userEvent.setup();
        t.parent.focus();
        await user.keyboard("{ArrowLeft}");
        expect(t.parent.getAttribute("aria-expanded")).toBe("false");
        t.cleanup();
    });

    test("ArrowLeft in a child moves focus to the parent without collapsing it", async () => {
        const t = renderTree(true);
        const user = userEvent.setup();
        t.child.focus();
        await user.keyboard("{ArrowLeft}");
        expect(document.activeElement).toBe(t.parent);
        expect(t.parent.getAttribute("aria-expanded")).toBe("true");
        t.cleanup();
    });

    test("a leaf ignores ArrowRight and, at top level, ArrowLeft", async () => {
        const t = renderTree(false);
        const user = userEvent.setup();
        t.leaf.focus();
        await user.keyboard("{ArrowRight}{ArrowLeft}");
        expect(document.activeElement).toBe(t.leaf);
        t.cleanup();
    });

    test("in a right-to-left item the keys swap", async () => {
        const t = renderTree(false);
        const user = userEvent.setup();
        t.parent.style.direction = "rtl";
        t.parent.focus();
        await user.keyboard("{ArrowRight}");
        expect(t.parent.getAttribute("aria-expanded")).toBe("false");
        await user.keyboard("{ArrowLeft}");
        expect(t.parent.getAttribute("aria-expanded")).toBe("true");
        t.cleanup();
    });
});
