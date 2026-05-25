import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/svelte";

import Subject from "./CalendarTableTD.svelte";

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

describe("CalendarTableTD", () => {
    test("renders a td element", () => {
        renderInRow({ children: textSnippet("15") });
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
    });

    test("has role gridcell", () => {
        renderInRow({ children: textSnippet("15") });
        expect(screen.getByRole("gridcell")).toBeTruthy();
    });

    test("renders children content", () => {
        renderInRow({ children: textSnippet("20") });
        expect(screen.getByText("20")).toBeTruthy();
    });

    test("sets aria-selected when selected", () => {
        renderInRow({ children: textSnippet("1"), selected: true });
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBe("true");
    });

    test("omits aria-selected when not selected", () => {
        renderInRow({ children: textSnippet("1") });
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
    });

    test("sets aria-current date when today", () => {
        renderInRow({ children: textSnippet("1"), today: true });
        expect(screen.getByRole("gridcell").getAttribute("aria-current")).toBe("date");
    });

    test("omits aria-current when not today", () => {
        renderInRow({ children: textSnippet("1") });
        expect(screen.getByRole("gridcell").getAttribute("aria-current")).toBeNull();
    });

    test("has tabindex 0 when selected", () => {
        renderInRow({ children: textSnippet("1"), selected: true });
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 when not selected", () => {
        renderInRow({ children: textSnippet("1") });
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("passes through attributes", () => {
        renderInRow({ children: textSnippet("1"), "data-testid": "day" });
        expect(screen.getByTestId("day")).toBeTruthy();
    });
});
