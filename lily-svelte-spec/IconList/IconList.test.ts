import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./IconList.svelte";

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

describe("IconList", () => {
    test("renders as a ul with the icon-list class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("items"),
        }});

        const root = container.querySelector("ul.icon-list") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies aria-label when provided", () => {
        render(Subject, { props: {
            label: "Features",
            children: textSnippet("items"),
        }});

        const list = screen.getByRole("list", { name: "Features" });
        expect(list.getAttribute("aria-label")).toBe("Features");
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
        expect(root.className).toContain("icon-list");
        expect(root.className).toContain("extra");
    });
});
