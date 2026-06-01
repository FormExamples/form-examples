import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ProductCard.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ProductCard", () => {
    test("renders as an <article> with the product-card class", () => {
        const { container } = render(Subject, { props: {
            name: "Pillow",
            price: "$24.00",
        }});

        const root = container.querySelector("article.product-card") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("uses the name as the accessible label by default", () => {
        const { container } = render(Subject, { props: {
            name: "Linen Pillow",
            price: "$24.00",
        }});

        const root = container.querySelector("article") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Linen Pillow");
    });

    test("aria-label override wins over name", () => {
        const { container } = render(Subject, { props: {
            name: "Pillow",
            price: "$24.00",
            label: "Featured product",
        }});

        const root = container.querySelector("article") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Featured product");
    });

    test("renders the name in an h3", () => {
        render(Subject, { props: {
            name: "My Product",
            price: "$10",
        }});

        const heading = screen.getByRole("heading", { level: 3 });
        expect(heading.textContent).toContain("My Product");
    });

    test("renders the price text", () => {
        const { container } = render(Subject, { props: {
            name: "Item",
            price: "$24.00",
        }});

        const price = container.querySelector(".product-card-price") as HTMLElement;
        expect(price.textContent).toContain("$24.00");
    });

    test("renders the image when imageUrl provided", () => {
        const { container } = render(Subject, { props: {
            name: "Item",
            price: "$5",
            imageUrl: "/image.jpg",
            imageAlt: "Product image",
        }});

        const img = container.querySelector("img.product-card-image") as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.getAttribute("src")).toBe("/image.jpg");
        expect(img.getAttribute("alt")).toBe("Product image");
    });

    test("does not render an image when imageUrl is missing", () => {
        const { container } = render(Subject, { props: {
            name: "Item",
            price: "$5",
        }});

        expect(container.querySelector("img")).toBeNull();
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            name: "Item",
            price: "$5",
            children: textSnippet("Description here"),
        }});

        const root = container.querySelector("article") as HTMLElement;
        expect(root.textContent).toContain("Description here");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            name: "X",
            price: "$1",
            class: "extra",
        }});

        const root = container.querySelector("article") as HTMLElement;
        expect(root.className).toContain("product-card");
        expect(root.className).toContain("extra");
    });
});
