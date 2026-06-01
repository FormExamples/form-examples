import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./EditableForm.svelte";

function buttonSnippet(label: string) {
    return (($$anchor: Comment) => {
        const btn = document.createElement("button");
        btn.type = "submit";
        btn.textContent = label;
        $$anchor.before(btn);
    }) as any;
}

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("EditableForm", () => {
    test("hidden when not editing", () => {
        render(Subject, { props: { label: "Edit", editing: false, children: textSnippet("Form") } });
        expect(screen.queryByRole("form")).toBeNull();
    });

    test("visible when editing", () => {
        render(Subject, { props: { label: "Edit", editing: true, children: textSnippet("Form") } });
        expect(screen.getByRole("form", { name: "Edit" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Edit", editing: true, children: textSnippet("My form") } });
        expect(screen.getByRole("form").textContent).toContain("My form");
    });

    test("calls onsubmit on form submit", async () => {
        const user: UserEvent = userEvent.setup();
        const handleSubmit = vi.fn();
        render(Subject, { props: {
            label: "Edit",
            editing: true,
            onsubmit: handleSubmit,
            children: buttonSnippet("Save"),
        }});

        await user.click(screen.getByRole("button", { name: "Save" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });

    test("calls oncancel on Escape", async () => {
        const user: UserEvent = userEvent.setup();
        const handleCancel = vi.fn();
        render(Subject, { props: {
            label: "Edit",
            editing: true,
            oncancel: handleCancel,
            children: textSnippet("Form"),
        }});

        screen.getByRole("form").focus();
        await user.keyboard("{Escape}");
        expect(handleCancel).toHaveBeenCalledOnce();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Edit", editing: true, "data-testid": "ef", children: textSnippet("C") } });
        expect(screen.getByTestId("ef")).toBeTruthy();
    });
});
