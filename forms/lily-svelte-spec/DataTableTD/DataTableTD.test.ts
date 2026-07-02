import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/svelte";

import Subject from "./DataTableTD.svelte";

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

describe("DataTableTD", () => {
    test("renders a td element", () => {
        renderInRow({ children: textSnippet("Alice") });
        const td = document.querySelector("td");
        expect(td).toBeTruthy();
    });

    test("has role gridcell", () => {
        renderInRow({ children: textSnippet("Alice") });
        expect(screen.getByRole("gridcell")).toBeTruthy();
    });

    test("renders children content", () => {
        renderInRow({ children: textSnippet("Bob") });
        expect(screen.getByText("Bob")).toBeTruthy();
    });

    test("has aria-selected when active", () => {
        renderInRow({ children: textSnippet("x"), active: true });
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBe("true");
    });

    test("omits aria-selected when not active", () => {
        renderInRow({ children: textSnippet("x") });
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
    });

    test("has tabindex 0 when active", () => {
        renderInRow({ children: textSnippet("x"), active: true });
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 when not active", () => {
        renderInRow({ children: textSnippet("x") });
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("defaults to not active", () => {
        renderInRow({ children: textSnippet("x") });
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("passes through attributes", () => {
        renderInRow({ children: textSnippet("x"), "data-testid": "cell" });
        expect(screen.getByTestId("cell")).toBeTruthy();
    });
});
