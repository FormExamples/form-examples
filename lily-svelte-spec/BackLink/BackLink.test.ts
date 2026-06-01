import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./BackLink.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("BackLink", () => {
    test("renders as a link with href", () => {
        render(Subject, { props: {
            href: "/previous",
            children: textSnippet("Back"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "Back" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/previous");
    });

    test("applies aria-label when label prop is provided", () => {
        render(Subject, { props: {
            href: "/dashboard",
            label: "Return to dashboard",
            children: textSnippet("Back"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "Return to dashboard" });
        expect(link.getAttribute("aria-label")).toBe("Return to dashboard");
    });

    test("does not set aria-label when label prop is not provided", () => {
        render(Subject, { props: {
            href: "/home",
            children: textSnippet("Go back"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "Go back" });
        expect(link.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            href: "/home",
            "data-testid": "back-link",
            children: textSnippet("Back"),
        }});

        const link: HTMLElement = screen.getByTestId("back-link");
        expect(link).toBeTruthy();
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: {
            href: "/prev",
            children: textSnippet("Back"),
        }});

        const link: HTMLElement = screen.getByRole("link");
        await user.tab();
        expect(document.activeElement).toBe(link);
    });
});
