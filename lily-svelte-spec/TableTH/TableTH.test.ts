import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./TableTH.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

function renderInRow(props: Record<string, unknown>) {
    const container = document.createElement("div");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    thead.appendChild(tr);
    table.appendChild(thead);
    container.appendChild(table);
    document.body.appendChild(container);
    const result = render(Subject, { props, target: tr });
    return { ...result, container };
}

describe("TableTH", () => {
    test("renders a th element", () => {
        renderInRow({ children: textSnippet("Name") });
        const th = document.querySelector("th");
        expect(th).toBeTruthy();
    });

    test("applies class table-th", () => {
        renderInRow({ children: textSnippet("Name") });
        const th = document.querySelector("th");
        expect(th?.getAttribute("class")).toContain("table-th");
    });

    test("defaults scope to col", () => {
        renderInRow({ children: textSnippet("Name") });
        const th = document.querySelector("th");
        expect(th?.getAttribute("scope")).toBe("col");
    });

    test("supports custom scope", () => {
        renderInRow({ children: textSnippet("Alice"), scope: "row" });
        const th = document.querySelector("th");
        expect(th?.getAttribute("scope")).toBe("row");
    });

    test("supports colSpan attribute", () => {
        renderInRow({ children: textSnippet("Name"), colSpan: 3 });
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBe("3");
    });

    test("has no colspan by default", () => {
        renderInRow({ children: textSnippet("Name") });
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBeNull();
    });

    test("renders children", () => {
        renderInRow({ children: textSnippet("Email") });
        const th = document.querySelector("th");
        expect(th?.textContent).toBe("Email");
    });
});
