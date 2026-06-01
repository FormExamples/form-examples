import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./MentionsInput.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("MentionsInput", () => {
    test("renders as a div with the mentions-input class", () => {
        const { container } = render(Subject, { props: {
            label: "Comment",
        }});

        const root = container.querySelector("div.mentions-input") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("inner input has combobox role and aria attributes", () => {
        render(Subject, { props: {
            label: "Comment",
        }});

        const input = screen.getByRole("combobox");
        expect(input.getAttribute("aria-label")).toBe("Comment");
        expect(input.getAttribute("aria-haspopup")).toBe("listbox");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
    });

    test("aria-expanded reflects expanded prop", () => {
        render(Subject, { props: {
            label: "Comment",
            expanded: true,
        }});

        const input = screen.getByRole("combobox");
        expect(input.getAttribute("aria-expanded")).toBe("true");
    });

    test("default trigger char is @", () => {
        const { container } = render(Subject, { props: {
            label: "Comment",
        }});

        const root = container.querySelector("div.mentions-input") as HTMLElement;
        expect(root.getAttribute("data-trigger-char")).toBe("@");
    });

    test("supports custom trigger char", () => {
        const { container } = render(Subject, { props: {
            label: "Comment",
            triggerChar: "#",
        }});

        const root = container.querySelector("div.mentions-input") as HTMLElement;
        expect(root.getAttribute("data-trigger-char")).toBe("#");
    });

    test("input shows value", () => {
        const { container } = render(Subject, { props: {
            label: "Comment",
            value: "Hello @",
        }});

        const input = container.querySelector("input.mentions-input-control") as HTMLInputElement;
        expect(input.value).toBe("Hello @");
    });

    test("input shows placeholder", () => {
        const { container } = render(Subject, { props: {
            label: "Comment",
            placeholder: "Mention someone",
        }});

        const input = container.querySelector("input.mentions-input-control") as HTMLInputElement;
        expect(input.getAttribute("placeholder")).toBe("Mention someone");
    });

    test("input can be disabled", () => {
        const { container } = render(Subject, { props: {
            label: "Comment",
            disabled: true,
        }});

        const input = container.querySelector("input.mentions-input-control") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("suggestions panel is hidden when not expanded", () => {
        const { container } = render(Subject, { props: {
            label: "Comment",
            children: textSnippet("Suggestions"),
        }});

        const panel = container.querySelector(".mentions-input-suggestions") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("suggestions panel is visible when expanded", () => {
        const { container } = render(Subject, { props: {
            label: "Comment",
            expanded: true,
            children: textSnippet("Suggestions"),
        }});

        const panel = container.querySelector(".mentions-input-suggestions") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);
        expect(panel.textContent).toContain("Suggestions");
    });

    test("invokes oninput handler when typing", async () => {
        const user: UserEvent = userEvent.setup();
        const handleInput = vi.fn();
        render(Subject, { props: {
            label: "Comment",
            oninput: handleInput,
        }});

        const input = screen.getByRole("combobox");
        await user.type(input, "h");
        expect(handleInput).toHaveBeenCalled();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Comment",
            class: "extra",
        }});

        const root = container.querySelector("div.mentions-input") as HTMLElement;
        expect(root.className).toContain("mentions-input");
        expect(root.className).toContain("extra");
    });
});
