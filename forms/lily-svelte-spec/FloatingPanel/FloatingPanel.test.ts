import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./FloatingPanel.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("FloatingPanel", () => {
    test("hidden when open is false", () => {
        render(Subject, { props: { label: "Panel", open: false, children: textSnippet("C") } });
        expect(screen.queryByRole("region")).toBeNull();
    });

    test("visible when open is true", () => {
        render(Subject, { props: { label: "Panel", open: true, children: textSnippet("C") } });
        expect(screen.getByRole("region", { name: "Panel" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Panel", open: true, children: textSnippet("Content") } });
        expect(screen.getByRole("region").textContent).toContain("Content");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "P", open: true, "data-testid": "fp", children: textSnippet("C") } });
        expect(screen.getByTestId("fp")).toBeTruthy();
    });
});
