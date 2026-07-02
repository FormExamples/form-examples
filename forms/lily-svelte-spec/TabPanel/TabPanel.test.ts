import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TabPanel.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("TabPanel", () => {
    test("renders as a tabpanel with the tab-panel class", () => {
        const { container } = render(Subject, { props: {
            label: "Details",
            selected: true,
        }});

        const root = container.querySelector("div.tab-panel") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("tabpanel");
    });

    test("uses aria-label when labelledBy is absent", () => {
        const { container } = render(Subject, { props: {
            label: "Details",
            selected: true,
        }});

        const root = container.querySelector(".tab-panel") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Details");
        expect(root.getAttribute("aria-labelledby")).toBeNull();
    });

    test("uses aria-labelledby when provided and omits aria-label", () => {
        const { container } = render(Subject, { props: {
            label: "Details",
            labelledBy: "tab-details",
            selected: true,
        }});

        const root = container.querySelector(".tab-panel") as HTMLElement;
        expect(root.getAttribute("aria-labelledby")).toBe("tab-details");
        expect(root.getAttribute("aria-label")).toBeNull();
    });

    test("is hidden when not selected", () => {
        const { container } = render(Subject, { props: {
            label: "Details",
            selected: false,
        }});

        const root = container.querySelector(".tab-panel") as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(true);
    });

    test("is visible when selected", () => {
        const { container } = render(Subject, { props: {
            label: "Details",
            selected: true,
        }});

        const root = container.querySelector(".tab-panel") as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(false);
    });

    test("has tabindex 0 so keyboard users can focus the panel", () => {
        const { container } = render(Subject, { props: {
            label: "Details",
            selected: true,
        }});

        const root = container.querySelector(".tab-panel") as HTMLElement;
        expect(root.getAttribute("tabindex")).toBe("0");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            label: "Details",
            selected: true,
            children: textSnippet("PANEL-CONTENT"),
        }});

        expect(container.textContent).toContain("PANEL-CONTENT");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Details",
            class: "extra",
        }});

        const root = container.querySelector(".tab-panel") as HTMLElement;
        expect(root.className).toContain("tab-panel");
        expect(root.className).toContain("extra");
    });
});
