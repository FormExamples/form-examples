import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NavigationMenu.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("NavigationMenu", () => {
    test("renders a navigation landmark", () => {
        render(Subject, { props: { label: "Main", children: textSnippet("content") } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Main navigation", children: textSnippet("content") } });
        expect(screen.getByLabelText("Main navigation")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Nav", children: textSnippet("Home") } });
        expect(screen.getByText("Home")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "nm", children: textSnippet("x") } });
        expect(screen.getByTestId("nm")).toBeTruthy();
    });
});
