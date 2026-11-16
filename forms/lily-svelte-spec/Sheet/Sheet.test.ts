import { fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { createRawSnippet } from "svelte";
import Subject from "./Sheet.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("Sheet", () => {
    test("not visible when closed", () => {
        render(Subject, {
            props: { label: "Settings", open: false, children: textSnippet("content") },
        });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open", () => {
        render(Subject, {
            props: { label: "Settings", open: true, children: textSnippet("content") },
        });
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Settings", open: true, children: textSnippet("content") },
        });
        expect(screen.getByLabelText("Settings")).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(Subject, {
            props: { label: "Settings", open: true, children: textSnippet("content") },
        });
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(Subject, {
            props: { label: "S", open: true, side: "left", children: textSnippet("x") },
        });
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
        render(Subject, {
            props: { label: "S", open: true, "data-testid": "sh", children: textSnippet("x") },
        });
        expect(screen.getByTestId("sh")).toBeTruthy();
    });
});

// Modality (tasks.md P18-T6): Sheet is a real modal, a <dialog> opened with showModal() through ../Dialog/modal.ts.
// jsdom has no showModal, so it is stubbed on the prototype the way a browser behaves (the Tab trap and the inert page
// are the browser's part and need a real engine; here we assert showModal() is what opens it).
describe("Sheet modality", () => {
    const proto = HTMLDialogElement.prototype as unknown as {
        showModal?: () => void;
        close?: () => void;
    };
    let showModal: ReturnType<typeof vi.fn>;
    let trigger: HTMLButtonElement;

    beforeEach(() => {
        showModal = vi.fn(function (this: HTMLDialogElement) {
            this.setAttribute("open", "");
        });
        proto.showModal = showModal as unknown as typeof proto.showModal;
        proto.close = vi.fn(function (this: HTMLDialogElement) {
            this.removeAttribute("open");
        }) as unknown as typeof proto.close;
        trigger = document.createElement("button");
        trigger.textContent = "Open";
        document.body.append(trigger);
        trigger.focus();
    });

    afterEach(() => {
        delete proto.showModal;
        delete proto.close;
        trigger.remove();
    });

    const modalBody = () =>
        createRawSnippet(() => ({ render: () => `<p><button>Inside</button></p>` }));

    test("is a <dialog> opened with showModal() and says aria-modal", () => {
        render(Subject, { props: { label: "L", open: true, children: modalBody() } });
        const el = screen.getByRole("dialog");
        expect(el.tagName).toBe("DIALOG");
        expect(el.classList.contains("sheet")).toBe(true);
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(el.getAttribute("aria-modal")).toBe("true");
    });

    test("opening moves focus inside", () => {
        render(Subject, { props: { label: "L", open: true, children: modalBody() } });
        expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    });

    test("the native cancel event (Escape) closes it", async () => {
        render(Subject, { props: { label: "L", open: true, children: modalBody() } });
        await fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("closing returns focus to the trigger", async () => {
        const { rerender } = render(Subject, {
            props: { label: "L", open: true, children: modalBody() },
        });
        expect(document.activeElement).not.toBe(trigger);
        await rerender({ label: "L", open: false, children: modalBody() });
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(document.activeElement).toBe(trigger);
    });
});
