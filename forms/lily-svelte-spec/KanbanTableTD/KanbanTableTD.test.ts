import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/svelte";

import Subject from "./KanbanTableTD.svelte";

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

describe("KanbanTableTD", () => {
    test("renders a gridcell", () => {
        renderInRow({});
        expect(screen.getByRole("gridcell")).toBeTruthy();
    });

    test("renders as a td element", () => {
        renderInRow({});
        expect(screen.getByRole("gridcell").tagName).toBe("TD");
    });

    test("renders children content", () => {
        renderInRow({ children: textSnippet("Fix login bug") });
        expect(screen.getByRole("gridcell").textContent).toBe("Fix login bug");
    });

    test("renders empty when no children", () => {
        renderInRow({});
        expect(screen.getByRole("gridcell").textContent?.trim()).toBe("");
    });

    test("has aria-selected when active", () => {
        renderInRow({ active: true });
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBe("true");
    });

    test("has no aria-selected by default", () => {
        renderInRow({});
        expect(screen.getByRole("gridcell").getAttribute("aria-selected")).toBeNull();
    });

    test("has tabindex 0 when active", () => {
        renderInRow({ active: true });
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 by default", () => {
        renderInRow({});
        expect(screen.getByRole("gridcell").getAttribute("tabindex")).toBe("-1");
    });

    test("supports aria-label", () => {
        renderInRow({ label: "Design task" });
        expect(screen.getByRole("gridcell").getAttribute("aria-label")).toBe("Design task");
    });

    test("has no aria-label by default", () => {
        renderInRow({});
        expect(screen.getByRole("gridcell").getAttribute("aria-label")).toBeNull();
    });

    test("passes through attributes", () => {
        renderInRow({ "data-testid": "cell-1" });
        expect(screen.getByTestId("cell-1")).toBeTruthy();
    });
});
