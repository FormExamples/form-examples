import { render, screen } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import Subject from "./Tour.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("Tour", () => {
    test("renders dialog when active", () => {
        render(Subject, {
            props: {
                label: "Getting started",
                active: true,
                children: textSnippet("Tour content"),
            },
        });
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("does not render when not active", () => {
        render(Subject, {
            props: {
                label: "Getting started",
                active: false,
                children: textSnippet("Tour content"),
            },
        });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("defaults to not active", () => {
        render(Subject, {
            props: {
                label: "Tour",
                children: textSnippet("content"),
            },
        });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: {
                label: "Onboarding tour",
                active: true,
                children: textSnippet("content"),
            },
        });
        expect(screen.getByLabelText("Onboarding tour")).toBeTruthy();
    });

    // P18-T6: a tour is non-modal (the page it points at must stay usable), so it must not claim aria-modal.
    test("is non-modal: no aria-modal", () => {
        render(Subject, {
            props: {
                label: "Tour",
                active: true,
                children: textSnippet("content"),
            },
        });
        expect(screen.getByRole("dialog").hasAttribute("aria-modal")).toBe(false);
    });

    test("has tabindex -1 for keyboard events", () => {
        render(Subject, {
            props: {
                label: "Tour",
                active: true,
                children: textSnippet("content"),
            },
        });
        expect(screen.getByRole("dialog").getAttribute("tabindex")).toBe("-1");
    });

    test("renders children content", () => {
        render(Subject, {
            props: {
                label: "Tour",
                active: true,
                children: textSnippet("Step content here"),
            },
        });
        expect(screen.getByText("Step content here")).toBeTruthy();
    });

    test("closes on Escape key", async () => {
        const user = userEvent.setup();
        render(Subject, {
            props: {
                label: "Tour",
                active: true,
                children: textSnippet("content"),
            },
        });
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        await user.keyboard("{Escape}");
        await vi.waitFor(() => {
            expect(screen.queryByRole("dialog")).toBeNull();
        });
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: {
                label: "Tour",
                active: true,
                "data-testid": "my-tour",
                children: textSnippet("content"),
            },
        });
        expect(screen.getByTestId("my-tour")).toBeTruthy();
    });
});
