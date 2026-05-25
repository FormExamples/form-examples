import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Resizable.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("Resizable", () => {
    test("renders a region", () => {
        render(Subject, { props: { label: "Panel", children: textSnippet("content") } });
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Resizable panel", children: textSnippet("content") } });
        expect(screen.getByLabelText("Resizable panel")).toBeTruthy();
    });

    test("defaults to both direction", () => {
        render(Subject, { props: { label: "Panel", children: textSnippet("content") } });
        expect(screen.getByRole("region").getAttribute("data-resize")).toBe("both");
    });

    test("supports horizontal direction", () => {
        render(Subject, { props: { label: "Panel", direction: "horizontal", children: textSnippet("x") } });
        expect(screen.getByRole("region").getAttribute("data-resize")).toBe("horizontal");
    });

    test("is keyboard focusable", () => {
        render(Subject, { props: { label: "Panel", children: textSnippet("content") } });
        expect(screen.getByRole("region").getAttribute("tabindex")).toBe("0");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "P", "data-testid": "rs", children: textSnippet("x") } });
        expect(screen.getByTestId("rs")).toBeTruthy();
    });
});
