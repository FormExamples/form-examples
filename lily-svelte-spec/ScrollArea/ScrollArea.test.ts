import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollArea.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("ScrollArea", () => {
    test("renders a region", () => {
        render(Subject, { props: { label: "Content", children: textSnippet("text") } });
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Scrollable", children: textSnippet("text") } });
        expect(screen.getByLabelText("Scrollable")).toBeTruthy();
    });

    test("has tabindex for keyboard scrolling", () => {
        render(Subject, { props: { label: "Content", children: textSnippet("text") } });
        expect(screen.getByRole("region").getAttribute("tabindex")).toBe("0");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Content", children: textSnippet("Long text") } });
        expect(screen.getByText("Long text")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "C", "data-testid": "sa", children: textSnippet("x") } });
        expect(screen.getByTestId("sa")).toBeTruthy();
    });
});
