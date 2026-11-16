import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TreeSelect.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("TreeSelect", () => {
    test("renders as a div with the tree-select class and combobox trigger", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
            },
        });

        const root = container.querySelector("div.tree-select") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.querySelector("button")!.getAttribute("role")).toBe("combobox");
        expect(root.querySelector("button")!.getAttribute("aria-haspopup")).toBe("tree");
    });

    test("applies aria-label", () => {
        render(Subject, {
            props: {
                label: "Category select",
            },
        });

        const root = screen.getByRole("combobox");
        expect(root.getAttribute("aria-label")).toBe("Category select");
    });

    test("aria-expanded reflects expanded prop", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
                expanded: true,
            },
        });

        const root = container.querySelector("div.tree-select") as HTMLElement;
        expect(root.querySelector("button")!.getAttribute("aria-expanded")).toBe("true");
    });

    test("data-multiple set when multiple=true", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
                multiple: true,
            },
        });

        const root = container.querySelector("div.tree-select") as HTMLElement;
        expect(root.getAttribute("data-multiple")).toBe("true");
    });

    test("data-multiple absent when multiple=false", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
                multiple: false,
            },
        });

        const root = container.querySelector("div.tree-select") as HTMLElement;
        expect(root.getAttribute("data-multiple")).toBeNull();
    });

    test("panel hidden when not expanded", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
                expanded: false,
                children: textSnippet("Tree"),
            },
        });

        const panel = container.querySelector(".tree-select-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("panel visible when expanded", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
                expanded: true,
                children: textSnippet("Tree"),
            },
        });

        const panel = container.querySelector(".tree-select-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);
        expect(panel.textContent).toContain("Tree");
    });

    test("trigger displays value when provided", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
                value: "Books / Fiction",
            },
        });

        const trigger = container.querySelector(".tree-select-trigger") as HTMLElement;
        expect(trigger.textContent).toContain("Books / Fiction");
    });

    test("trigger displays placeholder when no value", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
                placeholder: "Choose category",
            },
        });

        const trigger = container.querySelector(".tree-select-trigger") as HTMLElement;
        expect(trigger.textContent).toContain("Choose category");
    });

    test("trigger can be disabled", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
                disabled: true,
            },
        });

        const trigger = container.querySelector(".tree-select-trigger") as HTMLButtonElement;
        expect(trigger.disabled).toBe(true);
    });

    test("invokes onclick handler", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        const { container } = render(Subject, {
            props: {
                label: "Category",
                onclick: handleClick,
            },
        });

        const trigger = container.querySelector(".tree-select-trigger") as HTMLButtonElement;
        await user.click(trigger);
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, {
            props: {
                label: "Category",
                class: "extra",
            },
        });

        const root = container.querySelector("div.tree-select") as HTMLElement;
        expect(root.className).toContain("tree-select");
        expect(root.className).toContain("extra");
    });
});
