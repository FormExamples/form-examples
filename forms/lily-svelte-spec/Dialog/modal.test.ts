// A dialog that says `aria-modal` must be a real modal: opened with showModal(), not just given an `open` attribute.
// jsdom has no showModal, so these tests stub it on the prototype (the way a browser would behave) and assert the calls.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import Dialog from "./Dialog.svelte";
import AlertDialog from "../AlertDialog/AlertDialog.svelte";
import FileDialog from "../FileDialog/FileDialog.svelte";
import TimeoutDialog from "../TimeoutDialog/TimeoutDialog.svelte";
import { modalDialog } from "./modal.js";

const body = () => createRawSnippet(() => ({ render: () => `<button>OK</button>` }));

const proto = HTMLDialogElement.prototype as unknown as {
    showModal?: () => void;
    close?: () => void;
    show?: () => void;
};
let showModal: ReturnType<typeof vi.fn>;
let close: ReturnType<typeof vi.fn>;

beforeEach(() => {
    showModal = vi.fn(function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
        (this as unknown as { __modal: boolean }).__modal = true;
    });
    close = vi.fn(function (this: HTMLDialogElement) {
        this.removeAttribute("open");
    });
    proto.showModal = showModal as unknown as typeof proto.showModal;
    proto.close = close as unknown as typeof proto.close;
});

afterEach(() => {
    delete proto.showModal;
    delete proto.close;
});

describe("modalDialog action", () => {
    test("opens with showModal() when modal", () => {
        const node = document.createElement("dialog");
        modalDialog(node, true);
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(node.open).toBe(true);
    });

    test("opens as a plain dialog, without showModal(), when not modal", () => {
        const node = document.createElement("dialog");
        modalDialog(node, false);
        expect(showModal).not.toHaveBeenCalled();
        expect(node.hasAttribute("open")).toBe(true);
    });

    test("falls back to the open attribute where showModal is missing", () => {
        delete proto.showModal;
        const node = document.createElement("dialog");
        modalDialog(node, true);
        expect(node.hasAttribute("open")).toBe(true);
    });

    test("closes the dialog when it is destroyed", () => {
        const node = document.createElement("dialog");
        const action = modalDialog(node, true);
        action.destroy();
        expect(close).toHaveBeenCalledTimes(1);
        expect(node.hasAttribute("open")).toBe(false);
    });

    test("returns focus to where it was when the dialog is destroyed", () => {
        const opener = document.createElement("button");
        document.body.append(opener);
        opener.focus();
        const node = document.createElement("dialog");
        document.body.append(node);
        const action = modalDialog(node, true);
        const inner = document.createElement("button");
        node.append(inner);
        inner.focus();
        node.remove();
        action.destroy();
        expect(document.activeElement).toBe(opener);
        opener.remove();
    });

    test("switching between modal and non-modal closes and reopens the right way", () => {
        const node = document.createElement("dialog");
        const action = modalDialog(node, true);
        action.update(false);
        expect(close).toHaveBeenCalledTimes(1);
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(node.hasAttribute("open")).toBe(true);
        action.update(true);
        expect(showModal).toHaveBeenCalledTimes(2);
    });
});

describe("Dialog", () => {
    test("a modal Dialog is opened with showModal()", () => {
        render(Dialog, { props: { label: "D", open: true, children: body() } });
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("a non-modal Dialog is not, and says so", () => {
        render(Dialog, { props: { label: "D", open: true, modal: false, children: body() } });
        expect(showModal).not.toHaveBeenCalled();
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBeNull();
    });

    test("the browser's cancel (Escape) closes it: the dialog is removed", async () => {
        render(Dialog, { props: { label: "D", open: true, children: body() } });
        await fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("closing from inside (a form method=dialog) closes it too", async () => {
        render(Dialog, { props: { label: "D", open: true, children: body() } });
        await fireEvent(screen.getByRole("dialog"), new Event("close"));
        expect(screen.queryByRole("dialog")).toBeNull();
    });
});

describe("AlertDialog and FileDialog are modal too", () => {
    test("AlertDialog opens with showModal()", () => {
        render(AlertDialog, { props: { open: true, title: "Delete?", children: body() } });
        expect(showModal).toHaveBeenCalledTimes(1);
    });

    test("AlertDialog closes on cancel", async () => {
        render(AlertDialog, { props: { open: true, title: "Delete?", children: body() } });
        await fireEvent(screen.getByRole("alertdialog"), new Event("cancel", { cancelable: true }));
        expect(screen.queryByRole("alertdialog")).toBeNull();
    });

    test("FileDialog opens with showModal() and closes on cancel", async () => {
        render(FileDialog, { props: { label: "Open", open: true, children: body() } });
        expect(showModal).toHaveBeenCalledTimes(1);
        await fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
        expect(screen.queryByRole("dialog")).toBeNull();
    });
});

describe("TimeoutDialog", () => {
    test("is shown with showModal() while open, and closed with close() when it stops being open", async () => {
        const { rerender } = render(TimeoutDialog, {
            props: { label: "Session", open: true, children: body() },
        });
        expect(showModal).toHaveBeenCalledTimes(1);
        await rerender({ label: "Session", open: false, children: body() });
        expect(close).toHaveBeenCalledTimes(1);
    });

    test("stays closed while not open", () => {
        render(TimeoutDialog, { props: { label: "Session", open: false, children: body() } });
        expect(showModal).not.toHaveBeenCalled();
    });
});
