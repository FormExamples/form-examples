import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ContainerWithFixedWidth.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ContainerWithFixedWidth", () => {
    test("renders with the container-with-fixed-width class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Content"),
        }});

        const root = container.querySelector(".container-with-fixed-width") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("defaults to 1200px max width", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Default"),
        }});

        const root = container.querySelector(".container-with-fixed-width") as HTMLElement;
        expect(root.getAttribute("data-max-width")).toBe("1200px");
        expect(root.getAttribute("style")).toContain("max-width: 1200px");
    });

    test("applies custom max width", () => {
        const { container } = render(Subject, { props: {
            maxWidth: "960px",
            children: textSnippet("Custom"),
        }});

        const root = container.querySelector(".container-with-fixed-width") as HTMLElement;
        expect(root.getAttribute("data-max-width")).toBe("960px");
        expect(root.getAttribute("style")).toContain("max-width: 960px");
    });

    test("centers via margin-inline: auto", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Centered"),
        }});

        const root = container.querySelector(".container-with-fixed-width") as HTMLElement;
        expect(root.getAttribute("style")).toContain("margin-inline: auto");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Inner content"),
        }});

        const root = container.querySelector(".container-with-fixed-width") as HTMLElement;
        expect(root.textContent).toContain("Inner content");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "custom",
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".container-with-fixed-width") as HTMLElement;
        expect(root.className).toContain("container-with-fixed-width");
        expect(root.className).toContain("custom");
    });
});
