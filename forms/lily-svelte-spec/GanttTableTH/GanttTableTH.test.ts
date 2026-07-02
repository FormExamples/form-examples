import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";

import Subject from "./GanttTableTH.svelte";

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

describe("GanttTableTH", () => {
    test("renders a th element", () => {
        renderInRow({});
        const th = document.querySelector("th");
        expect(th).toBeTruthy();
    });

    test("defaults scope to col", () => {
        renderInRow({});
        const th = document.querySelector("th");
        expect(th?.getAttribute("scope")).toBe("col");
    });

    test("supports colspan attribute", () => {
        renderInRow({ colspan: 5 });
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBe("5");
    });

    test("has no colspan by default", () => {
        renderInRow({});
        const th = document.querySelector("th");
        expect(th?.getAttribute("colspan")).toBeNull();
    });

    test("passes through attributes", () => {
        renderInRow({ "data-testid": "th" });
        const th = document.querySelector("th");
        expect(th?.getAttribute("data-testid")).toBe("th");
    });
});
