import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./CalendarTableHead.svelte";

function trSnippet(text: string) {
    return (($anchor: Comment) => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = text;
        tr.appendChild(th);
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

describe("CalendarTableHead", () => {
    test("renders a thead element", () => {
        renderInTable({ children: trSnippet("Sun") });
        const thead = document.querySelector("thead");
        expect(thead).toBeTruthy();
    });

    test("renders children content", () => {
        renderInTable({ children: trSnippet("Mon") });
        const th = document.querySelector("th");
        expect(th?.textContent).toBe("Mon");
    });

    test("passes through attributes", () => {
        renderInTable({ children: trSnippet("x"), "data-testid": "head" });
        const thead = document.querySelector("thead");
        expect(thead?.getAttribute("data-testid")).toBe("head");
    });
});
