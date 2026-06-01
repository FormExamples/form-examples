import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FloatButton.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("FloatButton", () => {
    test("renders as a button with the float-button class", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
            children: textSnippet("?"),
        }});

        const root = container.querySelector("button.float-button") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies aria-label", () => {
        render(Subject, { props: {
            label: "Open help",
            children: textSnippet("?"),
        }});

        const button = screen.getByRole("button", { name: "Open help" });
        expect(button).toBeTruthy();
    });

    test("defaults to bottom-right position", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
            children: textSnippet("?"),
        }});

        const button = container.querySelector("button") as HTMLElement;
        expect(button.getAttribute("data-position")).toBe("bottom-right");
        const style = button.getAttribute("style") ?? "";
        expect(style).toContain("position: fixed");
        expect(style).toContain("bottom: 1rem");
        expect(style).toContain("right: 1rem");
    });

    test("supports top-left position", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
            position: "top-left",
            children: textSnippet("?"),
        }});

        const button = container.querySelector("button") as HTMLElement;
        expect(button.getAttribute("data-position")).toBe("top-left");
        const style = button.getAttribute("style") ?? "";
        expect(style).toContain("top: 1rem");
        expect(style).toContain("left: 1rem");
    });

    test("supports top-right position", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
            position: "top-right",
            children: textSnippet("?"),
        }});

        const button = container.querySelector("button") as HTMLElement;
        const style = button.getAttribute("style") ?? "";
        expect(style).toContain("top: 1rem");
        expect(style).toContain("right: 1rem");
    });

    test("supports bottom-left position", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
            position: "bottom-left",
            children: textSnippet("?"),
        }});

        const button = container.querySelector("button") as HTMLElement;
        const style = button.getAttribute("style") ?? "";
        expect(style).toContain("bottom: 1rem");
        expect(style).toContain("left: 1rem");
    });

    test("defaults to type button", () => {
        render(Subject, { props: {
            label: "Help",
            children: textSnippet("?"),
        }});

        const button = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("can be disabled", () => {
        render(Subject, { props: {
            label: "Help",
            disabled: true,
            children: textSnippet("?"),
        }});

        const button = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: {
            label: "Help",
            onclick: handleClick,
            children: textSnippet("?"),
        }});

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
            class: "extra",
            children: textSnippet("?"),
        }});

        const root = container.querySelector("button") as HTMLElement;
        expect(root.className).toContain("float-button");
        expect(root.className).toContain("extra");
    });
});
