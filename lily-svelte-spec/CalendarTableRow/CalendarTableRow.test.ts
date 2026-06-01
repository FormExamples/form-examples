import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./CalendarTableRow.svelte";

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

describe("CalendarTableRow", () => {
    test("renders a tr element", () => {
        renderInTable({ children: tdSnippet("1") });
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        renderInTable({ children: tdSnippet("1") });
        const row = document.querySelector("tr");
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        renderInTable({ children: tdSnippet("15") });
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("15");
    });

    test("renders multiple children cells", () => {
        const multiCellSnippet = (($anchor: Comment) => {
            for (let i = 1; i <= 7; i++) {
                const td = document.createElement("td");
                td.textContent = String(i);
                $anchor.before(td);
            }
        }) as any;
        renderInTable({ children: multiCellSnippet });
        const cells = document.querySelectorAll("td");
        expect(cells.length).toBe(7);
        expect(cells[0].textContent).toBe("1");
        expect(cells[6].textContent).toBe("7");
    });

    test("passes through attributes", () => {
        renderInTable({ children: tdSnippet("1"), "data-testid": "row" });
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-testid")).toBe("row");
    });
});
