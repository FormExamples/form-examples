import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ActionGroup.svelte";

describe("ActionGroup", () => {
    test("renders as a group with the action-group class", () => {
        const { container } = render(Subject, { props: {
            label: "Editing actions",
        }});

        const root = container.querySelector("div.action-group") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("group");
    });

    test("applies aria-label", () => {
        render(Subject, { props: {
            label: "Editing actions",
        }});

        const group = screen.getByRole("group", { name: "Editing actions" });
        expect(group).toBeTruthy();
    });

    test("does not render overflow trigger when overflow snippet is absent", () => {
        const { container } = render(Subject, { props: {
            label: "Editing",
        }});

        expect(container.querySelector(".action-group-overflow-trigger")).toBeNull();
        expect(container.querySelector(".action-group-overflow-menu")).toBeNull();
    });

    test("renders overflow trigger with aria-haspopup and aria-expanded when overflow provided", () => {
        const { container } = render(Subject, { props: {
            label: "Editing",
            overflowLabel: "More actions",
            overflowOpen: false,
            overflow: (($$anchor: Comment) => {
                const node = document.createTextNode("menu items");
                $$anchor.before(node);
            }) as any,
        }});

        const trigger = container.querySelector(
            ".action-group-overflow-trigger",
        ) as HTMLElement;
        expect(trigger).toBeTruthy();
        expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(trigger.getAttribute("aria-label")).toBe("More actions");
    });

    test("hides overflow menu when overflowOpen is false", () => {
        const { container } = render(Subject, { props: {
            label: "Editing",
            overflowOpen: false,
            overflow: (($$anchor: Comment) => {
                const node = document.createTextNode("menu items");
                $$anchor.before(node);
            }) as any,
        }});

        const menu = container.querySelector(
            ".action-group-overflow-menu",
        ) as HTMLElement;
        expect(menu.hasAttribute("hidden")).toBe(true);
    });

    test("shows overflow menu when overflowOpen is true", () => {
        const { container } = render(Subject, { props: {
            label: "Editing",
            overflowOpen: true,
            overflow: (($$anchor: Comment) => {
                const node = document.createTextNode("menu items");
                $$anchor.before(node);
            }) as any,
        }});

        const menu = container.querySelector(
            ".action-group-overflow-menu",
        ) as HTMLElement;
        expect(menu.hasAttribute("hidden")).toBe(false);
    });

    test("calls onOverflowToggle when trigger clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handle = vi.fn();
        render(Subject, { props: {
            label: "Editing",
            overflowLabel: "More",
            onOverflowToggle: handle,
            overflow: (($$anchor: Comment) => {
                const node = document.createTextNode("menu items");
                $$anchor.before(node);
            }) as any,
        }});

        await user.click(screen.getByRole("button", { name: "More" }));
        expect(handle).toHaveBeenCalledOnce();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Editing",
            class: "extra",
        }});

        const root = container.querySelector(".action-group") as HTMLElement;
        expect(root.className).toContain("action-group");
        expect(root.className).toContain("extra");
    });
});
