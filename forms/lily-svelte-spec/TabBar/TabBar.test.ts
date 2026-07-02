import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TabBar.svelte";

function tabsSnippet() {
    return (($anchor: Comment) => {
        const tab1 = document.createElement("button");
        tab1.setAttribute("role", "tab");
        tab1.setAttribute("tabindex", "-1");
        tab1.textContent = "General";
        const tab2 = document.createElement("button");
        tab2.setAttribute("role", "tab");
        tab2.setAttribute("tabindex", "-1");
        tab2.textContent = "Advanced";
        $anchor.before(tab1, tab2);
    }) as any;
}

describe("TabBar", () => {
    test("renders a tablist", () => {
        render(Subject, { props: { label: "Settings", children: tabsSnippet() } });
        expect(screen.getByRole("tablist")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Settings", children: tabsSnippet() } });
        expect(screen.getByRole("tablist").getAttribute("aria-label")).toBe("Settings");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Settings", children: tabsSnippet() } });
        expect(screen.getByText("General")).toBeTruthy();
        expect(screen.getByText("Advanced")).toBeTruthy();
    });

    test("arrow right navigates to next tab", () => {
        render(Subject, { props: { label: "Settings", children: tabsSnippet() } });
        const tabs = screen.getAllByRole("tab");
        tabs[0].focus();
        tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(tabs[1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "tbar", children: tabsSnippet() } });
        expect(screen.getByTestId("tbar")).toBeTruthy();
    });
});
