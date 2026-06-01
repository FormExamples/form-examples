import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./IconListItem.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("IconListItem", () => {
    test("renders as an li with the icon-list-item class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Item"),
        }});

        const root = container.querySelector("li.icon-list-item") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("renders text content inside the text span", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Fast"),
        }});

        const text = container.querySelector("span.icon-list-item-text") as HTMLElement;
        expect(text.textContent).toContain("Fast");
    });

    test("omits the icon span when no icon provided", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("No icon"),
        }});

        expect(container.querySelector("span.icon-list-item-icon")).toBeNull();
    });

    test("renders the icon span with aria-hidden when icon provided", () => {
        const { container } = render(Subject, { props: {
            icon: textSnippet("★"),
            children: textSnippet("Starred"),
        }});

        const iconSpan = container.querySelector("span.icon-list-item-icon") as HTMLElement;
        expect(iconSpan).toBeTruthy();
        expect(iconSpan.getAttribute("aria-hidden")).toBe("true");
        expect(iconSpan.textContent).toContain("★");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: textSnippet("X"),
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.className).toContain("icon-list-item");
        expect(root.className).toContain("extra");
    });
});
