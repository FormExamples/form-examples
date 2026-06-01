import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Button.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Button", () => {
    test("renders as a button", () => {
        render(Subject, { props: {
            children: textSnippet("Click me"),
        }});

        const button: HTMLElement = screen.getByRole("button", { name: "Click me" });
        expect(button).toBeTruthy();
    });

    test("defaults to type button", () => {
        render(Subject, { props: {
            children: textSnippet("Click"),
        }});

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("accepts submit type", () => {
        render(Subject, { props: {
            type: "submit",
            children: textSnippet("Submit"),
        }});

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("submit");
    });

    test("can be disabled", () => {
        render(Subject, { props: {
            disabled: true,
            children: textSnippet("Disabled"),
        }});

        const button: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: {
            onclick: handleClick,
            children: textSnippet("Click"),
        }});

        const button: HTMLElement = screen.getByRole("button");
        await user.click(button);
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("does not fire click when disabled", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: {
            disabled: true,
            onclick: handleClick,
            children: textSnippet("Disabled"),
        }});

        const button: HTMLElement = screen.getByRole("button");
        await user.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    test("supports aria-pressed for toggle buttons", () => {
        render(Subject, { props: {
            pressed: true,
            children: textSnippet("Toggle"),
        }});

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBe("true");
    });

    test("does not have aria-pressed when not a toggle button", () => {
        render(Subject, { props: {
            children: textSnippet("Normal"),
        }});

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-pressed")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        render(Subject, { props: {
            label: "Close dialog",
            children: textSnippet("X"),
        }});

        const button: HTMLElement = screen.getByRole("button", { name: "Close dialog" });
        expect(button).toBeTruthy();
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: {
            children: textSnippet("Focus me"),
        }});

        const button: HTMLElement = screen.getByRole("button");
        await user.tab();
        expect(document.activeElement).toBe(button);
    });

    test("activates via Enter key", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: {
            onclick: handleClick,
            children: textSnippet("Press Enter"),
        }});

        const button: HTMLElement = screen.getByRole("button");
        await user.tab();
        await user.keyboard("{Enter}");
        expect(handleClick).toHaveBeenCalled();
    });

    test("activates via Space key", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: {
            onclick: handleClick,
            children: textSnippet("Press Space"),
        }});

        const button: HTMLElement = screen.getByRole("button");
        await user.tab();
        await user.keyboard(" ");
        expect(handleClick).toHaveBeenCalled();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            "data-testid": "my-btn",
            id: "btn-1",
            children: textSnippet("Custom"),
        }});

        const button: HTMLElement = screen.getByTestId("my-btn");
        expect(button.getAttribute("id")).toBe("btn-1");
    });
});
