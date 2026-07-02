import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ContextualHelp.svelte";

describe("ContextualHelp", () => {
    test("renders with the contextual-help wrapper class", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
        }});

        const root = container.querySelector("div.contextual-help") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("trigger button has aria-label, aria-haspopup, aria-expanded, aria-controls", () => {
        const { container } = render(Subject, { props: {
            label: "Help with this field",
            expanded: false,
        }});

        const trigger = container.querySelector(
            ".contextual-help-trigger",
        ) as HTMLElement;
        expect(trigger.getAttribute("aria-label")).toBe("Help with this field");
        expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");

        const panel = container.querySelector(
            ".contextual-help-panel",
        ) as HTMLElement;
        expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
        expect(panel.id).toBeTruthy();
    });

    test("panel has role dialog and is hidden when collapsed", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
            expanded: false,
        }});

        const panel = container.querySelector(
            ".contextual-help-panel",
        ) as HTMLElement;
        expect(panel.getAttribute("role")).toBe("dialog");
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("panel is visible when expanded", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
            expanded: true,
        }});

        const panel = container.querySelector(
            ".contextual-help-panel",
        ) as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);

        const trigger = container.querySelector(
            ".contextual-help-trigger",
        ) as HTMLElement;
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    test("calls onclick when trigger clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handle = vi.fn();
        render(Subject, { props: {
            label: "Help",
            onclick: handle,
        }});

        await user.click(screen.getByRole("button", { name: "Help" }));
        expect(handle).toHaveBeenCalledOnce();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Help",
            class: "extra",
        }});

        const root = container.querySelector(".contextual-help") as HTMLElement;
        expect(root.className).toContain("contextual-help");
        expect(root.className).toContain("extra");
    });
});
