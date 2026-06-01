import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./KanbanTable.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("KanbanTable", () => {
    test("renders a grid", () => {
        render(Subject, {
            props: { label: "Board", children: textSnippet("cols") },
        });
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(Subject, {
            props: { label: "Board", children: textSnippet("cols") },
        });
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Sprint 5 board", children: textSnippet("cols") },
        });
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Sprint 5 board");
    });

    test("renders caption when provided", () => {
        render(Subject, {
            props: { label: "Board", caption: "Sprint 5 board", children: textSnippet("cols") },
        });
        const table = screen.getByRole("grid");
        const cap = table.querySelector("caption");
        expect(cap).toBeTruthy();
        expect(cap?.textContent).toBe("Sprint 5 board");
    });

    test("renders without caption by default", () => {
        render(Subject, {
            props: { label: "Board", children: textSnippet("cols") },
        });
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap).toBeNull();
    });

    test("renders children content", () => {
        render(Subject, {
            props: { label: "Board", children: textSnippet("Tasks here") },
        });
        expect(screen.getByText("Tasks here")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "K", "data-testid": "kb", children: textSnippet("x") },
        });
        expect(screen.getByTestId("kb")).toBeTruthy();
    });
});
