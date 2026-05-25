import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CollectionList.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const template = document.createElement("template");
        template.innerHTML = html;
        $$anchor.before(template.content.cloneNode(true));
    }) as any;
}

describe("CollectionList", () => {
    test("renders as a ul with the collection-list class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("items"),
        }});

        const root = container.querySelector("ul.collection-list") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies aria-label when provided", () => {
        render(Subject, { props: {
            label: "Latest articles",
            children: textSnippet("items"),
        }});

        const list = screen.getByRole("list", { name: "Latest articles" });
        expect(list).toBeTruthy();
        expect(list.getAttribute("aria-label")).toBe("Latest articles");
    });

    test("omits aria-label when not provided", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("items"),
        }});

        const root = container.querySelector("ul") as HTMLElement;
        expect(root.hasAttribute("aria-label")).toBe(false);
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet("<li>One</li><li>Two</li>"),
        }});

        const items = container.querySelectorAll("li");
        expect(items.length).toBe(2);
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: textSnippet("x"),
        }});

        const root = container.querySelector("ul") as HTMLElement;
        expect(root.className).toContain("collection-list");
        expect(root.className).toContain("extra");
    });
});
