import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ActionLink.svelte";

// Helper to create a Svelte 5 snippet for children content.
// Svelte 5 snippets are functions that receive an anchor node and insert DOM nodes before it.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ActionLink", () => {
    test("renders as a link with href", () => {
        render(Subject, { props: {
            href: "/example",
            children: textSnippet("Go to example"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "Go to example" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/example");
    });

    test("applies aria-label when label prop is provided", () => {
        render(Subject, { props: {
            href: "/next",
            label: "Navigate to next section",
            children: textSnippet("Next"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "Navigate to next section" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("aria-label")).toBe("Navigate to next section");
    });

    test("does not set aria-label when label prop is not provided", () => {
        render(Subject, { props: {
            href: "/test",
            children: textSnippet("Test link"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "Test link" });
        expect(link.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            href: "/ext",
            target: "_blank",
            rel: "noopener noreferrer",
            children: textSnippet("External"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "External" });
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: {
            href: "/keyboard",
            children: textSnippet("Keyboard nav"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "Keyboard nav" });
        await user.tab();
        expect(document.activeElement).toBe(link);
    });
});
