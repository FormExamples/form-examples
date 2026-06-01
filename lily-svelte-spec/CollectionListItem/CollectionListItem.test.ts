import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CollectionListItem.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("CollectionListItem", () => {
    test("renders as an li with the collection-list-item class", () => {
        const { container } = render(Subject, { props: {
            heading: "Title",
        }});

        const root = container.querySelector("li.collection-list-item") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("renders the heading inside an h3", () => {
        const { container } = render(Subject, { props: {
            heading: "My title",
        }});

        const h3 = container.querySelector("h3.collection-list-item-heading") as HTMLElement;
        expect(h3).toBeTruthy();
        expect(h3.textContent).toContain("My title");
    });

    test("wraps heading in an <a> when href provided", () => {
        const { container } = render(Subject, { props: {
            heading: "Linked",
            href: "/page",
        }});

        const link = container.querySelector("h3 a") as HTMLAnchorElement;
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/page");
        expect(link.textContent).toBe("Linked");
    });

    test("renders plain heading when no href", () => {
        const { container } = render(Subject, { props: {
            heading: "Plain",
        }});

        const link = container.querySelector("h3 a");
        expect(link).toBeNull();
    });

    test("renders an image when imageUrl provided", () => {
        const { container } = render(Subject, { props: {
            heading: "With image",
            imageUrl: "/img.jpg",
            imageAlt: "Photo",
        }});

        const img = container.querySelector("img.collection-list-item-image") as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.getAttribute("src")).toBe("/img.jpg");
        expect(img.getAttribute("alt")).toBe("Photo");
    });

    test("omits the image when no imageUrl", () => {
        const { container } = render(Subject, { props: {
            heading: "No image",
        }});

        expect(container.querySelector("img")).toBeNull();
    });

    test("renders meta and description paragraphs when provided", () => {
        const { container } = render(Subject, { props: {
            heading: "Title",
            meta: "Mar 2026",
            description: "Body copy",
        }});

        const meta = container.querySelector("p.collection-list-item-meta") as HTMLElement;
        const desc = container.querySelector("p.collection-list-item-description") as HTMLElement;
        expect(meta.textContent).toBe("Mar 2026");
        expect(desc.textContent).toBe("Body copy");
    });

    test("applies aria-label override", () => {
        const { container } = render(Subject, { props: {
            heading: "Title",
            label: "Override",
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Override");
    });

    test("renders children when provided", () => {
        const { container } = render(Subject, { props: {
            heading: "Title",
            children: textSnippet("Extra content"),
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.textContent).toContain("Extra content");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            heading: "Title",
            class: "extra",
        }});

        const root = container.querySelector("li") as HTMLElement;
        expect(root.className).toContain("collection-list-item");
        expect(root.className).toContain("extra");
    });
});
