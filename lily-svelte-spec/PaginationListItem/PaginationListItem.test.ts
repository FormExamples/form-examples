import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PaginationListItem.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("PaginationListItem", () => {
    test("renders a list item", () => {
        render(Subject, { props: { "data-testid": "pli", children: textSnippet("1") } });
        expect(screen.getByTestId("pli").tagName).toBe("LI");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Page 2") } });
        expect(screen.getByText("Page 2")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "item", children: textSnippet("X") } });
        expect(screen.getByTestId("item")).toBeTruthy();
    });
});
