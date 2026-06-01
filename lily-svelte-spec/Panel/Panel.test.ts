import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Panel.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Panel", () => {
    test("renders as a region", () => {
        render(Subject, { props: { label: "Settings", children: textSnippet("Content") } });
        expect(screen.getByRole("region", { name: "Settings" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Info", children: textSnippet("C") } });
        expect(screen.getByRole("region").getAttribute("aria-label")).toBe("Info");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "P", children: textSnippet("Panel content") } });
        expect(screen.getByRole("region").textContent).toContain("Panel content");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "P", "data-testid": "pn", children: textSnippet("C") } });
        expect(screen.getByTestId("pn")).toBeTruthy();
    });
});
