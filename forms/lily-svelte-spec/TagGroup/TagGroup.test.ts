import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TagGroup.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("TagGroup", () => {
    test("renders a group", () => {
        render(Subject, { props: { label: "Tags", children: textSnippet("content") } });
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Technologies", children: textSnippet("content") } });
        expect(screen.getByLabelText("Technologies")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Tags", children: textSnippet("Svelte") } });
        expect(screen.getByText("Svelte")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "tg", children: textSnippet("x") } });
        expect(screen.getByTestId("tg")).toBeTruthy();
    });
});
