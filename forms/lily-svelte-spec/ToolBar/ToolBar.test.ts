import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ToolBar.svelte";

function buttonsSnippet() {
    return (($anchor: Comment) => {
        const btn1 = document.createElement("button");
        btn1.textContent = "Bold";
        const btn2 = document.createElement("button");
        btn2.textContent = "Italic";
        $anchor.before(btn1, btn2);
    }) as any;
}

describe("ToolBar", () => {
    test("renders a toolbar", () => {
        render(Subject, { props: { label: "Tools", children: buttonsSnippet() } });
        expect(screen.getByRole("toolbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Editor tools", children: buttonsSnippet() } });
        expect(screen.getByLabelText("Editor tools")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Tools", children: buttonsSnippet() } });
        expect(screen.getByText("Bold")).toBeTruthy();
    });

    test("arrow right navigates to next item", async () => {
        render(Subject, { props: { label: "Tools", children: buttonsSnippet() } });
        const buttons = screen.getAllByRole("button");
        buttons[0].focus();
        buttons[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(buttons[1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "tb", children: buttonsSnippet() } });
        expect(screen.getByTestId("tb")).toBeTruthy();
    });
});
