import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ValidationList.svelte";

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

describe("ValidationList", () => {
    test("renders as a ul with the validation-list class", () => {
        const { container } = render(Subject, { props: {
            label: "Password requirements",
            children: textSnippet("rules"),
        }});

        const root = container.querySelector("ul.validation-list") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies aria-label", () => {
        render(Subject, { props: {
            label: "Password requirements",
            children: textSnippet("rules"),
        }});

        const list = screen.getByRole("list", { name: "Password requirements" });
        expect(list.getAttribute("aria-label")).toBe("Password requirements");
    });

    test("applies aria-live=polite", () => {
        const { container } = render(Subject, { props: {
            label: "Rules",
            children: textSnippet("x"),
        }});

        const root = container.querySelector("ul") as HTMLElement;
        expect(root.getAttribute("aria-live")).toBe("polite");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            label: "Rules",
            children: htmlSnippet("<li>One</li><li>Two</li>"),
        }});

        const items = container.querySelectorAll("li");
        expect(items.length).toBe(2);
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Rules",
            class: "extra",
            children: textSnippet("x"),
        }});

        const root = container.querySelector("ul") as HTMLElement;
        expect(root.className).toContain("validation-list");
        expect(root.className).toContain("extra");
    });
});
