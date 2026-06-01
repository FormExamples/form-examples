import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ContentsList.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ContentsList", () => {
    test("renders as an ordered list", () => {
        render(Subject, { props: { children: textSnippet("Items") } });
        expect(screen.getByRole("list")).toBeTruthy();
        expect(screen.getByRole("list").tagName).toBe("OL");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Section 1") } });
        expect(screen.getByRole("list").textContent).toContain("Section 1");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "cl", children: textSnippet("Items") } });
        expect(screen.getByTestId("cl")).toBeTruthy();
    });

    test("passes through aria-label", () => {
        render(Subject, { props: { "aria-label": "Sections", children: textSnippet("Items") } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Sections");
    });
});
