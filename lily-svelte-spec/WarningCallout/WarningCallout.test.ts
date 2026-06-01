import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./WarningCallout.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("WarningCallout", () => {
    test("renders with alert role", () => {
        render(Subject, { props: { children: textSnippet("Warning!") } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("renders as aside element", () => {
        render(Subject, { props: { "data-testid": "wc", children: textSnippet("W") } });
        expect(screen.getByTestId("wc").tagName).toBe("ASIDE");
    });

    test("has aria-label when provided", () => {
        render(Subject, { props: { label: "Important warning", children: textSnippet("W") } });
        expect(screen.getByRole("alert").getAttribute("aria-label")).toBe("Important warning");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Session expiring") } });
        expect(screen.getByRole("alert").textContent).toContain("Session expiring");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "wc", children: textSnippet("W") } });
        expect(screen.getByTestId("wc")).toBeTruthy();
    });
});
