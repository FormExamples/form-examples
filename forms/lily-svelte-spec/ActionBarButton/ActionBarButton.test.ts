import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ActionBarButton.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ActionBarButton", () => {
    test("renders as a button with the action-bar-button class", () => {
        const { container } = render(Subject, { props: {
            label: "Delete",
            children: textSnippet("Delete"),
        }});

        const root = container.querySelector("button.action-bar-button") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies aria-label", () => {
        render(Subject, { props: {
            label: "Delete items",
            children: textSnippet("Delete"),
        }});

        const button = screen.getByRole("button", { name: "Delete items" });
        expect(button).toBeTruthy();
    });

    test("defaults to type button", () => {
        render(Subject, { props: {
            label: "Delete",
            children: textSnippet("Delete"),
        }});

        const button = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("can be disabled", () => {
        render(Subject, { props: {
            label: "Delete",
            disabled: true,
            children: textSnippet("Delete"),
        }});

        const button = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handle = vi.fn();
        render(Subject, { props: {
            label: "Delete",
            onclick: handle,
            children: textSnippet("Delete"),
        }});

        await user.click(screen.getByRole("button"));
        expect(handle).toHaveBeenCalledOnce();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Delete",
            class: "extra",
            children: textSnippet("Delete"),
        }});

        const root = container.querySelector("button") as HTMLElement;
        expect(root.className).toContain("action-bar-button");
        expect(root.className).toContain("extra");
    });
});
