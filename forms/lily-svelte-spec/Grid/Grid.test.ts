import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Grid.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Grid", () => {
    test("renders with the grid class", () => {
        const { container } = render(Subject, {
            props: {
                children: textSnippet("Items"),
            },
        });

        const root = container.querySelector(".grid") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("defaults to 12 equal columns", () => {
        const { container } = render(Subject, {
            props: {
                children: textSnippet("Default"),
            },
        });

        const root = container.querySelector(".grid") as HTMLElement;
        expect(root.getAttribute("data-columns")).toBe("12");
        expect(root.getAttribute("style")).toContain("repeat(12, minmax(0, 1fr))");
    });

    test("uses repeat() for numeric columns", () => {
        const { container } = render(Subject, {
            props: {
                columns: 3,
                children: textSnippet("Three"),
            },
        });

        const root = container.querySelector(".grid") as HTMLElement;
        expect(root.getAttribute("style")).toContain("repeat(3, minmax(0, 1fr))");
    });

    test("uses string columns as-is", () => {
        const { container } = render(Subject, {
            props: {
                columns: "200px 1fr 200px",
                children: textSnippet("Custom"),
            },
        });

        const root = container.querySelector(".grid") as HTMLElement;
        expect(root.getAttribute("style")).toContain("grid-template-columns: 200px 1fr 200px");
    });

    test("defaults to 1rem gap", () => {
        const { container } = render(Subject, {
            props: {
                children: textSnippet("Gap"),
            },
        });

        const root = container.querySelector(".grid") as HTMLElement;
        expect(root.getAttribute("style")).toContain("gap: 1rem");
    });

    test("applies custom gap", () => {
        const { container } = render(Subject, {
            props: {
                gap: "2rem",
                children: textSnippet("Wide gap"),
            },
        });

        const root = container.querySelector(".grid") as HTMLElement;
        expect(root.getAttribute("style")).toContain("gap: 2rem");
    });

    test("uses display: grid", () => {
        const { container } = render(Subject, {
            props: {
                children: textSnippet("Grid"),
            },
        });

        const root = container.querySelector(".grid") as HTMLElement;
        expect(root.getAttribute("style")).toContain("display: grid");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, {
            props: {
                class: "extra",
                children: textSnippet("X"),
            },
        });

        const root = container.querySelector(".grid") as HTMLElement;
        expect(root.className).toContain("grid");
        expect(root.className).toContain("extra");
    });

    test("minColumnWidth generates a fluid auto-fit template", () => {
        const { container } = render(Subject, {
            props: {
                minColumnWidth: "12rem",
                children: textSnippet("Fluid"),
            },
        });

        const root = container.querySelector(".grid") as HTMLElement;
        expect(root.getAttribute("style")).toContain(
            "repeat(auto-fit, minmax(min(12rem, 100%), 1fr))",
        );
        expect(root.getAttribute("data-min-column-width")).toBe("12rem");
    });

    test("minColumnWidth wins over columns", () => {
        const { container } = render(Subject, {
            props: {
                columns: 3,
                minColumnWidth: "120px",
                children: textSnippet("Fluid"),
            },
        });

        const style = (container.querySelector(".grid") as HTMLElement).getAttribute("style");
        expect(style).toContain("min(120px, 100%)");
        expect(style).not.toContain("repeat(3,");
    });
});
