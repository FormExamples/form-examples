import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SummaryListItem.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("SummaryListItem", () => {
    test("renders a dt element with the term", () => {
        render(Subject, { props: { term: "Product", children: textSnippet("Widget") } });
        const dt = screen.getByText("Product");
        expect(dt.tagName).toBe("DT");
    });

    test("renders a dd element with children content", () => {
        render(Subject, { props: { term: "Product", children: textSnippet("Widget") } });
        const dd = screen.getByText("Widget");
        expect(dd.tagName).toBe("DD");
    });

    test("renders dt and dd within a div wrapper", () => {
        render(Subject, { props: { term: "Qty", children: textSnippet("3") } });
        const dt = screen.getByText("Qty");
        const dd = screen.getByText("3");
        expect(dt.parentElement?.tagName).toBe("DIV");
        expect(dd.parentElement?.tagName).toBe("DIV");
        expect(dt.parentElement).toBe(dd.parentElement);
    });

    test("dt appears before dd in DOM order", () => {
        render(Subject, { props: { term: "Total", children: textSnippet("$29.97") } });
        const dt = screen.getByText("Total");
        const dd = screen.getByText("$29.97");
        const parent = dt.parentElement!;
        const children = Array.from(parent.children);
        expect(children.indexOf(dt)).toBeLessThan(children.indexOf(dd));
    });

    test("passes through attributes to wrapper div", () => {
        render(Subject, { props: { term: "Key", "data-testid": "sli", children: textSnippet("Value") } });
        expect(screen.getByTestId("sli")).toBeTruthy();
        expect(screen.getByTestId("sli").tagName).toBe("DIV");
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { term: "Key", id: "row-1", children: textSnippet("Value") } });
        const dt = screen.getByText("Key");
        expect(dt.parentElement?.getAttribute("id")).toBe("row-1");
    });
});
