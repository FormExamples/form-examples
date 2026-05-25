import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Footnote.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Footnote", () => {
    test("renders with note role", () => {
        render(Subject, { props: { id: "fn1", children: textSnippet("Source info") } });
        expect(screen.getByRole("note")).toBeTruthy();
    });

    test("has correct id", () => {
        render(Subject, { props: { id: "fn1", children: textSnippet("Source") } });
        expect(document.getElementById("fn1")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { id: "fn1", children: textSnippet("Citation text") } });
        expect(screen.getByRole("note").textContent).toContain("Citation text");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { id: "fn1", "data-testid": "fn", children: textSnippet("C") } });
        expect(screen.getByTestId("fn")).toBeTruthy();
    });
});
