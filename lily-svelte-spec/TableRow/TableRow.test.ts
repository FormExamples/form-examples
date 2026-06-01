import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./TableRow.svelte";

function childSnippet(text: string) {
    return (($anchor: Comment) => {
        const td = document.createElement("td");
        td.textContent = text;
        $anchor.before(td);
    }) as any;
}

function renderInTable(props: Record<string, unknown>) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, target: tbody });
    return { ...result, container };
}

describe("TableRow", () => {
    test("renders a tr element", () => {
        renderInTable({ children: childSnippet("x") });
        const el = document.querySelector("tr");
        expect(el).toBeTruthy();
    });

    test("applies class table-row", () => {
        renderInTable({ children: childSnippet("x") });
        const el = document.querySelector("tr");
        expect(el?.getAttribute("class")).toContain("table-row");
    });

    test("renders children content", () => {
        renderInTable({ children: childSnippet("hello") });
        const inner = document.querySelector("td");
        expect(inner?.textContent).toBe("hello");
    });

    test("passes through attributes", () => {
        renderInTable({ children: childSnippet("x"), "data-testid": "subject" });
        const el = document.querySelector("tr");
        expect(el?.getAttribute("data-testid")).toBe("subject");
    });
});
