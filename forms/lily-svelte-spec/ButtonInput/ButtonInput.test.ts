import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ButtonInput.svelte";

describe("ButtonInput", () => {
    test("renders as a button with value text", () => {
        render(Subject, { props: {
            value: "Click me",
        }});

        const button: HTMLElement = screen.getByRole("button", { name: "Click me" });
        expect(button).toBeTruthy();
    });

    test("renders as input[type=button]", () => {
        render(Subject, { props: {
            value: "Test",
        }});

        const button: HTMLInputElement = screen.getByRole("button") as HTMLInputElement;
        expect(button.tagName.toLowerCase()).toBe("input");
        expect(button.type).toBe("button");
    });

    test("can be disabled", () => {
        render(Subject, { props: {
            value: "Disabled",
            disabled: true,
        }});

        const button: HTMLInputElement = screen.getByRole("button") as HTMLInputElement;
        expect(button.disabled).toBe(true);
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: {
            value: "Click",
            onclick: handleClick,
        }});

        const button: HTMLElement = screen.getByRole("button");
        await user.click(button);
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("applies name attribute", () => {
        render(Subject, { props: {
            value: "Submit",
            name: "action-btn",
        }});

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("name")).toBe("action-btn");
    });

    test("applies aria-label when label prop is provided", () => {
        render(Subject, { props: {
            value: "X",
            label: "Close dialog",
        }});

        const button: HTMLElement = screen.getByRole("button", { name: "Close dialog" });
        expect(button).toBeTruthy();
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: {
            value: "Focus",
        }});

        const button: HTMLElement = screen.getByRole("button");
        await user.tab();
        expect(document.activeElement).toBe(button);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            value: "Test",
            "data-testid": "btn-input",
        }});

        const button: HTMLElement = screen.getByTestId("btn-input");
        expect(button).toBeTruthy();
    });
});
