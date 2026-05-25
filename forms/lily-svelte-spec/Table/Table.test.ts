import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Table.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Table", () => {
    test("renders a table element", () => {
        render(Subject, { props: {
            label: "Users",
            children: textSnippet("content"),
        }});

        const table = screen.getByRole("table");
        expect(table.tagName).toBe("TABLE");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: {
            label: "User accounts",
            children: textSnippet("content"),
        }});

        const table = screen.getByRole("table");
        expect(table.getAttribute("aria-label")).toBe("User accounts");
    });

    test("renders children content", () => {
        render(Subject, { props: {
            label: "Data",
            children: textSnippet("Table data here"),
        }});

        const table = screen.getByRole("table");
        expect(table.textContent).toContain("Table data here");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            label: "Users",
            "data-testid": "my-table",
            children: textSnippet("content"),
        }});

        const table = screen.getByTestId("my-table");
        expect(table).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: {
            label: "Users",
            id: "users-table",
            children: textSnippet("content"),
        }});

        const table = screen.getByRole("table");
        expect(table.getAttribute("id")).toBe("users-table");
    });
});
