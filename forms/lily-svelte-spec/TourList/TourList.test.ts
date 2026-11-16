import { render, screen } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import Subject from "./TourList.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("TourList", () => {
    test("renders the list when active", () => {
        render(Subject, {
            props: {
                label: "Getting started",
                active: true,
                children: textSnippet("Welcome"),
            },
        });
        expect(screen.getByRole("list")).toBeTruthy();
    });

    test("does not render when not active", () => {
        render(Subject, {
            props: {
                label: "Getting started",
                active: false,
                children: textSnippet("Welcome"),
            },
        });
        expect(screen.queryByRole("list")).toBeNull();
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

    // P18-T6: a list of steps, not a dialog. role="dialog" hid the list semantics and aria-modal claimed a
    // modality nothing provided.
    test("is a plain ordered list: no role=dialog, no aria-modal", () => {
        render(Subject, {
            props: {
                label: "Tour",
                active: true,
                children: textSnippet("content"),
            },
        });
        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
        expect(list.hasAttribute("role")).toBe(false);
        expect(list.hasAttribute("aria-modal")).toBe(false);
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("has tabindex -1 for keyboard events", () => {
        render(Subject, {
            props: {
                label: "Tour",
                active: true,
                children: textSnippet("content"),
            },
        });
        expect(screen.getByRole("list").getAttribute("tabindex")).toBe("-1");
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
        const list = screen.getByRole("list");
        list.focus();
        await user.keyboard("{Escape}");
        await vi.waitFor(() => {
            expect(screen.queryByRole("list")).toBeNull();
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
