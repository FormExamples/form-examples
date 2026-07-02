import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./GanttTableTr.svelte";

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

describe("GanttTableTr", () => {
    test("renders a tr element", () => {
        renderInTable({ children: tdSnippet("Design") });
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        renderInTable({ children: tdSnippet("Design") });
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        renderInTable({ children: tdSnippet("Development") });
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
        expect(td?.textContent).toBe("Development");
    });

    test("renders multiple children cells", () => {
        const multiCellSnippet = (($anchor: Comment) => {
            for (const text of ["Task", "W1", "W2", "W3"]) {
                const td = document.createElement("td");
                td.textContent = text;
                $anchor.before(td);
            }
        }) as any;
        renderInTable({ children: multiCellSnippet });
        const cells = document.querySelectorAll("td");
        expect(cells.length).toBe(4);
        expect(cells[0].textContent).toBe("Task");
        expect(cells[3].textContent).toBe("W3");
    });

    test("passes through attributes", () => {
        renderInTable({ children: tdSnippet("x"), "data-task": "design" });
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-task")).toBe("design");
    });
});
