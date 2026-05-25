import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Pictogram.svelte";

// Helper to create a Svelte 5 snippet for HTML content.
function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const template = document.createElement("template");
        template.innerHTML = html;
        $$anchor.before(template.content.cloneNode(true));
    }) as any;
}

describe("Pictogram", () => {
    test("renders as a figure with the pictogram class", () => {
        const { container } = render(Subject, { props: {
            icon: htmlSnippet("<svg></svg>"),
        }});

        const root = container.querySelector("figure.pictogram") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("renders the required icon snippet inside aria-hidden container", () => {
        const { container } = render(Subject, { props: {
            icon: htmlSnippet("<svg data-testid='ico'></svg>"),
        }});

        const iconBox = container.querySelector(".pictogram-icon") as HTMLElement;
        expect(iconBox).toBeTruthy();
        expect(iconBox.getAttribute("aria-hidden")).toBe("true");
        expect(iconBox.querySelector("[data-testid='ico']")).toBeTruthy();
    });

    test("defaults layout to centered and applies as data-layout", () => {
        const { container } = render(Subject, { props: {
            icon: htmlSnippet("<svg></svg>"),
        }});

        const root = container.querySelector("figure") as HTMLElement;
        expect(root.getAttribute("data-layout")).toBe("centered");
    });

    test("supports side layout", () => {
        const { container } = render(Subject, { props: {
            icon: htmlSnippet("<svg></svg>"),
            layout: "side",
        }});

        const root = container.querySelector("figure") as HTMLElement;
        expect(root.getAttribute("data-layout")).toBe("side");
    });

    test("renders heading when provided", () => {
        const { container } = render(Subject, { props: {
            icon: htmlSnippet("<svg></svg>"),
            heading: "Privacy",
        }});

        const h3 = container.querySelector("h3.pictogram-heading") as HTMLElement;
        expect(h3).toBeTruthy();
        expect(h3.textContent).toContain("Privacy");
    });

    test("renders description when provided and no children", () => {
        const { container } = render(Subject, { props: {
            icon: htmlSnippet("<svg></svg>"),
            description: "Your data stays yours.",
        }});

        const p = container.querySelector("p.pictogram-description") as HTMLElement;
        expect(p).toBeTruthy();
        expect(p.textContent).toContain("Your data stays yours.");
    });

    test("children override description", () => {
        const { container } = render(Subject, { props: {
            icon: htmlSnippet("<svg></svg>"),
            description: "Default description.",
            children: htmlSnippet("<p data-testid='custom'>Custom content.</p>"),
        }});

        const custom = container.querySelector("[data-testid='custom']") as HTMLElement;
        const def = container.querySelector("p.pictogram-description");
        expect(custom).toBeTruthy();
        expect(def).toBeNull();
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, { props: {
            icon: htmlSnippet("<svg></svg>"),
            label: "Privacy pictogram",
        }});

        const root = container.querySelector("figure") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Privacy pictogram");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            icon: htmlSnippet("<svg></svg>"),
            class: "extra",
        }});

        const root = container.querySelector("figure") as HTMLElement;
        expect(root.className).toContain("pictogram");
        expect(root.className).toContain("extra");
    });
});
