import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./FeatureCard.svelte";

// Helper to create a Svelte 5 snippet for children content.
function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const template = document.createElement("template");
        template.innerHTML = html;
        $$anchor.before(template.content.cloneNode(true));
    }) as any;
}

describe("FeatureCard", () => {
    test("renders as an article with the feature-card class", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
        }});

        const root = container.querySelector("article.feature-card") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("renders the required heading", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
        }});

        const h3 = container.querySelector("h3.feature-card-heading") as HTMLElement;
        expect(h3).toBeTruthy();
        expect(h3.textContent).toContain("Privacy first");
    });

    test("uses heading as the default aria-label", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
        }});

        const root = container.querySelector("article") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Privacy first");
    });

    test("aria-label prop overrides heading", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
            label: "Privacy feature card",
        }});

        const root = container.querySelector("article") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Privacy feature card");
    });

    test("defaults imagePosition to start", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
        }});

        const root = container.querySelector("article") as HTMLElement;
        expect(root.getAttribute("data-image-position")).toBe("start");
    });

    test("supports imagePosition top", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
            imagePosition: "top",
        }});

        const root = container.querySelector("article") as HTMLElement;
        expect(root.getAttribute("data-image-position")).toBe("top");
    });

    test("renders image when imageUrl is provided", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
            imageUrl: "/img.png",
            imageAlt: "Lock illustration",
        }});

        const img = container.querySelector("img.feature-card-image") as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.getAttribute("src")).toBe("/img.png");
        expect(img.getAttribute("alt")).toBe("Lock illustration");
    });

    test("does not render image when imageUrl is omitted", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
        }});

        const img = container.querySelector("img");
        expect(img).toBeNull();
    });

    test("renders description when provided", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
            description: "Your data stays yours.",
        }});

        const p = container.querySelector("p.feature-card-description") as HTMLElement;
        expect(p).toBeTruthy();
        expect(p.textContent).toContain("Your data stays yours.");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
            children: htmlSnippet("<a href='/learn'>Learn more</a>"),
        }});

        const link = container.querySelector("article a") as HTMLAnchorElement;
        expect(link).toBeTruthy();
        expect(link.textContent).toContain("Learn more");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            heading: "Privacy first",
            class: "extra",
        }});

        const root = container.querySelector("article") as HTMLElement;
        expect(root.className).toContain("feature-card");
        expect(root.className).toContain("extra");
    });
});
