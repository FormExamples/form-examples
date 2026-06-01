import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./DataTableFoot.svelte";

function trSnippet(text: string) {
    return (($anchor: Comment) => {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
        $anchor.before(tr);
    }) as any;
}

function renderInTable(props: Record<string, unknown>) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, target: table });
    return { ...result, container };
}

describe("DataTableFoot", () => {
    test("renders a tfoot element", () => {
        renderInTable({ children: trSnippet("Total") });
        const tfoot = document.querySelector("tfoot");
        expect(tfoot).toBeTruthy();
    });

    test("renders children content", () => {
        renderInTable({ children: trSnippet("$50,000") });
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("$50,000");
    });

    test("passes through attributes", () => {
        renderInTable({ children: trSnippet("x"), "data-testid": "foot" });
        const tfoot = document.querySelector("tfoot");
        expect(tfoot?.getAttribute("data-testid")).toBe("foot");
    });
});
