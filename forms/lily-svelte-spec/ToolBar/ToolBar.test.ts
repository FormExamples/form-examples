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

function threeSnippet(disableMiddle = false) {
    return (($anchor: Comment) => {
        const buttons = ["Bold", "Italic", "Underline"].map((text) => {
            const button = document.createElement("button");
            button.textContent = text;
            return button;
        });
        if (disableMiddle) buttons[1].disabled = true;
        $anchor.before(...buttons);
    }) as any;
}

const press = (el: Element, key: string) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

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
        buttons[0].dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
        );
        expect(document.activeElement).toBe(buttons[1]);
    });

    test("the arrows skip a disabled button, and Home and End jump", () => {
        render(Subject, { props: { label: "Tools", children: threeSnippet(true) } });
        const [bold, , underline] = screen.getAllByRole("button");
        bold.focus();
        press(bold, "ArrowRight");
        expect(document.activeElement).toBe(underline);
        press(underline, "ArrowLeft");
        expect(document.activeElement).toBe(bold);
        press(bold, "End");
        expect(document.activeElement).toBe(underline);
        press(underline, "Home");
        expect(document.activeElement).toBe(bold);
    });

    test("right-to-left swaps the arrows", () => {
        render(Subject, {
            props: {
                label: "Tools",
                dir: "rtl",
                style: "direction: rtl",
                children: threeSnippet(),
            },
        });
        const [bold, italic] = screen.getAllByRole("button");
        bold.focus();
        press(bold, "ArrowLeft");
        expect(document.activeElement).toBe(italic);
    });

    test("one tab stop, which follows focus", () => {
        render(Subject, { props: { label: "Tools", children: threeSnippet() } });
        const [bold, italic, underline] = screen.getAllByRole("button");
        expect([bold.tabIndex, italic.tabIndex, underline.tabIndex]).toEqual([0, -1, -1]);
        italic.focus();
        expect([bold.tabIndex, italic.tabIndex, underline.tabIndex]).toEqual([-1, 0, -1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "tb", children: buttonsSnippet() } });
        expect(screen.getByTestId("tb")).toBeTruthy();
    });
});
