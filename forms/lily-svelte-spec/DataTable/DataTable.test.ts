import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DataTable.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

function rowSnippet() {
    return (($$anchor: Comment) => {
        const tbody = document.createElement("tbody");
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "Alice";
        tr.appendChild(td);
        tbody.appendChild(tr);
        $$anchor.before(tbody);
    }) as any;
}

describe("DataTable", () => {
    test("renders a grid", () => {
        render(Subject, { props: { label: "Users", children: rowSnippet() } });
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(Subject, { props: { label: "Users", children: rowSnippet() } });
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Accounts", children: rowSnippet() } });
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Accounts");
    });

    test("renders caption when provided", () => {
        render(Subject, { props: { label: "Users", caption: "User list", children: rowSnippet() } });
        const table = screen.getByRole("grid");
        const cap = table.querySelector("caption");
        expect(cap).toBeTruthy();
        expect(cap?.textContent).toBe("User list");
    });

    test("renders without caption by default", () => {
        render(Subject, { props: { label: "Users", children: rowSnippet() } });
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap).toBeNull();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "T", children: rowSnippet() } });
        expect(screen.getByRole("grid").textContent).toContain("Alice");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "dt", children: rowSnippet() } });
        expect(screen.getByTestId("dt")).toBeTruthy();
    });
});
