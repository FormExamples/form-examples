import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ContainerWithFluidWidth.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ContainerWithFluidWidth", () => {
    test("renders with the container-with-fluid-width class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Content"),
        }});

        const root = container.querySelector(".container-with-fluid-width") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("defaults to 1rem horizontal padding", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Default"),
        }});

        const root = container.querySelector(".container-with-fluid-width") as HTMLElement;
        expect(root.getAttribute("data-padding-inline")).toBe("1rem");
        expect(root.getAttribute("style")).toContain("padding-inline: 1rem");
    });

    test("applies custom padding-inline", () => {
        const { container } = render(Subject, { props: {
            paddingInline: "2rem",
            children: textSnippet("Custom"),
        }});

        const root = container.querySelector(".container-with-fluid-width") as HTMLElement;
        expect(root.getAttribute("data-padding-inline")).toBe("2rem");
        expect(root.getAttribute("style")).toContain("padding-inline: 2rem");
    });

    test("applies width: 100%", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Wide"),
        }});

        const root = container.querySelector(".container-with-fluid-width") as HTMLElement;
        expect(root.getAttribute("style")).toContain("width: 100%");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Inner"),
        }});

        const root = container.querySelector(".container-with-fluid-width") as HTMLElement;
        expect(root.textContent).toContain("Inner");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".container-with-fluid-width") as HTMLElement;
        expect(root.className).toContain("container-with-fluid-width");
        expect(root.className).toContain("extra");
    });
});
