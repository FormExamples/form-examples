import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./CalendarTableBody.svelte";

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

describe("CalendarTableBody", () => {
    test("renders a tbody element", () => {
        renderInTable({ children: trSnippet("1") });
        const tbody = document.querySelector("tbody");
        expect(tbody).toBeTruthy();
    });

    test("renders children content", () => {
        renderInTable({ children: trSnippet("15") });
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("15");
    });

    test("passes through attributes", () => {
        renderInTable({ children: trSnippet("x"), "data-testid": "body" });
        const tbody = document.querySelector("tbody");
        expect(tbody?.getAttribute("data-testid")).toBe("body");
    });
});
