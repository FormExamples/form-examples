import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AccordionNav.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("AccordionNav", () => {
    test("renders a nav element", () => {
        render(Subject, { props: { label: "FAQ", children: textSnippet("content") } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "FAQ", children: textSnippet("content") } });
        expect(screen.getByLabelText("FAQ")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "FAQ", children: textSnippet("Question") } });
        expect(screen.getByText("Question")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "aan", children: textSnippet("x") } });
        expect(screen.getByTestId("aan")).toBeTruthy();
    });
});
