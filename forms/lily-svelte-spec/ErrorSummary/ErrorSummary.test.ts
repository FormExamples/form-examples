import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ErrorSummary.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ErrorSummary", () => {
    test("renders with alert role", () => {
        render(Subject, { props: { title: "Errors", children: textSnippet("Fix these") } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("displays title as heading", () => {
        render(Subject, { props: { title: "There are errors", children: textSnippet("List") } });
        expect(screen.getByRole("heading", { name: "There are errors" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { title: "Errors", children: textSnippet("Name is required") } });
        expect(screen.getByRole("alert").textContent).toContain("Name is required");
    });

    test("is focusable", () => {
        render(Subject, { props: { title: "Errors", children: textSnippet("Fix") } });
        const alert = screen.getByRole("alert");
        alert.focus();
        expect(document.activeElement).toBe(alert);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { title: "E", "data-testid": "es", children: textSnippet("C") } });
        expect(screen.getByTestId("es")).toBeTruthy();
    });
});
