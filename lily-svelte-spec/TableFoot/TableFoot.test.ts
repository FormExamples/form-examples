import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./TableFoot.svelte";

function childSnippet(text: string) {
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

describe("TableFoot", () => {
    test("renders a tfoot element", () => {
        renderInTable({ children: childSnippet("x") });
        const el = document.querySelector("tfoot");
        expect(el).toBeTruthy();
    });

    test("applies class table-foot", () => {
        renderInTable({ children: childSnippet("x") });
        const el = document.querySelector("tfoot");
        expect(el?.getAttribute("class")).toContain("table-foot");
    });

    test("renders children content", () => {
        renderInTable({ children: childSnippet("hello") });
        const inner = document.querySelector("td");
        expect(inner?.textContent).toBe("hello");
    });

    test("passes through attributes", () => {
        renderInTable({ children: childSnippet("x"), "data-testid": "subject" });
        const el = document.querySelector("tfoot");
        expect(el?.getAttribute("data-testid")).toBe("subject");
    });
});
