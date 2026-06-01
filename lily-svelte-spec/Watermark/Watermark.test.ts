import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Watermark.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Watermark", () => {
    test("renders as a div with the watermark class", () => {
        const { container } = render(Subject, { props: {
            text: "Confidential",
        }});

        const root = container.querySelector("div.watermark") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.tagName).toBe("DIV");
    });

    test("renders an overlay with aria-hidden=true", () => {
        const { container } = render(Subject, { props: {
            text: "Confidential",
        }});

        const overlay = container.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay).toBeTruthy();
        expect(overlay.getAttribute("aria-hidden")).toBe("true");
    });

    test("default gap is 100px and rotate is -22", () => {
        const { container } = render(Subject, { props: {
            text: "Confidential",
        }});

        const root = container.querySelector("div.watermark") as HTMLElement;
        expect(root.getAttribute("data-gap")).toBe("100px");
        expect(root.getAttribute("data-rotate")).toBe("-22");
    });

    test("supports custom gap and rotate", () => {
        const { container } = render(Subject, { props: {
            text: "X",
            gap: "60px",
            rotate: 45,
        }});

        const root = container.querySelector("div.watermark") as HTMLElement;
        expect(root.getAttribute("data-gap")).toBe("60px");
        expect(root.getAttribute("data-rotate")).toBe("45");
    });

    test("overlay exposes text via data-text", () => {
        const { container } = render(Subject, { props: {
            text: "Confidential",
        }});

        const overlay = container.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay.getAttribute("data-text")).toBe("Confidential");
    });

    test("overlay exposes imageUrl via data-image-url", () => {
        const { container } = render(Subject, { props: {
            imageUrl: "/wm.png",
        }});

        const overlay = container.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay.getAttribute("data-image-url")).toBe("/wm.png");
    });

    test("renders children beneath the overlay", () => {
        const { container } = render(Subject, { props: {
            text: "WM",
            children: textSnippet("Document body"),
        }});

        const root = container.querySelector("div.watermark") as HTMLElement;
        expect(root.textContent).toContain("Document body");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            text: "X",
            class: "extra",
        }});

        const root = container.querySelector("div.watermark") as HTMLElement;
        expect(root.className).toContain("watermark");
        expect(root.className).toContain("extra");
    });
});
