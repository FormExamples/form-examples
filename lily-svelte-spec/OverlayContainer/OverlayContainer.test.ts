import { render } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./OverlayContainer.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("OverlayContainer", () => {
    test("renders with the overlay-container class", () => {
        const { container } = render(Subject, { props: {
            open: true,
            children: textSnippet("Modal"),
        }});

        const root = container.querySelector(".overlay-container") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("has role presentation", () => {
        const { container } = render(Subject, { props: {
            open: true,
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".overlay-container") as HTMLElement;
        expect(root.getAttribute("role")).toBe("presentation");
    });

    test("sets data-open and aria-hidden when open", () => {
        const { container } = render(Subject, { props: {
            open: true,
            children: textSnippet("Open"),
        }});

        const root = container.querySelector(".overlay-container") as HTMLElement;
        expect(root.getAttribute("data-open")).toBe("true");
        expect(root.getAttribute("aria-hidden")).toBe("false");
    });

    test("hides when open is false", () => {
        const { container } = render(Subject, { props: {
            open: false,
            children: textSnippet("Closed"),
        }});

        const root = container.querySelector(".overlay-container") as HTMLElement;
        expect(root.getAttribute("data-open")).toBe("false");
        expect(root.getAttribute("aria-hidden")).toBe("true");
        expect(root.hasAttribute("hidden")).toBe(true);
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, { props: {
            open: true,
            label: "Modal backdrop",
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".overlay-container") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Modal backdrop");
    });

    test("handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        const { container } = render(Subject, { props: {
            open: true,
            onclick: handleClick,
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".overlay-container") as HTMLElement;
        await user.click(root);
        expect(handleClick).toHaveBeenCalled();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            open: true,
            class: "extra",
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".overlay-container") as HTMLElement;
        expect(root.className).toContain("overlay-container");
        expect(root.className).toContain("extra");
    });
});
