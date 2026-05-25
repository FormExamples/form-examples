import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./BreadcrumbNav.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("BreadcrumbNav", () => {
    test("renders a navigation landmark", () => {
        render(Subject, { props: { label: "Breadcrumb", children: textSnippet("trail") } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Breadcrumb", children: textSnippet("trail") } });
        expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Breadcrumb", children: textSnippet("Home > About") } });
        expect(screen.getByText("Home > About")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Breadcrumb", "data-testid": "bcn", children: textSnippet("x") } });
        expect(screen.getByTestId("bcn")).toBeTruthy();
    });
});
