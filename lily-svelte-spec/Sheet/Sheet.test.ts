import { render, screen } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Sheet.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("Sheet", () => {
    test("not visible when closed", () => {
        render(Subject, { props: { label: "Settings", open: false, children: textSnippet("content") } });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open", () => {
        render(Subject, { props: { label: "Settings", open: true, children: textSnippet("content") } });
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Settings", open: true, children: textSnippet("content") } });
        expect(screen.getByLabelText("Settings")).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(Subject, { props: { label: "Settings", open: true, children: textSnippet("content") } });
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(Subject, { props: { label: "S", open: true, side: "left", children: textSnippet("x") } });
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("left");
    });

    test("closes on Escape", async () => {
        render(Subject, { props: { label: "S", open: true, children: textSnippet("content") } });
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await vi.waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", open: true, "data-testid": "sh", children: textSnippet("x") } });
        expect(screen.getByTestId("sh")).toBeTruthy();
    });
});
