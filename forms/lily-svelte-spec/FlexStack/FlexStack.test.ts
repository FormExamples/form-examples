import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./FlexStack.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("FlexStack", () => {
    test("renders with the flex-stack class", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Items"),
        }});

        const root = container.querySelector(".flex-stack") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("defaults to column direction", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Default"),
        }});

        const root = container.querySelector(".flex-stack") as HTMLElement;
        expect(root.getAttribute("data-direction")).toBe("column");
        expect(root.getAttribute("style")).toContain("flex-direction: column");
    });

    test("applies row direction", () => {
        const { container } = render(Subject, { props: {
            direction: "row",
            children: textSnippet("Row"),
        }});

        const root = container.querySelector(".flex-stack") as HTMLElement;
        expect(root.getAttribute("data-direction")).toBe("row");
        expect(root.getAttribute("style")).toContain("flex-direction: row");
    });

    test("defaults to 1rem gap", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Gap"),
        }});

        const root = container.querySelector(".flex-stack") as HTMLElement;
        expect(root.getAttribute("style")).toContain("gap: 1rem");
    });

    test("applies custom gap", () => {
        const { container } = render(Subject, { props: {
            gap: "2rem",
            children: textSnippet("Custom gap"),
        }});

        const root = container.querySelector(".flex-stack") as HTMLElement;
        expect(root.getAttribute("style")).toContain("gap: 2rem");
    });

    test("applies align-items when provided", () => {
        const { container } = render(Subject, { props: {
            align: "center",
            children: textSnippet("Aligned"),
        }});

        const root = container.querySelector(".flex-stack") as HTMLElement;
        expect(root.getAttribute("style")).toContain("align-items: center");
    });

    test("applies justify-content when provided", () => {
        const { container } = render(Subject, { props: {
            justify: "space-between",
            children: textSnippet("Justified"),
        }});

        const root = container.querySelector(".flex-stack") as HTMLElement;
        expect(root.getAttribute("style")).toContain("justify-content: space-between");
    });

    test("uses display: flex", () => {
        const { container } = render(Subject, { props: {
            children: textSnippet("Flex"),
        }});

        const root = container.querySelector(".flex-stack") as HTMLElement;
        expect(root.getAttribute("style")).toContain("display: flex");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            class: "extra",
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".flex-stack") as HTMLElement;
        expect(root.className).toContain("flex-stack");
        expect(root.className).toContain("extra");
    });
});
