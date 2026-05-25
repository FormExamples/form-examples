import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Coachmark.svelte";

describe("Coachmark", () => {
    test("renders as a dialog with the coachmark class", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "New feature",
            dismissLabel: "Dismiss",
        }});

        const root = container.querySelector("div.coachmark") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("dialog");
        expect(root.getAttribute("aria-modal")).toBe("false");
    });

    test("is hidden when open is false", () => {
        const { container } = render(Subject, { props: {
            open: false,
            title: "New feature",
            dismissLabel: "Dismiss",
        }});

        const root = container.querySelector(".coachmark") as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(true);
    });

    test("is visible when open is true", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "New feature",
            dismissLabel: "Dismiss",
        }});

        const root = container.querySelector(".coachmark") as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(false);
    });

    test("renders the title", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Try this!",
            dismissLabel: "Dismiss",
        }});

        const heading = container.querySelector(".coachmark-title") as HTMLElement;
        expect(heading.textContent).toContain("Try this!");
    });

    test("aria-labelledby points at the title id", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Try this!",
            dismissLabel: "Dismiss",
        }});

        const root = container.querySelector(".coachmark") as HTMLElement;
        const heading = container.querySelector(".coachmark-title") as HTMLElement;
        expect(root.getAttribute("aria-labelledby")).toBe(heading.id);
        expect(heading.id).toBeTruthy();
    });

    test("renders description when provided", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Try this!",
            description: "It's great.",
            dismissLabel: "Dismiss",
        }});

        const desc = container.querySelector(".coachmark-description") as HTMLElement;
        expect(desc).toBeTruthy();
        expect(desc.textContent).toContain("It's great.");

        const root = container.querySelector(".coachmark") as HTMLElement;
        expect(root.getAttribute("aria-describedby")).toBe(desc.id);
    });

    test("does not render description when not provided", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Try this!",
            dismissLabel: "Dismiss",
        }});

        expect(container.querySelector(".coachmark-description")).toBeNull();
        const root = container.querySelector(".coachmark") as HTMLElement;
        expect(root.getAttribute("aria-describedby")).toBeNull();
    });

    test("dismiss button calls onDismiss", async () => {
        const user: UserEvent = userEvent.setup();
        const handle = vi.fn();
        render(Subject, { props: {
            open: true,
            title: "Try this!",
            dismissLabel: "Dismiss",
            onDismiss: handle,
        }});

        await user.click(screen.getByRole("button", { name: "Dismiss" }));
        expect(handle).toHaveBeenCalledOnce();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            open: true,
            title: "Try this!",
            dismissLabel: "Dismiss",
            class: "extra",
        }});

        const root = container.querySelector(".coachmark") as HTMLElement;
        expect(root.className).toContain("coachmark");
        expect(root.className).toContain("extra");
    });
});
