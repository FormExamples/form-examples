import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Header.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Header", () => {
    test("renders as banner landmark", () => {
        render(Subject, { props: { children: textSnippet("Title") } });
        expect(screen.getByRole("banner")).toBeTruthy();
    });

    test("supports aria-label", () => {
        render(Subject, { props: { label: "Site header", children: textSnippet("T") } });
        expect(screen.getByRole("banner").getAttribute("aria-label")).toBe("Site header");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("My Title") } });
        expect(screen.getByRole("banner").textContent).toContain("My Title");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "hdr", children: textSnippet("T") } });
        expect(screen.getByTestId("hdr")).toBeTruthy();
    });
});
