import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Affix.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Affix", () => {
    test("renders as a div with the affix class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Sticky"),
        }});

        const root = container.querySelector("div.affix") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.tagName).toBe("DIV");
    });

    test("defaults to position sticky with top 0 when no offsets given", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Sticky"),
        }});

        const root = container.querySelector("div.affix") as HTMLElement;
        const style = root.getAttribute("style") ?? "";
        expect(style).toContain("position: sticky");
        expect(style).toContain("top: 0px");
    });

    test("applies offsetTop when provided", () => {
        const { container } = render(Subject, { props: {
            offsetTop: 64,
            children: textSnippet("Sticky"),
        }});

        const root = container.querySelector("div.affix") as HTMLElement;
        const style = root.getAttribute("style") ?? "";
        expect(style).toContain("top: 64px");
        expect(root.getAttribute("data-offset-top")).toBe("64");
    });

    test("applies offsetBottom when provided", () => {
        const { container } = render(Subject, { props: {
            offsetBottom: 24,
            children: textSnippet("Sticky"),
        }});

        const root = container.querySelector("div.affix") as HTMLElement;
        const style = root.getAttribute("style") ?? "";
        expect(style).toContain("bottom: 24px");
        expect(root.getAttribute("data-offset-bottom")).toBe("24");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Pinned content"),
        }});

        const root = container.querySelector("div.affix") as HTMLElement;
        expect(root.textContent).toContain("Pinned content");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: textSnippet("X"),
        }});

        const root = container.querySelector("div.affix") as HTMLElement;
        expect(root.className).toContain("affix");
        expect(root.className).toContain("extra");
    });
});
