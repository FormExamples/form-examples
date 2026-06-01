import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./InsetText.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("InsetText", () => {
    test("renders with note role", () => {
        render(Subject, { props: { children: textSnippet("Important") } });
        expect(screen.getByRole("note")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("8 weeks to process") } });
        expect(screen.getByRole("note").textContent).toContain("8 weeks to process");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "it", children: textSnippet("C") } });
        expect(screen.getByTestId("it")).toBeTruthy();
    });
});
