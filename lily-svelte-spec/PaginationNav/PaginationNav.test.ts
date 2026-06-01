import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PaginationNav.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("PaginationNav", () => {
    test("renders a navigation landmark", () => {
        render(Subject, { props: { label: "Pagination", children: textSnippet("pages") } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Pagination", children: textSnippet("pages") } });
        expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy();
    });

    test("renders as a nav element", () => {
        render(Subject, { props: { label: "Pagination", children: textSnippet("pages") } });
        expect(screen.getByRole("navigation").tagName).toBe("NAV");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Pagination", children: textSnippet("Page 1 Page 2") } });
        expect(screen.getByText("Page 1 Page 2")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Pagination", "data-testid": "pn", children: textSnippet("x") } });
        expect(screen.getByTestId("pn")).toBeTruthy();
    });
});
