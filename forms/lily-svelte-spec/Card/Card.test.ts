import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Card.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Card", () => {
    test("renders as an article element", () => {
        render(Subject, { props: {
            children: textSnippet("Card content"),
        }});

        const article = screen.getByRole("article");
        expect(article).toBeTruthy();
        expect(article.textContent).toContain("Card content");
    });

    test("renders heading when provided", () => {
        render(Subject, { props: {
            heading: "My Card",
            children: textSnippet("Content"),
        }});

        const heading = screen.getByRole("heading", { name: "My Card" });
        expect(heading.tagName.toLowerCase()).toBe("h3");
    });

    test("renders heading with custom level", () => {
        render(Subject, { props: {
            heading: "Section",
            headingLevel: 2,
            children: textSnippet("Content"),
        }});

        expect(screen.getByRole("heading").tagName.toLowerCase()).toBe("h2");
    });

    test("renders heading as link when href provided", () => {
        render(Subject, { props: {
            heading: "Product",
            href: "/products/1",
            children: textSnippet("Desc"),
        }});

        const link = screen.getByRole("link", { name: "Product" });
        expect(link.getAttribute("href")).toBe("/products/1");
    });

    test("applies aria-label", () => {
        render(Subject, { props: {
            label: "Featured card",
            children: textSnippet("Content"),
        }});

        expect(screen.getByRole("article", { name: "Featured card" })).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            "data-testid": "card",
            children: textSnippet("Content"),
        }});

        expect(screen.getByTestId("card")).toBeTruthy();
    });
});
