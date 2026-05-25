import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ClampText.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ClampText", () => {
    test("renders with the clamp-text class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Long content here"),
        }});

        const root = container.querySelector(".clamp-text") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("defaults to 2 lines", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Default lines"),
        }});

        const root = container.querySelector(".clamp-text") as HTMLElement;
        expect(root.getAttribute("data-lines")).toBe("2");
    });

    test("applies custom lines prop", () => {
        const { container } = render(Subject, { props: {
            lines: 5,
            children: textSnippet("Five lines"),
        }});

        const root = container.querySelector(".clamp-text") as HTMLElement;
        expect(root.getAttribute("data-lines")).toBe("5");
    });

    test("sets the --clamp-text-lines CSS custom property", () => {
        const { container } = render(Subject, { props: {
            lines: 3,
            children: textSnippet("CSS var"),
        }});

        const root = container.querySelector(".clamp-text") as HTMLElement;
        expect(root.getAttribute("style")).toContain("--clamp-text-lines: 3");
    });

    test("applies aria-label when provided", () => {
        render(Subject, { props: {
            label: "Article excerpt",
            children: textSnippet("Excerpt body"),
        }});

        const root = screen.getByLabelText("Article excerpt");
        expect(root).toBeTruthy();
    });

    test("renders the children content", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Visible text content"),
        }});

        const root = container.querySelector(".clamp-text") as HTMLElement;
        expect(root.textContent).toContain("Visible text content");
    });

    test("appends the consumer class to the base class", () => {
        const { container } = render(Subject, { props: {
            class: "my-extra-class",
            children: textSnippet("Class test"),
        }});

        const root = container.querySelector(".clamp-text") as HTMLElement;
        expect(root.className).toContain("clamp-text");
        expect(root.className).toContain("my-extra-class");
    });
});
