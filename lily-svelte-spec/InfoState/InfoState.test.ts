import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./InfoState.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("InfoState", () => {
    test("renders as a <section> with the info-state class", () => {
        const { container } = render(Subject, { props: {
            title: "No results",
        }});

        const root = container.querySelector("section.info-state") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("has role status", () => {
        const { container } = render(Subject, { props: {
            title: "Status",
        }});

        const root = container.querySelector("section") as HTMLElement;
        expect(root.getAttribute("role")).toBe("status");
    });

    test("defaults to level info", () => {
        const { container } = render(Subject, { props: {
            title: "Info",
        }});

        const root = container.querySelector("section") as HTMLElement;
        expect(root.getAttribute("data-level")).toBe("info");
    });

    test("applies custom level via data-level", () => {
        const { container } = render(Subject, { props: {
            level: "error",
            title: "Error",
        }});

        const root = container.querySelector("section") as HTMLElement;
        expect(root.getAttribute("data-level")).toBe("error");
    });

    test("renders the title in an h2", () => {
        render(Subject, { props: {
            title: "No results found",
        }});

        const h2 = screen.getByRole("heading", { level: 2 });
        expect(h2.textContent).toContain("No results found");
    });

    test("renders the description when provided", () => {
        const { container } = render(Subject, { props: {
            title: "No results",
            description: "Try a different filter.",
        }});

        const p = container.querySelector(".info-state-description") as HTMLElement;
        expect(p.textContent).toContain("Try a different filter.");
    });

    test("does not render description when not provided", () => {
        const { container } = render(Subject, { props: {
            title: "No description",
        }});

        const p = container.querySelector(".info-state-description");
        expect(p).toBeNull();
    });

    test("aria-label defaults to title", () => {
        const { container } = render(Subject, { props: {
            title: "My title",
        }});

        const root = container.querySelector("section") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("My title");
    });

    test("aria-label override wins over title", () => {
        const { container } = render(Subject, { props: {
            title: "Title text",
            label: "Custom label",
        }});

        const root = container.querySelector("section") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Custom label");
    });

    test("renders custom children when provided (overrides default layout)", () => {
        const { container } = render(Subject, { props: {
            title: "Ignored",
            children: textSnippet("Custom content here"),
        }});

        const root = container.querySelector("section") as HTMLElement;
        expect(root.textContent).toContain("Custom content here");
        // h2 should not render when children take over
        const h2 = root.querySelector("h2");
        expect(h2).toBeNull();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            title: "X",
            class: "extra",
        }});

        const root = container.querySelector("section") as HTMLElement;
        expect(root.className).toContain("info-state");
        expect(root.className).toContain("extra");
    });
});
