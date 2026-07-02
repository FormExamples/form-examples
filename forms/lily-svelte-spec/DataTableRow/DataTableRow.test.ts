import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./DataTableRow.svelte";

function tdSnippet(text: string) {
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

describe("DataTableRow", () => {
    test("renders a tr element", () => {
        renderInTable({ children: tdSnippet("Alice") });
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        renderInTable({ children: tdSnippet("Alice") });
        const row = document.querySelector("tr");
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        renderInTable({ children: tdSnippet("Bob") });
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Bob");
    });

    test("renders multiple cells", () => {
        const multiCellSnippet = (($anchor: Comment) => {
            for (const text of ["Alice", "alice@example.com"]) {
                const td = document.createElement("td");
                td.textContent = text;
                $anchor.before(td);
            }
        }) as any;
        renderInTable({ children: multiCellSnippet });
        const cells = document.querySelectorAll("td");
        expect(cells.length).toBe(2);
        expect(cells[0].textContent).toBe("Alice");
        expect(cells[1].textContent).toBe("alice@example.com");
    });

    test("passes through attributes", () => {
        renderInTable({ children: tdSnippet("x"), "data-testid": "row" });
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-testid")).toBe("row");
    });
});
