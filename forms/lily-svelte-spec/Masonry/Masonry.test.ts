import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Masonry.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Masonry", () => {
    test("renders with the masonry class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Items"),
        }});

        const root = container.querySelector(".masonry") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("defaults to 3 columns", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Default"),
        }});

        const root = container.querySelector(".masonry") as HTMLElement;
        expect(root.getAttribute("data-columns")).toBe("3");
        expect(root.getAttribute("style")).toContain("column-count: 3");
    });

    test("applies custom columns", () => {
        const { container } = render(Subject, { props: {
            columns: 5,
            children: textSnippet("Five"),
        }});

        const root = container.querySelector(".masonry") as HTMLElement;
        expect(root.getAttribute("data-columns")).toBe("5");
        expect(root.getAttribute("style")).toContain("column-count: 5");
    });

    test("defaults to 1rem gap", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Gap"),
        }});

        const root = container.querySelector(".masonry") as HTMLElement;
        expect(root.getAttribute("style")).toContain("column-gap: 1rem");
    });

    test("applies custom gap", () => {
        const { container } = render(Subject, { props: {
            gap: "2rem",
            children: textSnippet("Wide gap"),
        }});

        const root = container.querySelector(".masonry") as HTMLElement;
        expect(root.getAttribute("style")).toContain("column-gap: 2rem");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".masonry") as HTMLElement;
        expect(root.className).toContain("masonry");
        expect(root.className).toContain("extra");
    });
});
