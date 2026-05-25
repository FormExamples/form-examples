import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./KanbanTableRow.svelte";

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

describe("KanbanTableRow", () => {
    test("renders a tr element", () => {
        renderInTable({ children: tdSnippet("Task") });
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        renderInTable({ children: tdSnippet("Task") });
        const row = document.querySelector("tr");
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        renderInTable({ children: tdSnippet("Design review") });
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Design review");
    });

    test("renders multiple cells", () => {
        const multiSnippet = (($anchor: Comment) => {
            for (const text of ["To Do", "In Progress", "Done"]) {
                const td = document.createElement("td");
                td.textContent = text;
                $anchor.before(td);
            }
        }) as any;
        renderInTable({ children: multiSnippet });
        expect(document.querySelectorAll("td").length).toBe(3);
    });

    test("passes through attributes", () => {
        renderInTable({ children: tdSnippet("x"), "data-row": "1" });
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-row")).toBe("1");
    });
});
