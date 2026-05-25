import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Sidebar.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("Sidebar", () => {
    test("renders an aside", () => {
        render(Subject, { props: { label: "Nav", "data-testid": "sb", children: textSnippet("content") } });
        expect(screen.getByTestId("sb").tagName).toBe("ASIDE");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Navigation", children: textSnippet("content") } });
        expect(screen.getByLabelText("Navigation")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Nav", children: textSnippet("Menu") } });
        expect(screen.getByText("Menu")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "sb", children: textSnippet("x") } });
        expect(screen.getByTestId("sb")).toBeTruthy();
    });
});
