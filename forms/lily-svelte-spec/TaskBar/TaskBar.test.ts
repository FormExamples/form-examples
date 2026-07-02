import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TaskBar.svelte";

function buttonsSnippet() {
    return (($anchor: Comment) => {
        const btn1 = document.createElement("button");
        btn1.textContent = "New";
        const btn2 = document.createElement("button");
        btn2.textContent = "Open";
        $anchor.before(btn1, btn2);
    }) as any;
}

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("TaskBar", () => {
    test("renders a toolbar", () => {
        render(Subject, { props: { label: "Tasks", children: buttonsSnippet() } });
        expect(screen.getByRole("toolbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Task actions", children: buttonsSnippet() } });
        expect(screen.getByRole("toolbar").getAttribute("aria-label")).toBe("Task actions");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Tasks", children: buttonsSnippet() } });
        expect(screen.getByText("New")).toBeTruthy();
    });

    test("arrow right navigates to next item", () => {
        render(Subject, { props: { label: "Tasks", children: buttonsSnippet() } });
        const buttons = screen.getAllByRole("button");
        buttons[0].focus();
        buttons[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(buttons[1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "tb", children: textSnippet("x") } });
        expect(screen.getByTestId("tb")).toBeTruthy();
    });
});
