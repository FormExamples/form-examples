import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SegmentGroup.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("SegmentGroup", () => {
    test("renders a radiogroup", () => {
        render(Subject, { props: { label: "View", children: textSnippet("content") } });
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "View mode", children: textSnippet("content") } });
        expect(screen.getByLabelText("View mode")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "View", children: textSnippet("Grid") } });
        expect(screen.getByText("Grid")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "V", "data-testid": "sg", children: textSnippet("x") } });
        expect(screen.getByTestId("sg")).toBeTruthy();
    });
});
