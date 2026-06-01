import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./IconButton.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("IconButton", () => {
    test("renders as a button with the icon-button class", () => {
        const { container } = render(Subject, { props: {
            label: "Close",
            children: textSnippet("×"),
        }});

        const root = container.querySelector("button.icon-button") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("requires and applies aria-label", () => {
        render(Subject, { props: {
            label: "Close dialog",
            children: textSnippet("×"),
        }});

        const button = screen.getByRole("button", { name: "Close dialog" });
        expect(button).toBeTruthy();
        expect(button.getAttribute("aria-label")).toBe("Close dialog");
    });

    test("defaults to type button", () => {
        render(Subject, { props: {
            label: "Search",
            children: textSnippet("🔍"),
        }});

        const button = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("accepts submit type", () => {
        render(Subject, { props: {
            label: "Submit",
            type: "submit",
            children: textSnippet("✓"),
        }});

        const button = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("submit");
    });

    test("can be disabled", () => {
        render(Subject, { props: {
            label: "Disabled",
            disabled: true,
            children: textSnippet("X"),
        }});

        const button = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: {
            label: "Click",
            onclick: handleClick,
            children: textSnippet("→"),
        }});

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("supports aria-pressed for toggle buttons", () => {
        render(Subject, { props: {
            label: "Toggle",
            pressed: true,
            children: textSnippet("★"),
        }});

        const button = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBe("true");
    });

    test("does not have aria-pressed when not a toggle", () => {
        render(Subject, { props: {
            label: "Action",
            children: textSnippet("→"),
        }});

        const button = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBeNull();
    });

    test("activates via Enter key", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: {
            label: "Activate",
            onclick: handleClick,
            children: textSnippet("⏎"),
        }});

        await user.tab();
        await user.keyboard("{Enter}");
        expect(handleClick).toHaveBeenCalled();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "X",
            class: "extra",
            children: textSnippet("X"),
        }});

        const root = container.querySelector("button") as HTMLElement;
        expect(root.className).toContain("icon-button");
        expect(root.className).toContain("extra");
    });
});
