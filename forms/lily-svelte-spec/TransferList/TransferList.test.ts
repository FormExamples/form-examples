import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TransferList.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("TransferList", () => {
    test("renders as a div with the transfer-list class and group role", () => {
        const { container } = render(Subject, { props: {
            label: "Roles",
            sourceLabel: "Available",
            targetLabel: "Selected",
            source: textSnippet("source"),
            target: textSnippet("target"),
        }});

        const root = container.querySelector("div.transfer-list") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Roles");
    });

    test("renders source section with sourceLabel", () => {
        const { container } = render(Subject, { props: {
            label: "Roles",
            sourceLabel: "Available roles",
            targetLabel: "Selected roles",
            source: textSnippet("Source content"),
            target: textSnippet("target"),
        }});

        const sourceSection = container.querySelector(".transfer-list-source") as HTMLElement;
        expect(sourceSection).toBeTruthy();
        expect(sourceSection.tagName).toBe("SECTION");
        expect(sourceSection.getAttribute("aria-label")).toBe("Available roles");
        expect(sourceSection.textContent).toContain("Source content");
    });

    test("renders target section with targetLabel", () => {
        const { container } = render(Subject, { props: {
            label: "Roles",
            sourceLabel: "Available roles",
            targetLabel: "Selected roles",
            source: textSnippet("source"),
            target: textSnippet("Target content"),
        }});

        const targetSection = container.querySelector(".transfer-list-target") as HTMLElement;
        expect(targetSection).toBeTruthy();
        expect(targetSection.tagName).toBe("SECTION");
        expect(targetSection.getAttribute("aria-label")).toBe("Selected roles");
        expect(targetSection.textContent).toContain("Target content");
    });

    test("renders actions when provided", () => {
        const { container } = render(Subject, { props: {
            label: "Roles",
            sourceLabel: "Available",
            targetLabel: "Selected",
            source: textSnippet("source"),
            target: textSnippet("target"),
            actions: textSnippet("Move buttons"),
        }});

        const actionsRegion = container.querySelector(".transfer-list-actions") as HTMLElement;
        expect(actionsRegion).toBeTruthy();
        expect(actionsRegion.textContent).toContain("Move buttons");
    });

    test("omits actions when not provided", () => {
        const { container } = render(Subject, { props: {
            label: "Roles",
            sourceLabel: "Available",
            targetLabel: "Selected",
            source: textSnippet("source"),
            target: textSnippet("target"),
        }});

        expect(container.querySelector(".transfer-list-actions")).toBeNull();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            sourceLabel: "S",
            targetLabel: "T",
            source: textSnippet("s"),
            target: textSnippet("t"),
            class: "extra",
        }});

        const root = container.querySelector("div.transfer-list") as HTMLElement;
        expect(root.className).toContain("transfer-list");
        expect(root.className).toContain("extra");
    });
});
