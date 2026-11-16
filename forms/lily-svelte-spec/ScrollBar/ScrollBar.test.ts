import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollBar.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("ScrollBar", () => {
    test("renders a scrollbar", () => {
        render(Subject, {
            props: { label: "Scroll", children: textSnippet("thumb") },
        });
        expect(screen.getByRole("scrollbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Page scroll", children: textSnippet("thumb") },
        });
        expect(screen.getByLabelText("Page scroll")).toBeTruthy();
    });

    test("defaults to vertical orientation", () => {
        render(Subject, {
            props: { label: "Scroll", children: textSnippet("thumb") },
        });
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("vertical");
    });

    test("supports horizontal orientation", () => {
        render(Subject, {
            props: {
                label: "Scroll",
                orientation: "horizontal",
                children: textSnippet("thumb"),
            },
        });
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("horizontal");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "S", "data-testid": "sb", children: textSnippet("x") },
        });
        expect(screen.getByTestId("sb")).toBeTruthy();
    });

    test("is focusable and names the scrolled element", () => {
        render(Subject, {
            props: { label: "Scroll", controls: "messages", children: textSnippet("thumb") },
        });
        const bar = screen.getByRole("scrollbar");
        expect(bar.getAttribute("tabindex")).toBe("0");
        expect(bar.getAttribute("aria-controls")).toBe("messages");
    });

    test("arrow keys move the value by step, clamped to the range", async () => {
        render(Subject, {
            props: { label: "Scroll", value: 1, step: 2, children: textSnippet("thumb") },
        });
        const bar = screen.getByRole("scrollbar");
        await fireEvent.keyDown(bar, { key: "ArrowDown" });
        expect(bar.getAttribute("aria-valuenow")).toBe("3");
        await fireEvent.keyDown(bar, { key: "ArrowRight" });
        expect(bar.getAttribute("aria-valuenow")).toBe("5");
        await fireEvent.keyDown(bar, { key: "ArrowUp" });
        await fireEvent.keyDown(bar, { key: "ArrowLeft" });
        await fireEvent.keyDown(bar, { key: "ArrowLeft" });
        expect(bar.getAttribute("aria-valuenow")).toBe("0");
    });

    test("Page Up and Page Down move the value by pageStep", async () => {
        render(Subject, {
            props: { label: "Scroll", value: 50, pageStep: 25, children: textSnippet("thumb") },
        });
        const bar = screen.getByRole("scrollbar");
        await fireEvent.keyDown(bar, { key: "PageDown" });
        expect(bar.getAttribute("aria-valuenow")).toBe("75");
        await fireEvent.keyDown(bar, { key: "PageDown" });
        expect(bar.getAttribute("aria-valuenow")).toBe("100");
        await fireEvent.keyDown(bar, { key: "PageUp" });
        expect(bar.getAttribute("aria-valuenow")).toBe("75");
    });

    test("Home and End jump to min and max", async () => {
        render(Subject, {
            props: { label: "Scroll", value: 40, min: 10, max: 90, children: textSnippet("thumb") },
        });
        const bar = screen.getByRole("scrollbar");
        expect(bar.getAttribute("aria-valuemin")).toBe("10");
        expect(bar.getAttribute("aria-valuemax")).toBe("90");
        await fireEvent.keyDown(bar, { key: "End" });
        expect(bar.getAttribute("aria-valuenow")).toBe("90");
        await fireEvent.keyDown(bar, { key: "Home" });
        expect(bar.getAttribute("aria-valuenow")).toBe("10");
    });
});
