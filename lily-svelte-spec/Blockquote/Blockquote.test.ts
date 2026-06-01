import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Blockquote.svelte";

// Helper to create a Svelte 5 snippet for children content.
function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const template = document.createElement("template");
        template.innerHTML = html;
        $$anchor.before(template.content.cloneNode(true));
    }) as any;
}

describe("Blockquote", () => {
    test("renders as a blockquote with the blockquote class", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet("<p>Quoted text.</p>"),
        }});

        const root = container.querySelector("blockquote.blockquote") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: htmlSnippet("<p>Quoted.</p>"),
        }});

        const root = container.querySelector("blockquote") as HTMLElement;
        expect(root.className).toContain("blockquote");
        expect(root.className).toContain("extra");
    });

    test("applies cite attribute when provided", () => {
        const { container } = render(Subject, { props: {
            cite: "https://example.com/source",
            children: htmlSnippet("<p>Quoted.</p>"),
        }});

        const root = container.querySelector("blockquote") as HTMLElement;
        expect(root.getAttribute("cite")).toBe("https://example.com/source");
    });

    test("renders citation footer when citationText provided", () => {
        const { container } = render(Subject, { props: {
            citationText: "— Jane Doe, Book Title",
            children: htmlSnippet("<p>Quoted.</p>"),
        }});

        const footer = container.querySelector("footer.blockquote-citation") as HTMLElement;
        expect(footer).toBeTruthy();
        expect(footer.textContent).toContain("Jane Doe");
    });

    test("does not render citation footer when citationText omitted", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet("<p>Quoted.</p>"),
        }});

        const footer = container.querySelector("footer.blockquote-citation");
        expect(footer).toBeNull();
    });

    test("applies aria-label when label provided", () => {
        const { container } = render(Subject, { props: {
            label: "Inspirational quote",
            children: htmlSnippet("<p>Quoted.</p>"),
        }});

        const root = container.querySelector("blockquote") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Inspirational quote");
    });
});
