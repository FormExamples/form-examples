import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./StepList.svelte";

// Helper to create a Svelte 5 snippet for children content.
function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        $$anchor.before(tpl.content);
    }) as any;
}

describe("StepList", () => {
    test("renders as an ol with the step-list class", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet("<li>Step 1</li>"),
        }});

        const root = container.querySelector("ol.step-list") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.tagName).toBe("OL");
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, { props: {
            label: "Checkout steps",
            children: htmlSnippet("<li>Step 1</li>"),
        }});

        const root = container.querySelector("ol.step-list") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Checkout steps");
    });

    test("applies data-current when provided", () => {
        const { container } = render(Subject, { props: {
            current: 1,
            children: htmlSnippet("<li>Step 1</li>"),
        }});

        const root = container.querySelector("ol.step-list") as HTMLElement;
        expect(root.getAttribute("data-current")).toBe("1");
    });

    test("renders children", () => {
        const { container } = render(Subject, { props: {
            children: htmlSnippet("<li>One</li><li>Two</li>"),
        }});

        const root = container.querySelector("ol.step-list") as HTMLElement;
        expect(root.querySelectorAll("li").length).toBe(2);
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: htmlSnippet("<li>One</li>"),
        }});

        const root = container.querySelector("ol.step-list") as HTMLElement;
        expect(root.className).toContain("step-list");
        expect(root.className).toContain("extra");
    });
});
