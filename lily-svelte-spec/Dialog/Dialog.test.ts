import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Dialog.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Dialog", () => {
    test("hidden when open is false", () => {
        render(Subject, { props: { label: "Confirm", open: false, children: textSnippet("Content") } });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open is true", () => {
        render(Subject, { props: { label: "Confirm", open: true, children: textSnippet("Content") } });
        expect(screen.getByRole("dialog", { name: "Confirm" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Settings", open: true, children: textSnippet("C") } });
        expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe("Settings");
    });

    test("has aria-modal when modal", () => {
        render(Subject, { props: { label: "D", open: true, modal: true, children: textSnippet("C") } });
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("no aria-modal when non-modal", () => {
        render(Subject, { props: { label: "D", open: true, modal: false, children: textSnippet("C") } });
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBeNull();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "D", open: true, children: textSnippet("Hello dialog") } });
        expect(screen.getByRole("dialog").textContent).toContain("Hello dialog");
    });

    test("Escape key closes the dialog", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "D", open: true, children: textSnippet("C") } });
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "D", open: true, "data-testid": "dlg", children: textSnippet("C") } });
        expect(screen.getByTestId("dlg")).toBeTruthy();
    });
});
