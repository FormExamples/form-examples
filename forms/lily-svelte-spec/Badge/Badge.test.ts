import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Badge.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Badge", () => {
    test("renders with status role", () => {
        render(Subject, { props: {
            children: textSnippet("New"),
        }});

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge).toBeTruthy();
        expect(badge.textContent).toContain("New");
    });

    test("defaults to type default", () => {
        render(Subject, { props: {
            children: textSnippet("Badge"),
        }});

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("data-type")).toBe("default");
    });

    test("applies custom type", () => {
        render(Subject, { props: {
            type: "error",
            children: textSnippet("Error"),
        }});

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("data-type")).toBe("error");
    });

    test("applies aria-label when label prop is provided", () => {
        render(Subject, { props: {
            label: "3 unread messages",
            children: textSnippet("3"),
        }});

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("aria-label")).toBe("3 unread messages");
    });

    test("does not set aria-label when label prop is not provided", () => {
        render(Subject, { props: {
            children: textSnippet("Info"),
        }});

        const badge: HTMLElement = screen.getByRole("status");
        expect(badge.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            "data-testid": "my-badge",
            id: "badge-1",
            children: textSnippet("Tag"),
        }});

        const badge: HTMLElement = screen.getByTestId("my-badge");
        expect(badge.getAttribute("id")).toBe("badge-1");
    });
});
