import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GanttTable.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("GanttTable", () => {
    test("renders a grid", () => {
        render(Subject, { props: { label: "Project", children: textSnippet("tasks") } });
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(Subject, { props: { label: "Project", children: textSnippet("tasks") } });
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Project timeline", children: textSnippet("tasks") } });
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Project timeline");
    });

    test("renders caption when provided", () => {
        render(Subject, { props: { label: "Project", caption: "Q1 Schedule", children: textSnippet("tasks") } });
        const table = screen.getByRole("grid");
        const cap = table.querySelector("caption");
        expect(cap).toBeTruthy();
        expect(cap?.textContent).toBe("Q1 Schedule");
    });

    test("renders without caption by default", () => {
        render(Subject, { props: { label: "Project", children: textSnippet("tasks") } });
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap).toBeNull();
    });

    test("renders children content", () => {
        render(Subject, { props: { label: "G", children: textSnippet("My tasks") } });
        expect(screen.getByText("My tasks")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "G", "data-testid": "gt", children: textSnippet("x") } });
        expect(screen.getByTestId("gt")).toBeTruthy();
    });
});
