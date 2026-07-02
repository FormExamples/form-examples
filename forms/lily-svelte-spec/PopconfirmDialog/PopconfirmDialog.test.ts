import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./PopconfirmDialog.svelte";

describe("PopconfirmDialog", () => {
    test("renders as a div with the popconfirm-dialog class and alertdialog role", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Delete?",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
        }});

        const root = container.querySelector("div.popconfirm-dialog") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("alertdialog");
        expect(root.getAttribute("aria-modal")).toBe("false");
    });

    test("hidden when not open", () => {
        const { container } = render(Subject, { props: {
            open: false,
            title: "Delete?",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
        }});

        const root = container.querySelector("div.popconfirm-dialog") as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(true);
    });

    test("visible when open", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Delete?",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
        }});

        const root = container.querySelector("div.popconfirm-dialog") as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(false);
    });

    test("renders title and links via aria-labelledby", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Delete this item?",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
        }});

        const root = container.querySelector("div.popconfirm-dialog") as HTMLElement;
        const titleEl = container.querySelector(".popconfirm-dialog-title") as HTMLElement;
        expect(titleEl.textContent).toContain("Delete this item?");
        const labelledBy = root.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();
        expect(titleEl.id).toBe(labelledBy);
    });

    test("renders description when provided and links via aria-describedby", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Delete?",
            description: "This cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
        }});

        const root = container.querySelector("div.popconfirm-dialog") as HTMLElement;
        const descEl = container.querySelector(".popconfirm-dialog-description") as HTMLElement;
        expect(descEl).toBeTruthy();
        expect(descEl.textContent).toContain("This cannot be undone.");
        const describedBy = root.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        expect(descEl.id).toBe(describedBy);
    });

    test("omits description and aria-describedby when not provided", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Delete?",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
        }});

        const root = container.querySelector("div.popconfirm-dialog") as HTMLElement;
        expect(container.querySelector(".popconfirm-dialog-description")).toBeNull();
        expect(root.getAttribute("aria-describedby")).toBeNull();
    });

    test("renders confirm and cancel buttons with provided labels", () => {
        render(Subject, { props: {
            open: true,
            title: "Delete?",
            confirmLabel: "Yes, delete",
            cancelLabel: "Keep",
        }});

        const confirm = screen.getByRole("button", { name: "Yes, delete" });
        const cancel = screen.getByRole("button", { name: "Keep" });
        expect(confirm).toBeTruthy();
        expect(cancel).toBeTruthy();
    });

    test("invokes onconfirm when confirm clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleConfirm = vi.fn();
        render(Subject, { props: {
            open: true,
            title: "Delete?",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            onconfirm: handleConfirm,
        }});

        await user.click(screen.getByRole("button", { name: "Delete" }));
        expect(handleConfirm).toHaveBeenCalledOnce();
    });

    test("invokes oncancel when cancel clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleCancel = vi.fn();
        render(Subject, { props: {
            open: true,
            title: "Delete?",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            oncancel: handleCancel,
        }});

        await user.click(screen.getByRole("button", { name: "Cancel" }));
        expect(handleCancel).toHaveBeenCalledOnce();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "T",
            confirmLabel: "C",
            cancelLabel: "X",
            class: "extra",
        }});

        const root = container.querySelector("div.popconfirm-dialog") as HTMLElement;
        expect(root.className).toContain("popconfirm-dialog");
        expect(root.className).toContain("extra");
    });
});
