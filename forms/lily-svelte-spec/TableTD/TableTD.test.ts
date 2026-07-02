import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./TableTD.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

function renderInRow(props: Record<string, unknown>) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    tbody.appendChild(tr);
    table.appendChild(tbody);
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, target: tr });
    return { ...result, container };
}

describe("TableTD", () => {
    test("renders a td element", () => {
        renderInRow({ children: textSnippet("Alice") });
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
    });

    test("applies class table-td", () => {
        renderInRow({ children: textSnippet("Alice") });
        const td = document.querySelector("td");
        expect(td?.getAttribute("class")).toContain("table-td");
    });

    test("supports colSpan attribute", () => {
        renderInRow({ children: textSnippet("Alice"), colSpan: 2 });
        const td = document.querySelector("td");
        expect(td?.getAttribute("colspan")).toBe("2");
    });

    test("supports rowSpan attribute", () => {
        renderInRow({ children: textSnippet("Alice"), rowSpan: 2 });
        const td = document.querySelector("td");
        expect(td?.getAttribute("rowspan")).toBe("2");
    });

    test("has no colspan/rowspan by default", () => {
        renderInRow({ children: textSnippet("Alice") });
        const td = document.querySelector("td");
        expect(td?.getAttribute("colspan")).toBeNull();
        expect(td?.getAttribute("rowspan")).toBeNull();
    });

    test("renders children", () => {
        renderInRow({ children: textSnippet("hello") });
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("hello");
    });
});
