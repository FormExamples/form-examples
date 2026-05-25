import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SplitView.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("SplitView", () => {
    test("renders with the split-view class and aria-label", () => {
        const { container } = render(Subject, { props: {
            label: "Editor and preview",
            primary: textSnippet("PRIMARY"),
            secondary: textSnippet("SECONDARY"),
        }});

        const root = container.querySelector("div.split-view") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("aria-label")).toBe("Editor and preview");
    });

    test("default orientation is horizontal and exposed as data attribute", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            primary: textSnippet("P"),
            secondary: textSnippet("S"),
        }});

        const root = container.querySelector(".split-view") as HTMLElement;
        expect(root.getAttribute("data-orientation")).toBe("horizontal");
    });

    test("vertical orientation is exposed as data attribute", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            orientation: "vertical",
            primary: textSnippet("P"),
            secondary: textSnippet("S"),
        }});

        const root = container.querySelector(".split-view") as HTMLElement;
        expect(root.getAttribute("data-orientation")).toBe("vertical");
    });

    test("default splitPercent is 50 and exposed as data attribute", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            primary: textSnippet("P"),
            secondary: textSnippet("S"),
        }});

        const root = container.querySelector(".split-view") as HTMLElement;
        expect(root.getAttribute("data-split-percent")).toBe("50");
    });

    test("renders primary and secondary section panels", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            primary: textSnippet("PRIMARY-CONTENT"),
            secondary: textSnippet("SECONDARY-CONTENT"),
        }});

        const primary = container.querySelector(
            "section.split-view-primary",
        ) as HTMLElement;
        const secondary = container.querySelector(
            "section.split-view-secondary",
        ) as HTMLElement;
        expect(primary.textContent).toContain("PRIMARY-CONTENT");
        expect(secondary.textContent).toContain("SECONDARY-CONTENT");
    });

    test("default divider has role separator and ARIA values", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            splitPercent: 60,
            primary: textSnippet("P"),
            secondary: textSnippet("S"),
        }});

        const sep = container.querySelector(".split-view-divider") as HTMLElement;
        expect(sep.getAttribute("role")).toBe("separator");
        expect(sep.getAttribute("aria-orientation")).toBe("horizontal");
        expect(sep.getAttribute("aria-valuenow")).toBe("60");
        expect(sep.getAttribute("aria-valuemin")).toBe("0");
        expect(sep.getAttribute("aria-valuemax")).toBe("100");
        expect(sep.getAttribute("tabindex")).toBe("0");
    });

    test("custom divider snippet replaces the default separator", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            primary: textSnippet("P"),
            secondary: textSnippet("S"),
            divider: textSnippet("CUSTOM-DIVIDER"),
        }});

        expect(container.querySelector(".split-view-divider")).toBeNull();
        expect(container.textContent).toContain("CUSTOM-DIVIDER");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            class: "extra",
            primary: textSnippet("P"),
            secondary: textSnippet("S"),
        }});

        const root = container.querySelector(".split-view") as HTMLElement;
        expect(root.className).toContain("split-view");
        expect(root.className).toContain("extra");
    });
});
